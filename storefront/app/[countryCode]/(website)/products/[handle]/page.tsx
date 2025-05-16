import type {MerchifyProduct, PageProps} from "@/types";
import type {ResolvingMetadata} from "next";

import {generateOgEndpoint} from "@/app/api/og/[...info]/utils";
import ContextBar from "@/components/global/context-bar";
import SectionsRenderer from "@/components/sections/section-renderer";
import {getProductByHandle} from "@/data/medusa/products";
import {getRegion} from "@/data/medusa/regions";
import {loadProductContent} from "@/data/sanity";
import {resolveSanityRouteMetadata} from "@/data/sanity/resolve-sanity-route-metadata";
import {getPathComponents} from "@/utils/path-components";
import {headers} from "next/headers";
import {notFound} from "next/navigation";

import {ProductImagesCarousel} from "./_parts/image-carousel";
import ProductInformation from "./_parts/product-information";
import ProductSpecs from "./_parts/specs";
import StickyAtc from "./_parts/sticky-atc";

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

const getBreadcrumbItem = (
  product: MerchifyProduct,
  referer: null | string,
) => {
  const pathComponents = getPathComponents(referer);

  const parentSegment = pathComponents[pathComponents.length - 2];
  const lastSegment = pathComponents[pathComponents.length - 1];

  switch (parentSegment) {
    case "categories":
      const category = product.categories?.find(
        (category) => category.handle === lastSegment,
      );
      return category
        ? {href: `/categories/${category.handle}`, label: category.name}
        : undefined;

    default:
      console.log(product);
      const firstCategory = product.categories?.[0];
      return firstCategory
        ? {
            href: `/categories/${firstCategory.handle}`,
            label: firstCategory.name,
          }
        : undefined;
  }
};

export default async function ProductPage(props: ProductPageProps) {
  const params = await props.params;
  const headersList = await headers();

  const region = await getRegion(params.countryCode);
  if (!region) {
    console.log("No region found");
    return notFound();
  }

  const product = await getProductByHandle(params.handle, region.id);

  const content = await loadProductContent(params.handle);

  if (!product) {
    console.log("No product found");
    return notFound();
  }
  const breadcrumbItem = getBreadcrumbItem(product, headersList.get("referer"));

  return (
    <main>
      <ContextBar
        breadcrumbItems={[
          ...(breadcrumbItem ? [breadcrumbItem] : []),
          {label: product.title},
        ]}
        className="my-6"
        countryCode={params.countryCode}
      />

      <section className="mx-auto flex max-w-xl flex-col items-start justify-start gap-4 px-4 py-4 sm:px-6 lg:max-w-7xl lg:flex-row lg:gap-6 lg:px-8">
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
    </main>
  );
}
