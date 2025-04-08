"use server";

import type {MerchifyPrintfile} from "@/types";

import medusa from "@/data/medusa/client";
import {getAuthHeaders, getCacheTag, getCartId} from "@/data/medusa/cookies";
import medusaError from "@/utils/medusa/error";
import {revalidateTag} from "next/cache";

import {createCart} from "./cart";

export async function addPrintfilesToCart({
  printfiles,
  quantity,
  region_id,
  variantId,
}: {
  printfiles: MerchifyPrintfile[];
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
    .fetch(`/store/carts/${cartId}/line-item-printfiles`, {
      body: {
        printfiles,
        quantity,
        variant_id: variantId,
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

export const createPrintfileEditorSessions = async (productId: string) => {
  //todo typing
  const headers = await getAuthHeaders();
  return medusa.client
    .fetch<{sessions: any[]}>( //todo typing
      `/store/products/${productId}/printfile-editor-sessions`,
      {
        body: {},
        headers,
        method: "POST",
      },
    )
    .then(({sessions}) => sessions);
};

export const updatePrintfileEditorSessions = async (
  productId: any,
  payload: any,
) => {
  //todo typing
  const headers = {
    ...(await getAuthHeaders()),
  };

  console.log(payload);
  return medusa.client
    .fetch<{sessions: any[]}>( //todo typing
      `/store/products/${productId}/printfile-editor-sessions/batch`,
      {
        body: {
          create: [],
          delete: [],
          update: payload,
        },
        headers,
        method: "POST",
      },
    )
    .then(({sessions}) => sessions);
};
