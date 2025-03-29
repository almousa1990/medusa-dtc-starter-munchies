"use server";

import medusa from "./client";
import {getAuthHeaders} from "./cookies";

export const createMockupRenditions = async (body: {
  selectedVariant: string;
  printfiles: any[];
}): Promise<{renditions: any[]; count: number; batch_key: string}> => {
  //todo typing

  const {selectedVariant: variantId, printfiles} = body;
  const headers = {
    ...(await getAuthHeaders()),
  };

  return medusa.client
    .fetch<{renditions: any[]; batch_key: string}>("/store/mockup-renditions", { // todo typing
      method: "POST",
      headers,
      body: {
        product_variant_id: variantId,
        printfiles: printfiles,
      },
      query: {},
    })
    .then(({renditions, batch_key}) => ({
      renditions,
      count: renditions.length,
      batch_key,
    }));
};

export const listMockupRenditions = async (
  batchKey: string,
): Promise<{renditions: any[]; count: number}> => {
  //todo typing
  const headers = {
    ...(await getAuthHeaders()),
  };
  return medusa.client
    .fetch<{renditions: any[]; count: number}>( //todo typing
      `/store/mockup-renditions`,
      {
        query: {
          batch_key: batchKey,
        },
        headers,
      },
    )
    .then(({renditions}) => ({renditions, count: renditions.length}));
};
