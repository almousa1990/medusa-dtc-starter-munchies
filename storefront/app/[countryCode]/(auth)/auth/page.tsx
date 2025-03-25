import type {PageProps} from "@/types";
import type {Metadata} from "next";

import {getCustomer} from "@/data/medusa/customer";
import {headers} from "next/headers";
import {redirect} from "next/navigation";

import AuthFlow from "./_parts/auth-flow";

export const metadata: Metadata = {
  description: "Overview of your account activity.",
  title: "Account",
};

type AuthPageProps = PageProps<"", "redirectTo">;

export default async function AuthPage(props: AuthPageProps) {
  const searchParams = await props.searchParams;

  const headersList = await headers();

  const redirectTo =
    (searchParams?.redirectTo as string) ||
    headersList.get("referer") ||
    "/account";
  const customer = await getCustomer();

  if (customer) {
    redirect(redirectTo);
  }

  return <AuthFlow customer={customer} redirect={redirectTo} />;
}
