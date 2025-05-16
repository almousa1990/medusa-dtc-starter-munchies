import type {Footer} from "@/types/sanity.generated";

import Icon from "@/components/shared/icon";
import LocalizedLink from "@/components/shared/localized-link";
import Body from "@/components/shared/typography/body";
import React from "react";

export default function BottomLinks({
  bottomLinks,
  socialLinks,
}: NonNullable<Footer>) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
      <div className="flex flex-col gap-10 lg:flex-row">
        <Body mobileSize="sm">© {currentYear} جميع الحقوق محفوظة</Body>
        <div className="flex flex-wrap gap-10">
          {bottomLinks?.map((link) => {
            if (!link.link) return null;
            return (
              <LocalizedLink
                className="whitespace-nowrap"
                href={link.link}
                key={link._key}
              >
                <Body mobileSize="sm">{link.label}</Body>
              </LocalizedLink>
            );
          })}
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        {socialLinks?.map((link) => {
          if (!link.link) return null;
          return (
            <LocalizedLink href={link.link} key={link._key}>
              <Icon
                className="size-5"
                name={link.icon as "Instagram" | "Snapchat" | "TikTok" | "X"}
              />
            </LocalizedLink>
          );
        })}
      </div>
    </div>
  );
}
