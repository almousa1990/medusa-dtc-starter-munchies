import type {PageProps} from "@/types";
import type {Metadata} from "next";
import type {PropsWithChildren} from "react";

import Footer from "@/components/global/footer";
import Header from "@/components/global/header";
import PreventBackNavigationSmoothScroll from "@/components/prevent-back-navigation-smooth-scroll";
import config from "@/config";
import {loadGlobalData} from "@/data/sanity";
import {getOgImages} from "@/data/sanity/resolve-sanity-route-metadata";
import {getCustomer} from "@/data/medusa/customer";

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
  const params = await props.params;

  const {children} = props;

  const data = await loadGlobalData();
  const customer = await getCustomer();

  return (
    <>
      <PreventBackNavigationSmoothScroll />
      {data.header && (
        <Header
          {...data.header}
          countryCode={params.countryCode}
          customer={customer}
        />
      )}
      <main className="mt-8 w-full flex-1 px-4 pb-16 sm:px-6 sm:pb-24 lg:mx-auto lg:max-w-7xl lg:px-8">
        {children}
      </main>
      {data.footer && <Footer {...data.footer} />}
    </>
  );
}
