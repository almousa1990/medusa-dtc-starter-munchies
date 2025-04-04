"use server";

import type {HttpTypes} from "@medusajs/types";

import medusa from "@/data/medusa/client";
import {
  getAuthHeaders,
  getCacheHeaders,
  getCacheTag,
  removeAuthToken,
  setAuthToken,
} from "@/data/medusa/cookies";
import {getCustomer} from "@/data/medusa/customer";
import {revalidateTag} from "next/cache";
import {redirect} from "next/navigation";

export async function signout() {
  await medusa.auth.logout();
  await removeAuthToken();
  revalidateTag("auth");
  revalidateTag("customer");
  redirect(`/`);
}

export async function generateOtp(payload: {
  identifier?: string;
  type: "email" | "phone";
}): Promise<
  {error: string; success: false} | {stateKey: string; success: true}
> {
  const {identifier, type} = payload;

  if (!identifier) {
    return {error: "Identifier must be defined", success: false};
  }

  try {
    const headers = await getAuthHeaders();
    const next = await getCacheHeaders("customers");

    const response = await medusa.client.fetch<{stateKey: string}>(
      "/verification/generate",
      {
        body: {identifier, type},
        headers,
        method: "POST",
        next,
      },
    );

    return {stateKey: response.stateKey, success: true};
  } catch (error) {
    console.error("OTP generation error:", error);
    return {
      error: error instanceof Error ? error.message : String(error),
      success: false,
    };
  }
}

export async function verifyOtp(payload: {
  otp: string;
  stateKey: string;
}): Promise<{error: string; success: false} | {success: true; token: string}> {
  const {otp, stateKey} = payload;

  try {
    const headers = await getAuthHeaders();
    const next = await getCacheHeaders("customers");

    const response = await medusa.client.fetch<{token: string}>(
      "/verification/verify",
      {
        body: {otp, stateKey},
        headers,
        method: "POST",
        next,
      },
    );

    return {success: true, token: response.token};
  } catch (error) {
    console.error("OTP verification error:", error);
    return {
      error: error instanceof Error ? error.message : String(error),
      success: false,
    };
  }
}

export async function refreshOtp(payload: {
  stateKey?: string;
}): Promise<
  {error: string; success: false} | {stateKey: string; success: true}
> {
  const {stateKey} = payload;

  if (!stateKey) {
    return {error: "State key must be defined", success: false};
  }

  try {
    const headers = await getAuthHeaders();
    const next = await getCacheHeaders("customers");

    const response = await medusa.client.fetch<{stateKey: string}>(
      "/verification/refresh",
      {
        body: {stateKey},
        headers,
        method: "POST",
        next,
      },
    );

    return {stateKey: response.stateKey, success: true};
  } catch (error) {
    console.error("OTP verification error:", error);
    return {
      error: error instanceof Error ? error.message : String(error),
      success: false,
    };
  }
}

export async function refresh() {
  const headers = await getAuthHeaders();
  const next = await getCacheHeaders("customers");

  try {
    const {token} = await medusa.client.fetch<{token: string}>(
      "/auth/token/refresh",
      {
        headers,
        method: "POST",
        next,
      },
    );
    await setAuthToken(token as string);

    // Revalidate customer cache
    const customerCacheTag = await getCacheTag("customers");
    revalidateTag(customerCacheTag);

    return {success: true, token};
  } catch (error) {
    console.error("Auth refresh error:", error);
    return {
      error: error instanceof Error ? error.message : String(error),
      success: false,
    };
  }
}

export async function register(verificationToken: string) {
  try {
    const token = await medusa.auth.register("customer", "otp", {
      token: verificationToken,
    });

    await setAuthToken(token as string);

    return {success: true};
  } catch (error) {
    console.error("Auth register error:", error);
    return {
      error: error instanceof Error ? error.message : String(error),
      success: false,
    };
  }
}

export async function login(verificationToken: string) {
  try {
    const token = await medusa.auth.login("customer", "otp", {
      token: verificationToken,
    });

    await setAuthToken(token as string);

    const customerCacheTag = await getCacheTag("customers");
    revalidateTag(customerCacheTag);

    const customer = await getCustomer();

    return {customer, success: true};
  } catch (error) {
    console.error("Login error:", error);
    return {
      error: error instanceof Error ? error.message : String(error),
      success: false,
    };
  }
}

export async function signup(payload: {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
}): Promise<
  | {customer: HttpTypes.StoreCustomer; success: true}
  | {error: string; success: false}
> {
  const {email, first_name, last_name, phone} = payload;

  try {
    const headers = await getAuthHeaders();

    // Create the customer
    const {customer: createdCustomer} = await medusa.store.customer.create(
      {email, first_name, last_name, phone},
      {},
      headers,
    );

    return {customer: createdCustomer, success: true};
  } catch (error) {
    console.error("Signup error:", error);
    return {
      error: error instanceof Error ? error.message : String(error),
      success: false,
    };
  }
}
