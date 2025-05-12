"use client";
import type {Header} from "@/types/sanity.generated";
import type {Dispatch, SetStateAction} from "react";

import {Cta, Link} from "@/components/shared/button";
import Icon from "@/components/shared/icon";
import {SanityImage} from "@/components/shared/sanity-image";
import Body from "@/components/shared/typography/body";
import Heading from "@/components/shared/typography/heading";
import Label from "@/components/shared/typography/label";
import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import {cx} from "cva";
import NextLink from "next/link";
import {useState} from "react";
import {RemoveScroll} from "react-remove-scroll";

import type {Country} from "../../country-selector/country-selector-dialog";
import {StoreCustomer} from "@medusajs/types";
import {ChevronLeft, ChevronRight} from "lucide-react";

type DropdownType = Extract<
  NonNullable<Header["navigation"]>[number],
  {_type: "dropdown"}
>;

export default function Hamburger({
  countries,
  customer,
  data,
}: {
  countries: Country[];
  customer: StoreCustomer | null;
  data: Header;
}) {
  const [open, setOpen] = useState(false);
  const [activeMenuState, setActiveMenu] = useState<string | undefined>(
    undefined,
  );

  const portalContainer =
    typeof document !== "undefined"
      ? document.getElementById("navigation-portal")
      : null;

  const isMenuActive = data.navigation?.some(
    (menu) => menu._key === activeMenuState && menu._type === "dropdown",
  );
  const activeMenu: any = data.navigation?.find(
    (menu) => menu._key === activeMenuState && menu._type === "dropdown",
  );

  return (
    <Dialog.Root onOpenChange={setOpen} open={open}>
      <Dialog.Trigger
        aria-label="Menu"
        className="flex flex-1 shrink-0 lg:hidden"
        onClick={() => setActiveMenu(undefined)}
      >
        {open ? (
          <Icon className="size-lg" name="Close" />
        ) : (
          <Icon className="size-lg" name="Hamburger" />
        )}
      </Dialog.Trigger>
      <Dialog.Portal container={portalContainer}>
        <RemoveScroll>
          <Dialog.Content className="bg-background w-screen items-end justify-end overflow-x-hidden">
            <VisuallyHidden.Root>
              <Dialog.Title className="">القائمة</Dialog.Title>
            </VisuallyHidden.Root>
            <div
              className={cx(
                "scrollbar-hide bg-background fixed top-[calc(var(--header-height))] left-0 flex h-[calc(100dvh-var(--header-height))] w-screen flex-1 flex-col items-start justify-between overflow-x-hidden overflow-y-scroll transition-all duration-300",
                {
                  "translate-x-full": isMenuActive,
                  "translate-x-0": !isMenuActive,
                },
              )}
            >
              <div className="flex h-auto w-full flex-col">
                {data.navigation?.map((item) => (
                  <NavMenuItem
                    item={item}
                    key={item._key}
                    setActiveMenu={setActiveMenu}
                    setOpen={setOpen}
                  />
                ))}
              </div>
              <div className="p-5">
                <Link variant="outline" href={customer ? "/account" : "/auth"}>
                  الحساب
                </Link>
              </div>
            </div>
            <div
              className={`scrollbar-hide bg-background fixed top-[calc(var(--header-height))] left-0 h-[calc(100dvh-var(--header-height))] w-screen transform overflow-x-hidden overflow-y-scroll transition-all duration-300 ${
                isMenuActive ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="h-auto w-full">
                <button
                  className="flex items-center justify-start gap-4 p-5"
                  onClick={() => setActiveMenu(undefined)}
                >
                  <ChevronRight className="size-8" />
                  <Body font="sans" mobileSize="2xl">
                    {activeMenu?.title}
                  </Body>
                </button>
                <DropdownList activeMenu={activeMenu} setOpen={setOpen} />
              </div>
            </div>
          </Dialog.Content>
        </RemoveScroll>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function NavMenuItem({
  item,
  setActiveMenu,
  setOpen,
}: {
  item: NonNullable<Header["navigation"]>[number];
  setActiveMenu: (key: string) => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  if (item._type === "link") {
    return (
      <>
        {item.cta?.link && (
          <NextLink
            className="p-5"
            href={item.cta?.link}
            onClick={() => setOpen(false)}
          >
            <Body font="sans" mobileSize="2xl">
              {item.cta?.label}
            </Body>
          </NextLink>
        )}
      </>
    );
  }

  if (item._type === "dropdown") {
    return (
      <div
        className="flex items-center justify-between p-5"
        key={item._key}
        onClick={() => setActiveMenu(item._key)}
      >
        <Body font="sans" mobileSize="2xl">
          {item.title}
        </Body>
        <ChevronLeft className="size-8" />
      </div>
    );
  }
  return null;
}

function DropdownList({
  activeMenu,
  setOpen,
}: {
  activeMenu: DropdownType;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="flex h-full w-full flex-col items-start gap-8 pb-6">
      {activeMenu?.columns?.map((item) => {
        return (
          <div
            className="flex flex-col items-start justify-start gap-4 px-5"
            key={item._key}
          >
            <Body font="sans" mobileSize="base">
              {item.title}
            </Body>
            {item.links?.map((link) => {
              if (!link.link) return null;
              return (
                <NextLink
                  className="flex w-full items-start justify-start gap-2 py-1"
                  href={link.link}
                  key={link._key}
                  onClick={() => setOpen(false)}
                >
                  <Label className="font-medium" font="sans" mobileSize="2xl">
                    {link.label}
                  </Label>
                </NextLink>
              );
            })}
          </div>
        );
      })}
      <div className="scrollbar-hide flex w-full gap-2 overflow-x-scroll">
        {activeMenu?.cards?.map((card) => {
          return (
            <div
              className="flex w-[220px] max-w-[220px] min-w-[160px] shrink-0 flex-col items-center gap-2 rounded-md first:mr-5 last:ml-5"
              key={card._key}
            >
              {card.image ? (
                <SanityImage
                  className="aspect-square max-h-[220px] w-[220px] min-w-[160px] rounded-md"
                  data={card.image}
                />
              ) : (
                <div className="bg-accent aspect-square w-full rounded-md" />
              )}

              <Heading
                className="text-center"
                font="serif"
                mobileSize="xs"
                tag="h5"
              >
                {card.title}
              </Heading>
              {card.cta?.link && (
                <Link
                  className="mt-2"
                  href={card.cta?.link}
                  size="sm"
                  variant="outline"
                >
                  {card.cta?.label}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
