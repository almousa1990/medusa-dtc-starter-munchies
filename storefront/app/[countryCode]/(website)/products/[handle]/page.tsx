import type {PageProps} from "@/types";
import type {ResolvingMetadata} from "next";

import {generateOgEndpoint} from "@/app/api/og/[...info]/utils";
import SectionsRenderer from "@/components/sections/section-renderer";
import {getProductByHandle} from "@/data/medusa/products";
import {getRegion} from "@/data/medusa/regions";
import {loadProductContent} from "@/data/sanity";
import {resolveSanityRouteMetadata} from "@/data/sanity/resolve-sanity-route-metadata";
import {notFound} from "next/navigation";

import {ProductImagesCarousel} from "./_parts/image-carousel";
import ProductInformation from "./_parts/product-information";
import StickyAtc from "./_parts/sticky-atc";
import ProductSpecs from "./_parts/specs";

type ProductPageProps = PageProps<"countryCode" | "handle">;

export async function generateMetadata(
  props: ProductPageProps,
  parent: ResolvingMetadata,
) {
  const content = await loadProductContent((await props.params).handle);

  if (!content) {
    return notFound();
  }

  const url = generateOgEndpoint({
    countryCode: (await props.params).countryCode,
    handle: (await props.params).handle,
    type: "products",
  });

  const metadata = await resolveSanityRouteMetadata(
    {
      indexable: content?.indexable,
      pathname: content?.pathname,
      seo: content?.seo,
    },
    parent,
  );
  return {
    ...metadata,
    openGraph: {
      images: [
        {
          height: 630,
          url: url.toString(),
          width: 1200,
        },
      ],
    },
  };
}

export default async function ProductPage(props: ProductPageProps) {
  const params = await props.params;

  const region = await getRegion(params.countryCode);
  if (!region) {
    console.log("No region found");
    return notFound();
  }

  const product = await getProductByHandle(params.handle, region.id);
  console.log(product);

  const content = await loadProductContent(params.handle);

  if (!product) {
    console.log("No product found");
    return notFound();
  }

  return (
    <>
      <section className="mx-auto flex flex-col items-start justify-start gap-4 lg:flex-row lg:gap-6 lg:py-5">
        <ProductImagesCarousel product={product} />
        <ProductInformation
          content={content}
          region_id={region.id}
          {...product}
        />
      </section>
      {/*<ProductSpecs specs={content?.specs} />*/}
      <ProductSpecs {...product} />

      {content?.sections && (
        <SectionsRenderer
          countryCode={params.countryCode}
          fieldName="body"
          sections={content.sections}
        />
      )}
      <StickyAtc {...product} region_id={region.id} />
    </>
  );
}
