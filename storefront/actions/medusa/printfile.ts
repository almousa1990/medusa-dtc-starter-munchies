"use server";

import medusa from "@/data/medusa/client";
import {getAuthHeaders} from "@/data/medusa/cookies";

export const createPrintfileEditorSessions = async (productId: string) => {
  //todo typing
  const headers = await getAuthHeaders();
  return medusa.client
    .fetch<{sessions: any[]}>( //todo typing
      `/store/printfile-editor-sessions`,
      {
        body: {product_id: productId},
        headers,
        method: "POST",
      },
    )
    .then(({sessions}) => sessions);
};

export const updatePrintfileEditorSessions = async (
  payload: {id?: null | string}[],
) => {
  //todo typing
  const headers = {
    ...(await getAuthHeaders()),
  };
  const toUpdate = payload.filter((s) => s.id);
  const toCreate = payload.filter((s) => !s.id);
  return medusa.client
    .fetch<{created: {id: string}[]; updated: {id: string}[]}>( //todo typing
      `/store/printfile-editor-sessions/batch`,
      {
        body: {
          create: toCreate,
          delete: [],
          update: toUpdate,
        },
        headers,
        method: "POST",
      },
    )
    .then((respose) => {
      return respose;
    });
};
