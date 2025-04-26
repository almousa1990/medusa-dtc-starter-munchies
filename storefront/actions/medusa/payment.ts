"use server";

import medusa from "@/data/medusa/client";
import {getAuthHeaders, getCacheTag} from "@/data/medusa/cookies";
import {StoreCart} from "@medusajs/types";
import {revalidateTag} from "next/cache";

export async function initiatePaymentSession(payaload: {
  cart: StoreCart;
  input: {
    context?: Record<string, unknown>;
    provider_id: string;
    data: {
      source: {
        token: string;
        type: "token" | "applepay";
      };
    };
  };
}): Promise<any> {
  return medusa.store.payment
    .initiatePaymentSession(
      payaload.cart,
      payaload.input,
      {},
      await getAuthHeaders(),
    )
    .then(async (response) => {
      revalidateTag(await getCacheTag("carts"));

      const session = response.payment_collection?.payment_sessions?.[0];

      if (session) {
        const url = (
          session.data as {
            source: {
              transaction_url: string;
            };
          }
        )?.source?.transaction_url;

        return {error: null, status: "success", redirect_url: url} as const;
      } else {
        throw new Error("Session not found");
      }
    })
    .catch((e) => {
      return {error: e.message, status: "error"};
    });
}
