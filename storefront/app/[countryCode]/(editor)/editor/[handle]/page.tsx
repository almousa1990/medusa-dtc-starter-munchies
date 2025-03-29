import type {PageProps} from "@/types";
import {getRegion} from "@/data/medusa/regions";
import {notFound} from "next/navigation";
import {getPrintfileProductByHandle} from "@/data/medusa/printfiles";
import {EditorWrapper} from "./_parts/editor-wrapper";

type EditorPageProps = PageProps<"countryCode" | "handle">;

export default async function EditorPage(props: EditorPageProps) {
  const params = await props.params;

  const region = await getRegion(params.countryCode);
  if (!region) {
    console.log("No region found");
    return notFound();
  }

  const product = await getPrintfileProductByHandle(params.handle, region.id);

  if (!product) {
    console.log("No product found");
    return notFound();
  }

  return <EditorWrapper product={product} />;
}
