import type {PageProps} from "@/types";
import type {Metadata} from "next";
import type {PropsWithChildren} from "react";
import Image from "next/image";
import Link from "next/link";

import config from "@/config";
import {loadGlobalData} from "@/data/sanity";
import {getOgImages} from "@/data/sanity/resolve-sanity-route-metadata";
import {buttonVariants, cn} from "@merchify/ui";
import LocalizedLink from "@/components/shared/localized-link";

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
  console.log("got layout");

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
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
    </div>
  );
}

/*
    <div className="mx-auto flex min-h-full flex-1">
      <div className="relative container grid flex-1 flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="text-background relative z-20 flex items-center text-lg font-medium">
            <LocalizedLink href="/" prefetch>
              <img
                alt="Mubchies logo"
                className="my-[9px] h-[22px] w-fit lg:my-[10px] lg:h-6"
                src="/images/logo-foreground.svg"
              />
            </LocalizedLink>
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;This library has saved me countless hours of work and
                helped me deliver stunning designs to my clients faster than
                ever before.&rdquo;
              </p>
              <footer className="text-sm">Sofia Davis</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            {children}
          </div>
        </div>
      </div>
    </div>

*/
