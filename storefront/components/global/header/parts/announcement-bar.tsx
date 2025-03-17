"use client";

import type {Header} from "@/types/sanity.generated";

import Icon from "@/components/shared/icon";
import {RichText} from "@/components/shared/rich-text";
import Body from "@/components/shared/typography/body";
import React, {Fragment, useState} from "react";

export default function AnnouncementBar({
  announcementText,
  showAnnouncement,
}: Pick<Header, "announcementText" | "showAnnouncement">) {
  const [isActive, setIsActive] = useState(true);
  return (
    <Fragment>
      {isActive && showAnnouncement && (
        <div className="bg-secondary w-full">
          <div className="max-w-max-screen bg-secondary px-md lg:px-xl mx-auto flex w-full items-center justify-between py-[7.5px]">
            {announcementText && (
              <Body desktopSize="sm" font="sans" mobileSize="xs">
                <RichText value={announcementText} />
              </Body>
            )}
            <button onClick={() => setIsActive(false)}>
              <Icon className="h-[14px] w-[14px]" name="Close" />
            </button>
          </div>
        </div>
      )}
    </Fragment>
  );
}
