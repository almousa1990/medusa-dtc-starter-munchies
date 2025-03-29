import type {PageProps} from "@/types";

import PaginatedProducts, {
  ProductsSkeleton,
} from "@/components/products/paginated-product";
import Refinement from "@/components/products/product-refinement";
import Heading from "@/components/shared/typography/heading";
import {Suspense} from "react";

type ProductsPageProps = PageProps<
  "countryCode",
  "category" | "collection" | "page" | "sort"
>;

export default async function ProductsPage(props: ProductsPageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  console.log(searchParams);
  return (
    <section className="max-w-max-screen mx-auto flex flex-col gap-10 px-5 pt-[6.5rem] pb-10 lg:px-8">
      <div>
        <Heading desktopSize="4xl" font="serif" mobileSize="2xl" tag="h1">
          عرض جميع المنتجات
        </Heading>
      </div>
      <div className="flex flex-col gap-6">
        <Refinement />
        <Suspense fallback={<ProductsSkeleton />}>
          <PaginatedProducts
            countryCode={params.countryCode}
            searchParams={searchParams}
          />
        </Suspense>
      </div>
    </section>
  );
}
