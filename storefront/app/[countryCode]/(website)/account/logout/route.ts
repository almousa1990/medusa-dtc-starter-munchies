import {signout} from "@/actions/medusa/auth";

export async function GET() {
  await signout();
}
