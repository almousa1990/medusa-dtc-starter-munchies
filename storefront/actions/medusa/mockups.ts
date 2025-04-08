"use server";

import medusa from "@/data/medusa/client";
import {getAuthHeaders} from "@/data/medusa/cookies";

export const createMockupRenditions = async (body: {
  printfiles: any[];
  selected_variant: string;
}): Promise<{
  batch_id: string;
  count: number;
  renditions: any[];
}> => {
  //todo typing

  const headers = await getAuthHeaders();

  return medusa.client
    .fetch<{batch_id: string; renditions: any[]}>("/store/mockup-renditions", {
      body: {
        printfiles: body.printfiles,
        product_variant_id: body.selected_variant,
      },
      headers,
      // todo typing
      method: "POST",
      query: {},
    })
    .then(({batch_id, renditions}) => ({
      batch_id,
      count: renditions?.length ?? 0,
      renditions,
    }));
};
