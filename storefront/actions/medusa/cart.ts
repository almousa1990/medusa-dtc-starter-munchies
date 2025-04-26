"use server";

import type {MerchifyCartLineItem, MerchifyPrintfileRenderInput} from "@/types";
import type {HttpTypes, StoreUpdateCart} from "@medusajs/types";

import {getCart} from "@/data/medusa/cart";
import medusa from "@/data/medusa/client";
import {
  getAuthHeaders,
  getCacheTag,
  getCartId,
  setCartId,
} from "@/data/medusa/cookies";
import {getRegion} from "@/data/medusa/regions";
import medusaError from "@/utils/medusa/error";
import {revalidateTag} from "next/cache";

export async function createCart(region_id: string) {
  const body = {
    region_id,
  };

  const cartResp = await medusa.store.cart.create(
    body,
    {
      fields:
        "+items, +region, +items.product.*, +items.variant.image, +items.variant.*, +items.thumbnail, +items.metadata, +promotions.*,",
    },
    await getAuthHeaders(),
  );
  await setCartId(cartResp.cart.id);
  revalidateTag(await getCacheTag("carts"));

  return cartResp.cart;
}

export async function getOrSetCart(countryCode: string) {
  let cart = await getCart();
  const region = await getRegion(countryCode);

  if (!region) {
    throw new Error(`Region not found for country code: ${countryCode}`);
  }

  if (!cart) {
    cart = await createCart(region.id);
  }

  const cacheTag = await getCacheTag("carts");

  if (cart && cart?.region_id !== region.id) {
    await medusa.store.cart.update(
      cart.id,
      {region_id: region.id},
      {},
      await getAuthHeaders(),
    );
    revalidateTag(cacheTag);
  }

  return cart;
}

export async function addToCart({
  quantity,
  region_id,
  variantId,
}: {
  quantity: number;
  region_id: string;
  variantId: string;
}) {
  if (!variantId) {
    throw new Error("Missing variant ID when adding to cart");
  }

  let cartId = await getCartId();

  if (!cartId) {
    if (!region_id) throw new Error("Error missing region id");

    cartId = (await createCart(region_id)).id;
  }

  if (!cartId) {
    throw new Error("Error retrieving or creating cart");
  }

  const cacheTag = await getCacheTag("carts");

  await medusa.store.cart
    .createLineItem(
      cartId,
      {
        quantity,
        variant_id: variantId,
      },
      {},
      await getAuthHeaders(),
    )
    .then(() => {
      revalidateTag(cacheTag);
    })
    .catch(medusaError);
}

export async function updateCartQuantity({
  countryCode = "us",
  lineItem,
  quantity,
}: {
  countryCode: string;
  lineItem: string;
  quantity: number;
}) {
  const cart = await getOrSetCart(countryCode);

  if (!cart) {
    throw new Error("Error retrieving or creating cart");
  }

  const cacheTag = await getCacheTag("carts");

  if (!(quantity > 0)) {
    await medusa.store.cart.deleteLineItem(cart.id, lineItem).then(() => {
      revalidateTag(cacheTag);
    });
  } else {
    await medusa.store.cart
      .updateLineItem(
        cart.id,
        lineItem,
        {
          quantity,
        },
        {},
        await getAuthHeaders(),
      )
      .then(() => {
        revalidateTag(cacheTag);
      });
  }
}

export async function updateCart(data: StoreUpdateCart) {
  const cartId = await getCartId();
  if (!cartId) {
    throw new Error(
      "No existing cart found, please create one before updating",
    );
  }

  const cacheTag = await getCacheTag("carts");

  return medusa.store.cart
    .update(cartId, data, {}, await getAuthHeaders())
    .then(({cart}) => {
      revalidateTag(cacheTag);
      return cart;
    })
    .catch(medusaError);
}

export async function addPromotions(codes: string[]) {
  const cartId = await getCartId();

  if (!cartId) {
    throw new Error("No existing cart found");
  }

  const headers = {
    ...(await getAuthHeaders()),
  };

  return medusa.client
    .fetch<HttpTypes.StoreCartResponse>(`/store/carts/${cartId}/promotions`, {
      body: {promo_codes: codes},
      headers,
      method: "POST",
    })
    .then(async (response) => {
      const cacheTag = await getCacheTag("carts");
      revalidateTag(cacheTag);

      const fulfillmentCacheTag = await getCacheTag("fulfillment");
      revalidateTag(fulfillmentCacheTag);
      return response;
    })
    .catch(medusaError);
}

export async function removePromotions(codes: string[]) {
  const cartId = await getCartId();

  if (!cartId) {
    throw new Error("No existing cart found");
  }

  const headers = {
    ...(await getAuthHeaders()),
  };

  return medusa.client
    .fetch<HttpTypes.StoreCartResponse>(`/store/carts/${cartId}/promotions`, {
      body: {promo_codes: codes},
      headers,
      method: "DELETE",
    })
    .then(async (response) => {
      const cacheTag = await getCacheTag("carts");
      revalidateTag(cacheTag);

      const fulfillmentCacheTag = await getCacheTag("fulfillment");
      revalidateTag(fulfillmentCacheTag);
      return response;
    })
    .catch(medusaError);
}

export const fetchCartLineItem = async (id: string) => {
  const cart = await getCart();
  const item = cart?.items?.find((item) => item.id === id);
  return item as MerchifyCartLineItem | undefined;
};

export async function addDecoratedToCart({
  printfiles,
  quantity,
  region_id,
  variantId,
}: {
  printfiles: MerchifyPrintfileRenderInput[];
  quantity: number;
  region_id: string;
  variantId: string;
}) {
  if (!variantId) {
    throw new Error("Missing variant ID when adding to cart");
  }

  let cartId = await getCartId();

  if (!cartId) {
    if (!region_id) throw new Error("Error missing region id");

    cartId = (await createCart(region_id)).id;
  }

  if (!cartId) {
    throw new Error("Error retrieving or creating cart");
  }

  const headers = await getAuthHeaders();

  const cacheTag = await getCacheTag("carts");

  return medusa.client
    .fetch(`/store/carts/${cartId}/decorated-line-items`, {
      body: {
        items: [
          {
            quantity,
            variant_id: variantId,
          },
        ],
        printfiles,
      },
      headers,
      method: "POST",
      query: {},
    })
    .then(() => {
      revalidateTag(cacheTag);
    })
    .catch(medusaError);
}

export async function updateCartDecoratedLineItem({
  countryCode = "us",
  lineItem,
  printfiles,
  quantity,
}: {
  countryCode: string;
  lineItem: string;
  printfiles?: MerchifyPrintfileRenderInput[];
  quantity?: number;
}) {
  const cart = await getOrSetCart(countryCode);

  if (!cart) {
    throw new Error("Error retrieving or creating cart");
  }

  const cacheTag = await getCacheTag("carts");

  const headers = await getAuthHeaders();

  if (quantity != undefined && !(quantity > 0)) {
    await medusa.client
      .fetch(`/store/carts/${cart.id}/decorated-line-items/${lineItem}`, {
        headers,
        method: "DELETE",
      })
      .then(() => {
        revalidateTag(cacheTag);
      })
      .catch(medusaError);
  } else {
    await medusa.client
      .fetch(`/store/carts/${cart.id}/decorated-line-items/${lineItem}`, {
        body: {
          printfiles,
          quantity,
        },
        headers,
        method: "POST",
      })
      .then(() => {
        revalidateTag(cacheTag);
      })
      .catch(medusaError);
  }
}
