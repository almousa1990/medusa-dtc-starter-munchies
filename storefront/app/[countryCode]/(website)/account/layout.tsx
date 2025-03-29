import type {PageProps} from "@/types";
import type {Metadata} from "next";
import type {PropsWithChildren} from "react";

import config from "@/config";
import {getCustomer} from "@/data/medusa/customer";
import {loadGlobalData} from "@/data/sanity";
import {getOgImages} from "@/data/sanity/resolve-sanity-route-metadata";

import SideNavigation from "./_parts/side-navigation";

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

const sidebarNavItems = [
  {
    href: "/account/profile",
    title: "الملف الشخصي",
  },
  {
    href: "/account/addresses",
    title: "العناوين",
  },
  {
    href: "/account/orders",
    title: "الطلبات",
  },
  {
    href: "/account/logout",
    title: "تسجيل الخروج",
  },
];

export default async function Layout(props: LayoutProps) {
  const {children} = props;

  const customer = await getCustomer();

  if (!customer) {
    throw new Error("Authenticated user not found. This should not happen.");
  }

  return (
    <div className="space-y-6 p-5 pb-16 md:block lg:p-10">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">
          هلا {customer.first_name}!
        </h2>
        <p className="text-muted-foreground"></p>
      </div>
      <Separator />

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        <aside className="lg:w-1/5">
          <SideNavigation items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  );
}

function Separator() {
  return <div className="bg-accent my-6 h-px w-full" />;
}
