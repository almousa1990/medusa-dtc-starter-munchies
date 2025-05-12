import type {SearchParams} from "@/types";

import Icon from "@/components/shared/icon";
import Body from "@/components/shared/typography/body";
import Heading from "@/components/shared/typography/heading";
import {getProducts} from "@/data/medusa/products";
import {getRegion} from "@/data/medusa/regions";
import {loadDictionary} from "@/data/sanity";

import ClearAllButton from "../product-refinement/filters/clear-button";
import ProductGrid from "./grid";
import Pagination from "@/components/shared/pagination";

export default async function PaginatedProducts({
  countryCode,
  searchParams,
}: {
  countryCode: string;
  searchParams: SearchParams<
    "category" | "collection" | "tags" | "page" | "sort" | "q"
  >;
}) {
  const category = parseSearchParam(searchParams.category)?.split(",");
  const tags = parseSearchParam(searchParams.tags)?.split(",");
  const collection = parseSearchParam(searchParams.collection)?.split(",");
  const page =
    typeof searchParams.page === "string" ? parseInt(searchParams.page, 10) : 1;

  const productsDictionary = await loadDictionary();

  const region = await getRegion(countryCode);

  if (!region) {
    return null;
  }

  const {totalPages, products} = await getProducts(page, region.id, {
    category_id: category,
    collection_id: collection,
    tag_id: tags,
    q: searchParams.q as string,
  });

  const hasFilters = category || collection;
  return (
    <>
      {products.length === 0 && (
        <div className="flex w-full flex-1 flex-col items-start gap-2 py-10">
          <Heading font="sans" mobileSize="xl" tag="h2">
            لا يوجد منتجات تطابق الخيارات المحددة
          </Heading>
          <Body font="sans" mobileSize="lg">
            لم نعثر على منتجات تطابق اختياراتك، جرّب تعديل الفلاتر وشوف خيارات
            أكثر!
          </Body>
        </div>
      )}
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        <ProductGrid products={products} />
      </div>
      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={2}
        />
      )}
    </>
  );
}

export function ProductsSkeleton() {
  return (
    <div className="inline-flex space-x-8 sm:mx-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-x-8 lg:space-x-0">
      {[...Array(9)].map((_, index) => (
        <div key={index}>
          <div className="border-accent relative aspect-square w-full rounded-lg border">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Icon
                className="animate-spin-loading size-10"
                name="LoadingAccent"
              />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-1 px-6 py-4">
            <div className="bg-accent h-[30px] w-3/4 rounded-sm opacity-10" />
            <div className="bg-accent h-6 w-1/2 rounded-sm opacity-10" />
          </div>
        </div>
      ))}
    </div>
  );
}

function parseSearchParam(
  value: string | string[] | undefined,
): string | undefined {
  if (typeof value === "string") {
    return value;
  } else if (Array.isArray(value)) {
    return value[0];
  } else {
    return undefined;
  }
}
