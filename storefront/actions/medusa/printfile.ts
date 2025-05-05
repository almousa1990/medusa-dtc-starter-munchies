"use server";

import medusa from "@/data/medusa/client";
import {getAuthHeaders} from "@/data/medusa/cookies";

export const updatePrintfileEditorSessions = async (payload: {
  sessions: {
    id?: null | string;
    objects?: Record<string, unknown> | null;
    all_objects?: Record<string, unknown> | null;
    configurations?: Record<string, unknown> | null;
    default_objects?: Record<string, unknown> | null;
  }[];
}) => {
  const headers = {
    ...(await getAuthHeaders()),
  };

  const toUpdate = payload.sessions.filter((s) => s.id);
  const toCreate = payload.sessions.filter((s) => !s.id);

  const response = await medusa.client.fetch<{
    created: {id: string}[];
    updated: {id: string}[];
  }>(`/store/printfile-editor-sessions/batch`, {
    body: {
      create: toCreate,
      delete: [],
      update: toUpdate,
    },
    headers,
    method: "POST",
  });

  return response;
};
