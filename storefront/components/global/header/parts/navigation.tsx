"use client";

import type {Header} from "@/types/sanity.generated";

import {Link} from "@/components/shared/button";
import LocalizedLink from "@/components/shared/localized-link";
import {SanityImage} from "@/components/shared/sanity-image";
import Body from "@/components/shared/typography/body";
import Heading from "@/components/shared/typography/heading";
import Label from "@/components/shared/typography/label";
import {cx} from "cva";
import {usePathname, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {RemoveScroll} from "react-remove-scroll";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";

import BottomBorder from "./bottom-border";
import {cn, navigationMenuTriggerStyle} from "@merchify/ui";
import {ChevronDown} from "lucide-react";

type DropdownType = Extract<
  NonNullable<Header["navigation"]>[number],
  {_type: "dropdown"}
>;

export default function Navigation({data}: {data: Header}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [openDropdown, setOpenDropdown] = useState<string>("");
  const handleValueChange = (value: string) => {
    setOpenDropdown(value);
  };

  useEffect(() => {
    setOpenDropdown("");
  }, [pathname, searchParams]);

  return (
    <NavigationMenu.Root
      className="z-20 hidden lg:block"
      onValueChange={handleValueChange}
      dir="rtl"
      value={openDropdown}
    >
      <NavigationMenu.List className="group flex flex-1 list-none items-center justify-center space-x-1">
        {data.navigation?.map((item) => {
          if (item._type === "link") {
            if (!item.cta?.link) return null;
            return (
              <NavigationMenu.Item key={item._key}>
                <NavigationMenu.Link
                  asChild
                  className={cn(navigationMenuTriggerStyle(), "group")}
                >
                  <LocalizedLink href={item.cta?.link} key={item._key} passHref>
                    <Body font="sans" className="font-medium" mobileSize="base">
                      {item.cta?.label}
                    </Body>
                  </LocalizedLink>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            );
          } else if (item._type === "dropdown") {
            return (
              <NavigationMenu.Item key={item._key}>
                <NavigationMenu.Trigger
                  className={cn(navigationMenuTriggerStyle(), "group")}
                >
                  <Body font="sans" className="font-medium" mobileSize="base">
                    {item.title}
                  </Body>
                  <ChevronDown
                    className="relative top-[1px] mr-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
                    aria-hidden="true"
                  />
                </NavigationMenu.Trigger>
                <NavigationMenu.Content
                  dir="rtl"
                  className="bg-background absolute top-0 left-0 z-[30] w-full"
                >
                  <Content {...item} />
                </NavigationMenu.Content>
              </NavigationMenu.Item>
            );
          }
        })}
      </NavigationMenu.List>
      <div className="absolute top-full left-0 flex w-full flex-1 flex-col justify-center overflow-hidden bg-transparent perspective-[2000px]">
        <BottomBorder DropdownOpen={!!openDropdown} />

        <NavigationMenu.Viewport className="bg-background relative mx-auto h-[var(--radix-navigation-menu-viewport-height)] w-full origin-[top_center] overflow-hidden" />
        <div
          className={cx("bg-border relative w-full", {
            "animate-in fade-in h-px": openDropdown,
            "animate-our fade-out h-0": !openDropdown,
          })}
        />
      </div>
    </NavigationMenu.Root>
  );
}

function Content({cards, columns}: DropdownType) {
  const [hoveredKey, setHoveredKey] = useState<null | string | undefined>(null);

  return (
    <RemoveScroll>
      <div className="relative mx-auto flex max-w-xl items-start justify-between gap-8 px-4 py-10 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="group flex flex-wrap items-start justify-start gap-6">
          {columns?.map((link) => {
            return (
              <div
                className="flex min-w-[270px] flex-col items-start justify-start"
                key={link._key}
              >
                <Body className="pb-4" font="sans" mobileSize="base">
                  {link.title}
                </Body>
                {link.links?.map((link) => {
                  if (!link?.link) return null;
                  return (
                    <LocalizedLink
                      className={cx("py-2 last:pb-0")}
                      href={link.link}
                      key={link._key}
                      onMouseEnter={() => setHoveredKey(link._key)}
                      onMouseLeave={() => setHoveredKey(null)}
                      prefetch
                    >
                      <Label font="sans" mobileSize="lg">
                        {link.label}
                      </Label>
                    </LocalizedLink>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div className="scrollbar-hide flex flex-wrap items-stretch justify-start gap-6">
          {cards?.map((card) => {
            return <Product key={card._key} {...card} />;
          })}
        </div>
      </div>
    </RemoveScroll>
  );
}

function Product({
  cta,
  image,
  title,
}: NonNullable<DropdownType["cards"]>[number]) {
  if (!cta?.link) return null;
  return (
    <div className="group relative flex w-[220px] max-w-[220px] min-w-[160px] shrink-0 flex-col items-center gap-2 rounded-md">
      <LocalizedLink
        className="absolute inset-0 z-10"
        href={cta?.link}
        prefetch
      />
      {image ? (
        <SanityImage
          className="aspect-square max-h-[220px] w-[220px] min-w-[160px] cursor-pointer rounded-md"
          data={image}
        />
      ) : (
        <div className="bg-accent aspect-square w-full rounded-md" />
      )}

      <Heading className="text-center" font="serif" mobileSize="xs" tag="h5">
        {title}
      </Heading>
      {cta && (
        <Link className="mt-2" href={cta?.link} size="sm" variant="outline">
          {cta?.label}
        </Link>
      )}
    </div>
  );
}
