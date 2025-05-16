import {cn} from "@merchify/ui";
import {stegaClean} from "next-sanity";
import React from "react";

import type {ModularPageSection} from "./types";

import {SanityImage} from "../shared/sanity-image";
import Body from "../shared/typography/body";
import Label from "../shared/typography/label";

export default function MediaText(
  props: ModularPageSection<"section.mediaText">,
) {
  const position = stegaClean(props.imagePosition);
  return (
    <section
      {...props.rootHtmlAttributes}
      className={cn(
        "max-w-max-screen mx-auto flex w-full flex-col items-stretch justify-center gap-2 px-5 py-8 lg:px-8 lg:py-10",
        {
          "lg:flex-row": position === "right",
          "lg:flex-row-reverse": position === "left",
        },
      )}
    >
      <div className="relative flex min-h-[390px] flex-col items-center justify-start gap-11 rounded-lg border p-4 sm:justify-center lg:w-1/2 lg:py-[4.5rem]">
        <Label
          className="whitespace-nowrap sm:absolute sm:top-8 sm:left-1/2 sm:-translate-x-1/2"
          desktopSize="base"
          font="display"
          mobileSize="sm"
        >
          {props.title}
        </Label>
        <Body
          className="max-w-[580px] text-center text-pretty"
          desktopSize="4xl"
          font="serif"
          mobileSize="3xl"
        >
          {props.description}
        </Body>
      </div>
      {props.image ? (
        <div className="aspect-square rounded-lg lg:w-1/2">
          <SanityImage
            alt="arrow-right"
            className="aspect-square"
            data={props.image}
          />
        </div>
      ) : (
        <div className="bg-accent aspect-square rounded-lg lg:w-1/2" />
      )}
    </section>
  );
}
