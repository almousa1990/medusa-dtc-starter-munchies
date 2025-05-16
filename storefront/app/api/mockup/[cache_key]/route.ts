import type {NextRequest} from "next/server";

import medusa from "@/data/medusa/client";
import {getAuthHeaders} from "@/data/medusa/cookies";

export async function GET(
  req: NextRequest,
  {params}: {params: {cache_key: string}},
) {
  const {cache_key} = await params;

  const headers = await getAuthHeaders();
  console.log(`/store/mockup-renditions/image/${cache_key}`);

  const response = await medusa.client
    .fetch(`/store/mockup-renditions/image/${cache_key}`, {
      headers: {
        ...headers,

        Accept: "image/webp",
        "Content-Type": null,
      },
    })
    .catch(console.log);

  if (!response) {
    return new Response("Image2 not found", {status: 404});
  }

  const contentType = response.headers.get("Content-Type") || "image/webp";
  const contentLength = response.headers.get("Content-Length");

  return new Response(response.body, {
    headers: {
      "Content-Type": contentType,
      ...(contentLength ? {"Content-Length": contentLength} : {}),
      "Cache-Control": "public, max-age=3600",
    },
    status: 200,
  });
}
