"use server";

import medusa from "@/data/medusa/client";
import {getAuthHeaders} from "@/data/medusa/cookies";
import {normalizeMockupRenditions} from "@/utils/medusa/normalize-mockup-renditions";

export const createMockupRenditions = async (body: {
  printfiles: {
    filename: string;
    editor_session_id: string;
  }[];
  selected_variant: string;
}): Promise<{
  batch_id: string;
  count: number;
  renditions: any[];
}> => {
  //todo typing

  const headers = await getAuthHeaders();

  console.log(body.printfiles);

  return medusa.client
    .fetch<{batch_id: string; renditions: any[]}>("/store/mockup-renditions", {
      body: {
        store: false,
        printfiles: body.printfiles,
        product_variant_id: body.selected_variant,
      },
      headers,

      method: "POST",
      query: {},
    })
    .then(({batch_id, renditions}) => ({
      batch_id,
      count: renditions?.length ?? 0,
      renditions: normalizeMockupRenditions(renditions),
    }));
};
