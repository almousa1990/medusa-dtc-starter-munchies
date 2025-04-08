import type {MerchifyProduct} from "@/types";

import {unstable_cache} from "next/cache";

import medusa from "./client";
import {getAuthHeaders} from "./cookies";

export const getPrintfileProductByHandle = unstable_cache(
  async function (handle: string, region_id: string) {
    return medusa.store.product
      .list(
        {
          fields:
            "*variants.calculated_price,+variants.options.option.metadata,+variants.inventory_quantity,+metadata,+care_instructions.*,+variants.printfile_templates.*,+variants.printfile_templates.editor.*, +variants.printfile_templates.decoration_method.*, *variants.printfile_templates.calculated_price",
          handle,

          region_id,
        },
        {next: {tags: ["printfile_products"]}},
      )
      .then(({products}) => products[0] as MerchifyProduct);
  },
  ["printfile_product"],
  {
    revalidate: 120,
  },
);

export const getPrintfileEditorSessions = async (productId: string) => {
  //todo typing
  const headers = await getAuthHeaders();
  return medusa.client
    .fetch<{sessions: any[]}>( //todo typing
      `/store/products/${productId}/printfile-editor-sessions`,
      {
        headers,
        query: {
          fields: "*editor",
        },
      },
    )
    .then(({sessions}) => sessions)
    .catch(() => null);
};
