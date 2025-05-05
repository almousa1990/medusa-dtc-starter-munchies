"use server";

import {normalizeMockupRenditions} from "@/utils/medusa/normalize-mockup-renditions";
import medusa from "./client";
import {getAuthHeaders} from "./cookies";

export const listMockupRenditions = async (
  batchId: string,
): Promise<{count: number; renditions: any[]}> => {
  //todo typing
  const headers = {
    ...(await getAuthHeaders()),
  };
  return medusa.client
    .fetch<{count: number; renditions: any[]}>( //todo typing
      `/store/mockup-renditions/${batchId}`,
      {
        headers,
        query: {},
      },
    )
    .then(({renditions}) => ({
      count: renditions.length,
      renditions: normalizeMockupRenditions(renditions),
    }));
};
