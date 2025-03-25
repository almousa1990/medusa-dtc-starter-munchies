"use client";

import type {Header} from "@/types/sanity.generated";

import {Link} from "@/components/shared/button";
import LocalizedLink from "@/components/shared/localized-link";
import {SanityImage} from "@/components/shared/sanity-image";
import Body from "@/components/shared/typography/body";
import Heading from "@/components/shared/typography/heading";
import Label from "@/components/shared/typography/label";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import {cx} from "cva";
import {usePathname, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {RemoveScroll} from "react-remove-scroll";

import BottomBorder from "./bottom-border";

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
      className="z-20 hidden lg:block lg:flex-1"
      onValueChange={handleValueChange}
      value={openDropdown}
    >
      <NavigationMenu.List
        className="group flex items-center justify-start"
        dir="rtl"
      >
        {data.navigation?.map((item) => {
          if (item._type === "link") {
            if (!item.cta?.link) return null;
            return (
              <LocalizedLink
                className={cx(
                  "h-full px-5 py-[14.5px] whitespace-nowrap transition-opacity duration-300 group-hover:opacity-50 hover:opacity-100!",
                  {
                    "opacity-50": !!openDropdown,
                  },
                )}
                href={item.cta?.link}
                key={item._key}
                prefetch
              >
                <NavigationMenu.Item>
                  <NavigationMenu.Link asChild>
                    <Body font="sans" mobileSize="lg">
                      {item.cta?.label}
                    </Body>
                  </NavigationMenu.Link>
                </NavigationMenu.Item>
              </LocalizedLink>
            );
          } else if (item._type === "dropdown") {
            return (
              <NavigationMenu.Item key={item._key}>
                <NavigationMenu.Trigger
                  className={cx(
                    "px-5 py-[14.5px] whitespace-nowrap transition-all duration-300 group-hover:opacity-50 hover:opacity-100! data-[state=open]:opacity-100",
                    {
                      "opacity-50": !!openDropdown,
                    },
                  )}
                >
                  <Body font="sans" mobileSize="lg">
                    {item.title}
                  </Body>
                </NavigationMenu.Trigger>
                <NavigationMenu.Content className="bg-background data-[motion=from-end]:animate-enterFromRight data-[motion=from-start]:animate-enterFromLeft data-[motion=to-end]:animate-exitToRight data-[motion=to-start]:animate-exitToLeft absolute top-0 left-0 z-30 w-full">
                  <Content {...item} />
                </NavigationMenu.Content>
              </NavigationMenu.Item>
            );
          }
        })}
      </NavigationMenu.List>

      <div className="absolute top-full left-0 flex w-full flex-1 flex-col justify-center overflow-hidden bg-transparent perspective-[2000px]">
        <BottomBorder DropdownOpen={!!openDropdown} />
        <NavigationMenu.Viewport className="bg-background data-[state=closed]:animate-exitToTop data-[state=open]:animate-enterFromTop relative mx-auto h-[var(--radix-navigation-menu-viewport-height)] w-full origin-[top_center] overflow-hidden transition-[width,_height] duration-300" />
        <div
          className={cx(
            "bg-accent relative w-full transition-all duration-300",
            {
              "animate-enterFromTop h-[1.5px]": openDropdown,
              "animate-exitToTop h-0": !openDropdown,
            },
          )}
        />
      </div>
    </NavigationMenu.Root>
  );
}

function Content({cards, columns}: DropdownType) {
  const [hoveredKey, setHoveredKey] = useState<null | string | undefined>(null);

  return (
    <RemoveScroll>
      <div className="max-w-max-screen relative mx-auto flex items-start justify-between gap-8 px-8 py-10">
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
                      className={cx(
                        "py-2 opacity-100 transition-opacity duration-300 group-hover:opacity-50 last:pb-0",
                        {
                          "opacity-100!": hoveredKey === link._key,
                        },
                      )}
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
    <div className="group relative flex w-[220px] max-w-[220px] min-w-[160px] shrink-0 flex-col items-center gap-2 rounded-lg">
      <LocalizedLink
        className="absolute inset-0 z-10"
        href={cta?.link}
        prefetch
      />
      {image ? (
        <SanityImage
          className="aspect-square max-h-[220px] w-[220px] min-w-[160px] cursor-pointer rounded-lg"
          data={image}
        />
      ) : (
        <div className="bg-accent aspect-square w-full rounded-lg" />
      )}

      <Heading className="text-center" font="serif" mobileSize="xs" tag="h5">
        {title}
      </Heading>
      {cta && (
        <Link className="mt-xs" href={cta?.link} size="sm" variant="outline">
          {cta?.label}
        </Link>
      )}
    </div>
  );
}
