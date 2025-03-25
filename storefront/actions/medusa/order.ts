"use server";
import type {HttpTypes, StoreCart} from "@medusajs/types";

import medusa from "@/data/medusa/client";
import {
  getAuthHeaders,
  getCacheTag,
  getCartId,
  removeCartId,
} from "@/data/medusa/cookies";
import {getCustomer} from "@/data/medusa/customer";
import {revalidateTag} from "next/cache";
import {redirect} from "next/navigation";

import {updateCart} from "./cart";
import medusaError from "@/utils/medusa/error";

type ActionState =
  | {error: null; status: "idle" | "success"}
  | {error: string; status: "error"};

export async function placeOrder() {
  const cartId = await getCartId();
  if (!cartId) {
    throw new Error("No existing cart found when placing an order");
  }

  const cartRes = await medusa.store.cart.complete(
    cartId,
    {},
    await getAuthHeaders(),
  );

  const cacheTag = await getCacheTag("carts");

  revalidateTag(cacheTag);

  if (cartRes?.type === "order") {
    await removeCartId();
    const countryCode =
      cartRes.order.shipping_address?.country_code?.toLowerCase();
    redirect(`/${countryCode}/order/confirmed/${cartRes.order.id}`);
  }

  return cartRes.cart;
}

export async function initiatePaymentSession(
  state: ActionState,
  payaload: {
    cart: StoreCart;
    data: {
      context?: Record<string, unknown>;
      provider_id: string;
    };
  },
): Promise<ActionState> {
  return medusa.store.payment
    .initiatePaymentSession(
      payaload.cart,
      payaload.data,
      {},
      await getAuthHeaders(),
    )
    .then(async () => {
      revalidateTag(await getCacheTag("carts"));
      return {error: null, status: "success"} as const;
    })
    .catch((e) => {
      return {error: e.message, status: "error"};
    });
}

export async function setCheckoutAddresses(
  address: HttpTypes.StoreUpdateCustomerAddress,
): Promise<ActionState> {
  try {
    if (!address) {
      throw new Error("No data found when setting addresses");
    }

    const cartId = await getCartId();
    const customer = await getCustomer();

    if (!cartId) {
      throw new Error("No existing cart found when setting addresses");
    }

    const data = {
      billing_address: address,
      shipping_address: address,
    } as any;

    await updateCart(data);

    return {error: null, status: "success"};
  } catch (e: any) {
    return {error: e.message, status: "error"};
  }
}

export async function setShippingMethod(id: string): Promise<ActionState> {
  const cartId = await getCartId();

  if (!cartId) return {error: "No cart id", status: "error"};

  return await medusa.store.cart
    .addShippingMethod(cartId, {option_id: id}, {}, await getAuthHeaders())
    .then(async () => {
      revalidateTag(await getCacheTag("carts"));
      return {error: null, status: "success"} as const;
    })
    .catch((e) => ({error: e.message, status: "error"}));
}

export const retrieveOrder = async (id: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  };

  return medusa.client
    .fetch<HttpTypes.StoreOrderResponse>(`/store/orders/${id}`, {
      method: "GET",
      query: {
        fields:
          "*payment_collections.payments,*items,*items.metadata,*items.variant,*items.product",
      },
      headers,
    })
    .then(({order}) => order)
    .catch((err) => medusaError(err));
};
