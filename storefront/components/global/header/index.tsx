import type {Header} from "@/types/sanity.generated";

import LocalizedLink from "@/components/shared/localized-link";
import {Suspense} from "react";

import Cart from "./cart";
import AnnouncementBar from "./parts/announcement-bar";
import HamburgerContainer from "./parts/hamburger/container";
import Navigation from "./parts/navigation";
import {CircleUserRound, Search, ShoppingBag} from "lucide-react";
import {StoreCustomer} from "@medusajs/types";

export default function Header(
  props: {countryCode: string; customer: StoreCustomer | null} & Header,
) {
  return (
    <header className="bg-background sticky top-0 z-50 flex w-full flex-col items-center border-b">
      <AnnouncementBar {...props} />
      <div className="max-w-max-screen mx-auto flex w-full items-center justify-between gap-10 px-5 py-2 lg:px-8">
        <Suspense>
          <Navigation data={props} />
        </Suspense>
        <HamburgerContainer customer={props.customer} sanityData={props} />

        <div className="flex items-center gap-4">
          <LocalizedLink href="/" prefetch>
            <img
              alt="Mubchies logo"
              className="my-[9px] h-4 w-fit lg:my-[10px] lg:h-6"
              src="/images/logo.svg"
            />
          </LocalizedLink>
        </div>

        <div className="flex flex-1 items-center justify-end gap-6">
          <div className="hidden lg:flex lg:gap-2">
            <LocalizedLink href="/" className="relative h-10 w-10 p-2">
              <Search />
            </LocalizedLink>
            <LocalizedLink
              href={props.customer ? "/account" : "/auth"}
              className="relative h-10 w-10 p-2"
            >
              <CircleUserRound />
            </LocalizedLink>
          </div>
          <Suspense
            fallback={
              <div className="relative h-10 w-10 p-2">
                <ShoppingBag />
              </div>
            }
          >
            <Cart
              cartAddons={props.cartAddons}
              countryCode={props.countryCode}
            />
          </Suspense>
        </div>
      </div>
      <div className="relative z-30 w-screen" id="navigation-portal" />
    </header>
  );
}
