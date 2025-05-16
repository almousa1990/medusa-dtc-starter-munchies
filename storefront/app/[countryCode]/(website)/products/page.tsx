import type {PageProps} from "@/types";

import ContextBar from "@/components/global/context-bar";
import PaginatedProducts, {
  ProductsSkeleton,
} from "@/components/products/paginated-product";
import Heading from "@/components/shared/typography/heading";
import {Suspense} from "react";

type ProductsPageProps = PageProps<
  "countryCode",
  "category" | "collection" | "page" | "q" | "sort"
>;

export default async function ProductsPage(props: ProductsPageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  return (
    <main>
      <ContextBar
        breadcrumbItems={[{label: "نتائج البحث"}]}
        className="my-6"
        countryCode={params.countryCode}
      />

      <section className="mx-auto flex max-w-xl flex-col gap-10 px-4 py-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div>
          <Heading desktopSize="4xl" font="serif" mobileSize="2xl" tag="h1">
            {searchParams.q ? (
              <>عرض نتائج البحث عن &apos;{searchParams.q}&apos;</>
            ) : (
              <>ما الذي ترغب في العثور عليه؟</>
            )}
          </Heading>
        </div>
      </section>
      <section className="mx-auto flex max-w-xl flex-col gap-10 px-4 pt-6 pb-16 sm:px-6 sm:pt-8 sm:pb-24 lg:max-w-7xl lg:px-8">
        <Suspense fallback={<ProductsSkeleton />}>
          <PaginatedProducts
            countryCode={params.countryCode}
            searchParams={searchParams}
          />
        </Suspense>
      </section>
    </main>
  );
}
