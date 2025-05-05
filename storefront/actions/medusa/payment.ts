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

export interface CreateCardTokenInput {
  number: string;
  month: string;
  year: string;
  cvc: string;
  first_name: string;
  last_name: string;
}

export type CreateCardTokenResponse =
  | {success: true; token: string}
  | {success: false; error: string};

export async function createCardToken(
  card: CreateCardTokenInput,
): Promise<CreateCardTokenResponse> {
  try {
    const data = {
      publishable_api_key: process.env.NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY,
      save_only: "true",
      name: `${card.first_name} ${card.last_name}`,
      number: card.number,
      month: card.month,
      year: card.year,
      cvc: card.cvc,
    };

    const res = await fetch("https://api.moyasar.com/v1/tokens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      if (json?.type === "validation_error" && json.errors) {
        return {
          success: false,
          error: "Validation error: تحقق من البيانات المدخلة.",
        };
      }

      return {
        success: false,
        error: json?.message || "فشل في إنشاء رمز البطاقة.",
      };
    }

    if (!json.id) {
      return {
        success: false,
        error: "الاستجابة من مويسار غير صحيحة.",
      };
    }

    return {
      success: true,
      token: json.id,
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: "حدث خطأ أثناء المعالجة.",
    };
  }
}
