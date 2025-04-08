import type {PageProps} from "@/types";

import {CartProvider} from "@/components/context/cart-context";
import {getCart} from "@/data/medusa/cart";
import {getCustomer} from "@/data/medusa/customer";
import {
  getPrintfileEditorSessions,
  getPrintfileProductByHandle,
} from "@/data/medusa/printfiles";
import {getRegion} from "@/data/medusa/regions";
import {getSession} from "@/data/medusa/session";
import {notFound, redirect} from "next/navigation";

import {EditorInitializer} from "./_parts/editor-initializer";
import {EditorWrapper} from "./_parts/editor-wrapper";
import {SessionInitializer} from "./_parts/session-initializer";

type EditorPageProps = PageProps<"countryCode" | "handle", "variant">;

export default async function EditorPage(props: EditorPageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const variant = (searchParams.variant as string) ?? undefined;

  const region = await getRegion(params.countryCode);
  if (!region) {
    console.log("No region found");
    return notFound();
  }

  const cart = await getCart();
  const product = await getPrintfileProductByHandle(params.handle, region.id);
  if (!product) {
    console.log("No product found");
    return notFound();
  }

  const customer = await getCustomer();
  const session = await getSession();

  const sessions = await getPrintfileEditorSessions(product.id);

  return (
    <CartProvider cart={cart} countryCode={params.countryCode}>
      <SessionInitializer customer={customer} session={session} />
      <EditorInitializer
        customer={customer}
        productId={product.id}
        session={session}
        sessions={sessions}
      />
      <EditorWrapper
        product={product}
        regionId={region.id}
        selectedVariant={variant}
        sessions={sessions}
      />
    </CartProvider>
  );
}
