import type {StoreProductCategory} from "@medusajs/types";

import {unstable_cache} from "next/cache";

import medusa from "./client";

export const getCategoryByHandle = unstable_cache(
  async function (handle: string) {
    const category = await medusa.store.category
      .list(
        {
          fields: "+category_children.*, +filters.*, +filters.tags.*",
          handle,
        },
        {next: {tags: ["category"]}},
      )
      .then(
        ({product_categories}) =>
          product_categories[0] as {
            filters: {
              id: string;
              title: string;
              tags: {
                id: string;
                value: string;
              }[];
            }[];
          } & StoreProductCategory,
      );

    return category;
  },
  ["category"],
  {
    revalidate: 120,
  },
);

export const getCategories = unstable_cache(
  async function () {
    return await medusa.store.category.list(
      {fields: "id,name"},
      {next: {tags: ["categories"]}},
    );
  },
  ["categories"],
  {
    revalidate: 120,
  },
);
