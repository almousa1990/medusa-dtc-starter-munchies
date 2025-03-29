import {redirect} from "next/navigation";

export async function GET(
  request: Request,
  {params}: {params: Promise<{countryCode: string}>},
) {
  redirect("/account/profile");
}
