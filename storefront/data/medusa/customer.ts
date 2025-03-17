import {cache} from "react";

import medusa from "./client";
import {getAuthHeaders, getCacheHeaders, getCacheTag} from "./cookies";
import {HttpTypes} from "@medusajs/types";
import medusaError from "@/utils/medusa/error";
import {revalidateTag} from "next/cache";

export const getCustomer = cache(async function () {
  return await medusa.store.customer
    .retrieve(
      {},
      {...(await getCacheHeaders("customers")), ...(await getAuthHeaders())},
    )
    .then(({customer}) => customer)
    .catch(() => null);
});
