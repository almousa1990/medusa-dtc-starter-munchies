import type {PageProps} from "@/types";
import type {Metadata} from "next";
import type {PropsWithChildren} from "react";

import PreventBackNavigationSmoothScroll from "@/components/prevent-back-navigation-smooth-scroll";
import config from "@/config";
import {loadGlobalData} from "@/data/sanity";
import {getOgImages} from "@/data/sanity/resolve-sanity-route-metadata";
import {Cta, Link} from "@/components/shared/button";
import {ChevronRight} from "lucide-react";
import LocalizedLink from "@/components/shared/localized-link";
import {Toaster} from "@merchify/ui";

type LayoutProps = PropsWithChildren<
  Omit<PageProps<"countryCode">, "searchParams">
>;

export async function generateMetadata(): Promise<Metadata> {
  const data = await loadGlobalData();

  return {
    openGraph: {
      images: !data?.fallbackOGImage
        ? undefined
        : getOgImages(data.fallbackOGImage),
      title: config.siteName,
    },
    title: config.siteName,
  };
}

export default async function Layout(props: LayoutProps) {
  const {children} = props;

  return (
    <>
      <PreventBackNavigationSmoothScroll />
      <div
        aria-hidden="true"
        className="bg-background fixed top-0 right-0 hidden h-full w-1/2 lg:block"
      />
      <div
        aria-hidden="true"
        className="bg-accent fixed top-0 left-0 hidden h-full w-1/2 lg:block"
      />

      <header className="bg-background relative border-b text-sm font-medium">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between">
            <Link href={`/cart`} variant="secondary">
              <ChevronRight />
              <span className="hidden lg:block">العودة للسلة</span>
            </Link>
            <LocalizedLink className="" href="/" prefetch>
              <img alt="Mubchies logo" className="h-4" src="/images/logo.svg" />
            </LocalizedLink>
          </div>
        </div>
      </header>

      <main className="relative mx-auto grid w-full max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8">
        {children}
      </main>

      <Toaster />
    </>
  );
}
