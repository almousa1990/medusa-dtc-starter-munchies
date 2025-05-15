import type {Footer} from "@/types/sanity.generated";

import LocalizedLink from "@/components/shared/localized-link";
import {RichText} from "@/components/shared/rich-text";
import Body from "@/components/shared/typography/body";
import Heading from "@/components/shared/typography/heading";

export default function TopLinks({information, linkList}: NonNullable<Footer>) {
  return (
    <div className="flex flex-col items-start justify-between gap-10">
      <div className="grid w-full gap-10 sm:grid-cols-2 lg:grid-cols-5">
        {information?.map((column) => {
          if (!column.text) return null;
          return (
            <div className="flex flex-col gap-8" key={column._key}>
              <RichText value={column.text} />
            </div>
          );
        })}
        {linkList?.map((list) => (
          <div className="flex flex-col gap-2" key={list._key}>
            <Heading tag="h3">{list.heading}</Heading>
            {list.links?.map((link) => {
              if (!link.link) return null;
              return (
                <LocalizedLink href={link.link} key={link._key}>
                  <Body desktopSize="base" font="sans" mobileSize="sm">
                    {link.label}
                  </Body>
                </LocalizedLink>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
