"use server";

import medusa from "@/data/medusa/client";
import {getAuthHeaders, getCacheTag} from "@/data/medusa/cookies";
import {StoreCart} from "@medusajs/types";
import {revalidateTag} from "next/cache";

export async function initiatePaymentSession<T>(payaload: {
  cart: StoreCart;
  input: {
    context?: Record<string, unknown>;
    provider_id: string;
    data: {
      source: {
        token: string;
        type: "token" | "applepay";
      };
      callback_url?: string;
    };
  };
}): Promise<{
  error: string | null;
  success: boolean;
  data: T | null;
}> {
  return medusa.store.payment
    .initiatePaymentSession(
      payaload.cart,
      payaload.input,
      {},
      await getAuthHeaders(),
    )
    .then(async (response) => {
      revalidateTag(await getCacheTag("carts"));
      return {
        error: null,
        success: true,
        data: response.payment_collection.payment_sessions?.[0].data as T,
      } as const;
    })
    .catch((e) => {
      return {error: e.message, success: false, data: null};
    });
}
