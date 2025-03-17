import {signout} from "@/actions/medusa/auth";

export async function GET(
  request: Request,
  {params}: {params: Promise<{countryCode: string}>},
) {
  const {countryCode} = await params;

  console.log("should get countrycode");
  console.log(countryCode);

  await signout(countryCode);
}
