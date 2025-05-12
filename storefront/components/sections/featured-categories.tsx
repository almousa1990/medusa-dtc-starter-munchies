import type {ModularPageSection} from "./types";

import CarouselSection from "../shared/carousel-section";
import {SanityImage} from "../shared/sanity-image";
import LocalizedLink from "../shared/localized-link";
import {cn} from "@merchify/ui";

export default async function FeaturedCategories(
  props: ModularPageSection<"section.featuredCategories">,
) {
  const slides = props?.cards?.map((card) => (
    <CategoryCard {...card} key={card._key} />
  ));

  return (
    <section
      {...props.rootHtmlAttributes}
      className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:max-w-7xl lg:px-8"
    >
      <CarouselSection
        showButtons={false}
        slides={slides}
        subtitle={props.subtitle}
        title={props.title}
      >
        {slides}
      </CarouselSection>
    </section>
  );
}

async function CategoryCard({
  cta,
  image,
}: NonNullable<
  ModularPageSection<"section.featuredCategories">["cards"]
>[number]) {
  return (
    <LocalizedLink
      className={cn("inline-flex w-64 flex-col text-center lg:w-auto")}
      href={`/categories/${cta?.link}`}
      prefetch
    >
      <div>
        <div className="grid w-fit gap-1 overflow-hidden rounded-md border">
          <SanityImage
            className="bg-secondary aspect-square object-cover object-center"
            data={image}
          />
          <div className="flex items-center justify-center p-4 font-medium">
            {cta?.label}
          </div>
        </div>
      </div>
    </LocalizedLink>
  );
}
