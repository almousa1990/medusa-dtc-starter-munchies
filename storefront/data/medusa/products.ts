import type {
  StoreProduct,
  StoreProductListParams,
  StoreProductParams,
} from "@medusajs/types";

import {unstable_cache} from "next/cache";

import medusa from "./client";
import {MerchifyProduct} from "@/types";
const PRODUCT_LIMIT = 12;

export const getProductByHandle = unstable_cache(
  async function (handle: string, region_id: string) {
    return medusa.store.product
      .list(
        {
          fields:
            "*variants.calculated_price,+variants.inventory_quantity,+metadata,+care_instructions.*,+feature_entries.content,+feature_entries.template.*",
          handle,
          region_id,
        },
        {next: {tags: ["products"]}},
      )
      .then(({products}) => products[0] as MerchifyProduct);
  },
  ["product"],
  {
    revalidate: 120,
  },
);

export const getProductsByIds = unstable_cache(
  async function (ids: string[], region_id: string) {
    return medusa.store.product.list(
      {
        id: ids,
        region_id,
      },
      {next: {tags: ["products"]}},
    );
  },
  ["products"],
  {
    revalidate: 120,
  },
);

export const getProducts = unstable_cache(
  async function (
    page: number,
    region_id: string,
    query?: Omit<
      StoreProductListParams,
      "fields" | "limit" | "offset" | "region_id"
    >,
  ) {
    const limit = PRODUCT_LIMIT;
    const offset = (page - 1) * limit;

    const {count, products} = await medusa.store.product.list(
      {
        fields: "+images.*,+variants.*,*variants.calculated_price",
        limit,
        offset,
        region_id,
        ...query,
      },
      {next: {tags: ["products"]}},
    );

    return {
      count,
      totalPages: Math.ceil(count / PRODUCT_LIMIT),
      products,
    };
  },
  ["products"],
  {
    revalidate: 120,
  },
);
