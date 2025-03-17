import React from "react";

import type {ModularPageSection} from "./types";

import Body from "../shared/typography/body";

export default function CenteredText(
  props: ModularPageSection<"section.centeredText">,
) {
  return (
    <section
      {...props.rootHtmlAttributes}
      className="full max-w-max-screen p-md lg:p-xl mx-auto"
    >
      <div className="border-accent px-sm rounded-lg border py-[90px] lg:py-[108px]">
        <Body
          className="mx-auto max-w-[720px] text-center text-balance"
          desktopSize="6xl"
          font="serif"
          mobileSize="4xl"
        >
          {props.text}
        </Body>
      </div>
    </section>
  );
}
