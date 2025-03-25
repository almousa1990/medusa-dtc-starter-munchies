"use client";
import type {COOKIE_BANNER_QUERYResult} from "@/types/sanity.generated";

import {Cta} from "@/components/shared/button";
import Icon from "@/components/shared/icon";
import Body from "@/components/shared/typography/body";
import Heading from "@/components/shared/typography/heading";
import {cx} from "cva";
import React, {useState} from "react";

export default function Content({data}: {data: COOKIE_BANNER_QUERYResult}) {
  const [showCookieBanner, setShowCookieBanner] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  if (!data) return null;
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => setShowCookieBanner(false), 390);
  };

  return (
    <>
      {showCookieBanner && (
        <div
          className={cx(
            "border-accent bg-background fixed bottom-4 left-4 z-300 flex w-full max-w-[332px] flex-col rounded-lg border-[1.5px] p-4 lg:max-w-[390px] lg:p-5",
            "animate-fadeInUp",
            {
              [`animate-fadeOutLeft [--duration:400ms]`]: isClosing,
            },
          )}
        >
          <button
            className="absolute top-[6px] right-[6px]"
            onClick={handleClose}
          >
            <Icon className="size-6" name="Close" />
          </button>
          <Heading desktopSize="base" mobileSize="xs" tag="h3">
            {data.title}
          </Heading>
          <Body font="sans" mobileSize="sm">
            {data.description}
          </Body>
          <div className="mt-4 flex items-center gap-1">
            <Cta onClick={handleClose} size="sm" variant="outline">
              {data.rejectButton}
            </Cta>
            <Cta onClick={handleClose} size="sm" variant="default">
              {data.acceptButton}
            </Cta>
          </div>
        </div>
      )}
    </>
  );
}
