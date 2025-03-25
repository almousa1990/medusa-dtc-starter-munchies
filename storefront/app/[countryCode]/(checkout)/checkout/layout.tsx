import type {PageProps} from "@/types";
import type {Metadata} from "next";
import type {PropsWithChildren} from "react";

import Footer from "@/components/global/footer";
import BottomBorder from "@/components/global/header/parts/bottom-border";
import PreventBackNavigationSmoothScroll from "@/components/prevent-back-navigation-smooth-scroll";
import LocalizedLink from "@/components/shared/localized-link";
import config from "@/config";
import {loadGlobalData} from "@/data/sanity";
import {getOgImages} from "@/data/sanity/resolve-sanity-route-metadata";

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

  const data = await loadGlobalData();

  return (
    <>
      <PreventBackNavigationSmoothScroll />

      <main className="flex flex-col lg:min-h-screen lg:flex-row-reverse lg:overflow-hidden">
        {children}
      </main>
    </>
  );
}
