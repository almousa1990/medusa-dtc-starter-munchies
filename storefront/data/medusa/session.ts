import medusa from "./client";
import {getAuthHeaders} from "./cookies";

export async function getSession() {
  const headers = await getAuthHeaders();
  console.log("get session auth headers", headers);

  return medusa.client
    .fetch<{session: any}>("/store/anonymous-sessions/me", {
      headers,
      query: {},
    })
    .then(({session}) => session)
    .catch(() => null);
}
