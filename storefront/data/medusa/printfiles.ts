import type {MerchifyPrintfileTemplate, MerchifyProduct} from "@/types";

import {unstable_cache} from "next/cache";

import medusa from "./client";
import {getAuthHeaders} from "./cookies";

export const getPrintfileProductByHandle = unstable_cache(
  async function (handle: string, region_id: string) {
    return medusa.store.product
      .list(
        {
          fields:
            "*variants.calculated_price,+variants.options.option.metadata,+variants.inventory_quantity,+metadata,+care_instructions.*, +variants.printfile_templates.decoration_method.handle, *variants.printfile_templates.filename",
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

export const getPrintfileEditorSessions = async (input: {
  line_item_id?: string;
  product_id?: string;
}) => {
  //todo typing
  const headers = await getAuthHeaders();
  return medusa.client
    .fetch<{sessions: any[]}>( //todo typing
      `/store/printfile-editor-sessions`,
      {
        headers,
        query: {
          fields: "*editor",
          line_item_id: input.line_item_id,
          product_id: input.product_id,
        },
      },
    )
    .then(({sessions}) => sessions)
    .catch(() => null);
};

export const getProductPrintfiles = async (product_id: string) => {
  //todo typing
  const headers = await getAuthHeaders();
  return medusa.client
    .fetch<{printfiles: MerchifyPrintfileTemplate[]}>( //todo typing
      `/store/products/${product_id}/printfiles`,
      {
        headers,
        query: {},
      },
    )
    .then(({printfiles}) => printfiles)
    .catch(() => null);
};
