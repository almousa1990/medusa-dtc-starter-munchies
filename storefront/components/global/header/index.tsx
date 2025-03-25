import type {Header} from "@/types/sanity.generated";

import Icon from "@/components/shared/icon";
import LocalizedLink from "@/components/shared/localized-link";
import {Suspense} from "react";

import Cart from "./cart";
import AnnouncementBar from "./parts/announcement-bar";
import BottomBorder from "./parts/bottom-border";
import HamburgerContainer from "./parts/hamburger/container";
import Navigation from "./parts/navigation";

export default function Header(props: {countryCode: string} & Header) {
  return (
    <header className="bg-background sticky top-0 z-50 flex w-full flex-col items-center">
      <AnnouncementBar {...props} />
      <div className="max-w-max-screen mx-auto flex w-full items-center justify-between gap-10 px-5 py-2 lg:px-8">
        <Suspense>
          <Navigation data={props} />
        </Suspense>
        <HamburgerContainer sanityData={props} />

        <div className="flex items-center gap-4">
          <LocalizedLink href="/" prefetch>
            <img
              alt="Mubchies logo"
              className="my-[9px] h-[22px] w-fit lg:my-[10px] lg:h-6"
              src="/images/logo.svg"
            />
          </LocalizedLink>
        </div>

        <div className="flex flex-1 items-center justify-end gap-6">
          <div className="hidden lg:flex lg:gap-4">
            <Suspense
              fallback={
                <div className="relative h-10 w-10 p-2">
                  <Icon name="Search" />
                </div>
              }
            >
              <Icon name="Search" />
            </Suspense>
            <Suspense
              fallback={
                <div className="relative h-10 w-10 p-2">
                  <Icon name="Account" />
                </div>
              }
            >
              <Icon name="Account" />
            </Suspense>
          </div>
          <Suspense
            fallback={
              <div className="relative h-10 w-10 p-2">
                <Icon name="Cart" />
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

      <BottomBorder className="lg:hidden" />
    </header>
  );
}
