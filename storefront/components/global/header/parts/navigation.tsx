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
                    <Body font="sans" className="font-medium" mobileSize="base">
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
                  <Body font="sans" className="font-medium" mobileSize="base">
                    {item.title}
                  </Body>
                </NavigationMenu.Trigger>
                <NavigationMenu.Content
                  dir="rtl"
                  className="bg-background data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 absolute top-0 left-0 z-30 w-full"
                >
                  <Content {...item} />
                </NavigationMenu.Content>
              </NavigationMenu.Item>
            );
          }
        })}
      </NavigationMenu.List>

      <div className="absolute top-full left-0 flex w-full flex-1 flex-col justify-center overflow-hidden bg-transparent perspective-[2000px]">
        <NavigationMenu.Viewport className="bg-background data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top data-[state=open]:animate-in data-[state=closed]:animate-out relative mx-auto h-[var(--radix-navigation-menu-viewport-height)] w-full origin-[top_center] overflow-hidden border-b transition-[width,_height] data-[state=closed]:duration-100 data-[state=open]:duration-200" />
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
