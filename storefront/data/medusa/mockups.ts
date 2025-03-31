"use server";

import medusa from "./client";
import {getAuthHeaders} from "./cookies";

export const createMockupRenditions = async (body: {
  selected_variant: string;
  session_key: string;
  printfiles: any[];
}): Promise<{
  renditions: any[];
  count: number;
  batch_key: string;
  session_key: string;
}> => {
  //todo typing

  const headers = {
    ...(await getAuthHeaders()),
  };

  return medusa.client
    .fetch<{renditions: any[]; batch_key: string; session_key: string}>(
      "/store/mockup-renditions",
      {
        // todo typing
        method: "POST",
        headers,
        body: {
          printfiles: body.printfiles,
          session_key: body.session_key,
          product_variant_id: body.selected_variant,
        },
        query: {},
      },
    )
    .then(({renditions, batch_key, session_key}) => ({
      renditions,
      count: renditions.length,
      batch_key,
      session_key,
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
