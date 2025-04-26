"use server";

import type {HttpTypes} from "@medusajs/types";

import medusa from "@/data/medusa/client";
import {getAuthHeaders, getCacheTag, getCartId} from "@/data/medusa/cookies";
import medusaError from "@/utils/medusa/error";
import {revalidateTag} from "next/cache";

export const updateCustomer = async (body: HttpTypes.StoreUpdateCustomer) => {
  const headers = {
    ...(await getAuthHeaders()),
  };

  const updateRes = await medusa.store.customer
    .update(body, {}, headers)
    .then(({customer}) => customer)
    .catch(medusaError);

  const cacheTag = await getCacheTag("customers");
  revalidateTag(cacheTag);

  return updateRes;
};

export const addCustomerAddress = async (
  address: HttpTypes.StoreCreateCustomerAddress,
): Promise<any> => {
  const headers = {
    ...(await getAuthHeaders()),
  };

  return medusa.store.customer
    .createAddress(address, {}, headers)
    .then(async ({customer}) => {
      const customerCacheTag = await getCacheTag("customers");
      revalidateTag(customerCacheTag);
      return {customer, error: null, success: true};
    })
    .catch((err) => {
      return {error: err.toString(), success: false};
    });
};

export const deleteCustomerAddress = async (
  addressId: string,
): Promise<void> => {
  const headers = {
    ...(await getAuthHeaders()),
  };

  await medusa.store.customer
    .deleteAddress(addressId, headers)
    .then(async () => {
      const customerCacheTag = await getCacheTag("customers");
      revalidateTag(customerCacheTag);
      return {error: null, success: true};
    })
    .catch((err) => {
      return {error: err.toString(), success: false};
    });
};

export const updateCustomerAddress = async (
  id: string,
  address: HttpTypes.StoreUpdateCustomerAddress,
): Promise<any> => {
  if (!id) {
    return {error: "Address ID is required", success: false};
  }

  const headers = {
    ...(await getAuthHeaders()),
  };

  return medusa.store.customer
    .updateAddress(id, address, {}, headers)
    .then(async () => {
      const customerCacheTag = await getCacheTag("customers");
      revalidateTag(customerCacheTag);
      return {error: null, success: true};
    })
    .catch((err) => {
      return {error: err.toString(), success: false};
    });
};

export async function transferCart() {
  const cartId = await getCartId();

  if (!cartId) {
    return;
  }

  const headers = await getAuthHeaders();

  await medusa.store.cart.transferCart(cartId, {}, headers);

  revalidateTag("cart");
}
