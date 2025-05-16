import {getProductsByIds} from "@/data/medusa/products";
import {getRegion} from "@/data/medusa/regions";

import type {ModularPageSection} from "./types";

import CarouselSection from "../shared/carousel-section";
import ProductCard from "../shared/product-card";

export default async function FeaturedProducts(
  props: ModularPageSection<"section.featuredProducts">,
) {
  const region = await getRegion(props.countryCode);

  if (!region) {
    console.log("No region found");
    return null;
  }

  const ids =
    props.products
      ?.map((product) => product?._ref)
      .filter((id): id is string => id !== undefined) || [];

  if (!ids || ids.length === 0) return null;

  const {products} = await getProductsByIds(ids, region.id);

  const slides = products.map((product, index) => (
    <ProductCard
      className="inline-flex w-64 flex-col text-center lg:w-auto"
      index={index}
      key={product.id}
      product={product}
    />
  ));
  return (
    <section
      {...props.rootHtmlAttributes}
      className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:max-w-7xl lg:px-8"
    >
      <CarouselSection
        cta={{href: props.cta?.link, text: props.cta?.label}}
        subtitle={props.subtitle}
        title={props.title as string}
      >
        {slides}
      </CarouselSection>
    </section>
  );
}
