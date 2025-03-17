import {cx} from "cva";
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
      className={cx(
        "max-w-max-screen px-md py-xl lg:px-xl lg:py-2xl mx-auto flex w-full flex-col items-stretch justify-center gap-2",
        {
          "lg:flex-row": position === "right",
          "lg:flex-row-reverse": position === "left",
        },
      )}
    >
      <div className="border-accent p-sm lg:py-7xl relative flex min-h-[390px] flex-col items-center justify-start gap-11 rounded-lg border sm:justify-center lg:w-1/2">
        <Label
          className="sm:top-xl whitespace-nowrap sm:absolute sm:left-1/2 sm:-translate-x-1/2"
          desktopSize="base"
          font="display"
          mobileSize="sm"
        >
          {props.title}
        </Label>
        <Body
          className="max-w-[580px] text-center text-pretty"
          desktopSize="6xl"
          font="serif"
          mobileSize="4xl"
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
