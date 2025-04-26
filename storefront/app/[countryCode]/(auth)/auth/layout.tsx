import type {PageProps} from "@/types";
import type {Metadata} from "next";
import type {PropsWithChildren} from "react";

import LocalizedLink from "@/components/shared/localized-link";
import config from "@/config";
import {loadGlobalData} from "@/data/sanity";
import {getOgImages} from "@/data/sanity/resolve-sanity-route-metadata";
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
      <main className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 lg:p-10">
          <div className="flex justify-center gap-2 lg:hidden">
            <LocalizedLink href="/" prefetch>
              <img
                alt="Mubchies logo"
                className="h-5 w-fit"
                src="/images/logo.svg"
              />
            </LocalizedLink>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-sm">{children}</div>
          </div>
        </div>
        <div className="bg-muted relative hidden p-10 lg:block">
          <div className="relative z-20 flex items-center justify-end">
            <LocalizedLink href="/" prefetch>
              <img
                alt="Mubchies logo"
                className="h-5 w-fit"
                src="/images/logo.svg"
              />
            </LocalizedLink>
          </div>
        </div>
      </main>

      <Toaster />
    </>
  );
}
