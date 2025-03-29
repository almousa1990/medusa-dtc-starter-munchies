import {signout} from "@/actions/medusa/auth";

export async function GET(
  request: Request,
  {params}: {params: Promise<{countryCode: string}>},
) {
  await signout();
}
