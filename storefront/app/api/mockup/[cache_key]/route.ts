import medusa from "@/data/medusa/client";
import {getAuthHeaders} from "@/data/medusa/cookies";
import {NextRequest} from "next/server";

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

        "Content-Type": null,
        Accept: "image/webp",
      },
    })
    .catch(console.log);

  if (!response) {
    return new Response("Image2 not found", {status: 404});
  }

  const contentType = response.headers.get("Content-Type") || "image/webp";
  const contentLength = response.headers.get("Content-Length");

  return new Response(response.body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      ...(contentLength ? {"Content-Length": contentLength} : {}),
      "Cache-Control": "public, max-age=3600",
    },
  });
}
