import type {Metadata} from "next";

import {getCustomer} from "@/data/medusa/customer";
import {headers} from "next/headers";
import {redirect} from "next/navigation";

import AuthFlow from "./_parts/auth-flow";

export const metadata: Metadata = {
  description: "Overview of your account activity.",
  title: "Account",
};

export default async function AuthPage() {
  const headersList = await headers();
  const referer = headersList.get("referer") || "/account"; // Get the referrer or fallback
  const customer = await getCustomer();

  if (customer) {
    //redirect(referer);
  }

  return <AuthFlow customer={customer} referer={referer} />;
}
