import type {Header} from "@/types/sanity.generated";
import type {StoreCustomer} from "@medusajs/types";

import {Link} from "@/components/shared/button";
import Icon from "@/components/shared/icon";
import LocalizedLink from "@/components/shared/localized-link";
import {Suspense} from "react";

import Cart from "./cart";
import AnnouncementBar from "./parts/announcement-bar";
import BottomBorder from "./parts/bottom-border";
import HamburgerContainer from "./parts/hamburger/container";
import Navigation from "./parts/navigation";

export default function Header(
  props: {countryCode: string; customer: StoreCustomer | null} & Header,
) {
  return (
    <header className="bg-background sticky top-0 z-50 flex w-full flex-col items-center">
      <AnnouncementBar {...props} />
      <div className="mx-auto flex w-full max-w-xl items-center justify-between gap-10 px-4 py-2 sm:px-6 lg:max-w-7xl lg:px-8">
        <HamburgerContainer customer={props.customer} sanityData={props} />

        <div className="flex items-center gap-4">
          <LocalizedLink href="/" prefetch>
            <img
              alt="Mubchies logo"
              className="my-[9px] h-4 w-fit lg:my-[10px] lg:h-5"
              src="/images/logo.svg"
            />
          </LocalizedLink>
        </div>
        <Suspense>
          <Navigation data={props} />
        </Suspense>
        <div className="flex flex-1 items-center justify-end gap-4">
          <div className="hidden lg:flex lg:gap-2">
            {props.customer ? (
              <Link href={"/account"} variant={"ghost"}>
                حسابي
              </Link>
            ) : (
              <Link href={"/auth"} variant={"ghost"}>
                تسجيل الدخول أو إنشاء حساب
              </Link>
            )}
          </div>
          <Suspense fallback={<Icon className="size-6" name="Cart" />}>
            <Cart
              cartAddons={props.cartAddons}
              countryCode={props.countryCode}
            />
          </Suspense>
        </div>
      </div>
      <div className="relative z-30 w-screen" id="navigation-portal" />
      <BottomBorder className="lg:hidden" />
    </header>
  );
}
