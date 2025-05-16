"use client";

import type {Header} from "@/types/sanity.generated";

import {RichText} from "@/components/shared/rich-text";
import Body from "@/components/shared/typography/body";
import {X} from "lucide-react";
import React, {Fragment, useState} from "react";

export default function AnnouncementBar({
  announcementText,
  showAnnouncement,
}: Pick<Header, "announcementText" | "showAnnouncement">) {
  const [isActive, setIsActive] = useState(true);
  return (
    <Fragment>
      {isActive && showAnnouncement && (
        <div className="bg-primary text-primary-foreground w-full">
          <div className="mx-auto flex w-full max-w-xl items-center justify-between px-4 py-[7.5px] sm:px-6 lg:max-w-7xl lg:px-8">
            {announcementText && (
              <Body desktopSize="sm" font="sans" mobileSize="xs">
                <RichText value={announcementText} />
              </Body>
            )}
            <button onClick={() => setIsActive(false)}>
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}
    </Fragment>
  );
}
