import type {PageProps} from "@/types";
import type {ResolvingMetadata} from "next";

import {generateOgEndpoint} from "@/app/api/og/[...info]/utils";
import PaginatedProducts, {
  ProductsSkeleton,
} from "@/components/products/paginated-product";
import ProductFilters from "@/components/products/product-filters";
import Heading from "@/components/shared/typography/heading";
import {getCategories, getCategoryByHandle} from "@/data/medusa/categories";
import {loadCategoryContent} from "@/data/sanity";
import {resolveSanityRouteMetadata} from "@/data/sanity/resolve-sanity-route-metadata";
import {Suspense} from "react";

import notFound from "../../not-found";

type CategoryPageProps = PageProps<
  "countryCode" | "handle",
  "category" | "page" | "sort" | "tags"
>;

export async function generateStaticParams() {
  try {
    const {product_categories} = await getCategories();

    if (!product_categories || product_categories.length === 0) {
      return [];
    }

    return product_categories
      .filter((category) => category?.handle) // Ensure category.handle exists
      .map((category) => ({
        category: [category.handle], // Keep structure consistent
      }));
  } catch (error) {
    console.error(
      `Failed to generate static paths for categories: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`,
    );
    return [];
  }
}

export async function generateMetadata(
  props: CategoryPageProps,
  parent: ResolvingMetadata,
) {
  const content = await loadCategoryContent((await props.params).handle);

  if (!content) {
    return notFound();
  }

  const url = generateOgEndpoint({
    countryCode: (await props.params).countryCode,
    handle: (await props.params).handle,
    type: "categories",
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

export default async function CategoryPage(props: CategoryPageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const handle = (await props.params).handle;
  const category = await getCategoryByHandle(handle);
  const content = await loadCategoryContent(handle);

  const categories = category.parent_category
    ? category.parent_category?.category_children
    : (await getCategories()).product_categories;

  console.log(searchParams);

  return (
    <section className="max-w-max-screen mx-auto flex flex-col gap-10 pt-[6.5rem] pb-10">
      <div>
        <Heading desktopSize="4xl" font="serif" mobileSize="2xl" tag="h1">
          {category.name}
        </Heading>
      </div>
      <div className="flex flex-col gap-6">
        <ProductFilters
          categories={categories}
          filters={category.filters}
          initialTags={searchParams.tags}
        />
        <Suspense fallback={<ProductsSkeleton />}>
          <PaginatedProducts
            countryCode={params.countryCode}
            searchParams={{...searchParams, category: content?._id}}
          />
        </Suspense>
      </div>
    </section>
  );
}
