"use client";
import config from "@/config";
import {
  CreateCardTokenInput,
  CreateCardTokenResponse,
  CreateCardTokenResult,
  ErrorResponse,
  ErrorType,
  InitiateApplePaySessionResponse,
  InitiateApplePaySessionResult,
} from "@/types";
import {formatErrorResponse} from "@/utils/moyasar/error";

export async function createCardToken(
  card: CreateCardTokenInput,
): Promise<CreateCardTokenResult> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_MOYASAR_BASE_API_URL}/tokens`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publishable_api_key: process.env.NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY,
          save_only: "true",
          name: `${card.first_name} ${card.last_name}`,
          number: card.number,
          month: card.month,
          year: card.year,
          cvc: card.cvc,
        }),
      },
    );

    const body = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: formatErrorResponse(body as ErrorResponse),
      };
    }

    return {
      success: true,
      data: body as CreateCardTokenResponse,
    };
  } catch (err) {
    return {
      success: false,
      error: {
        type: ErrorType.ApiConnection,
        message: "Network error or invalid response",
        errors: [err instanceof Error ? err.message : String(err)],
      },
    };
  }
}

export async function initiateApplePaySession(
  event: ApplePayJS.ApplePayValidateMerchantEvent,
): Promise<InitiateApplePaySessionResult> {
  const validationUrl = event.validationURL;
  const domainName = window.location.hostname;
  const apiKey = process.env.NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY;
  const baseUrl = process.env.NEXT_PUBLIC_MOYASAR_BASE_API_URL;

  if (!apiKey || !baseUrl) {
    return {
      success: false,
      error: {
        type: ErrorType.InvalidRequest,
        message: "Missing Moyasar API environment variables",
        errors: [],
      },
    };
  }

  try {
    const res = await fetch(`${baseUrl}/applepay/initiate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        validation_url: validationUrl,
        display_name: config.siteName,
        domain_name: domainName,
        publishable_api_key: apiKey,
      }),
    });

    const body = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: body as ErrorResponse,
      };
    }

    return {
      success: true,
      data: body as InitiateApplePaySessionResponse,
    };
  } catch (err) {
    return {
      success: false,
      error: {
        type: ErrorType.ApiConnection,
        message: "Network error or invalid response",
        errors: [err instanceof Error ? err.message : String(err)],
      },
    };
  }
}
