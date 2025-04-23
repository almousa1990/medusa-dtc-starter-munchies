import React from "react";

import type {ModularPageSection} from "./types";

import Body from "../shared/typography/body";

export default function CenteredText(
  props: ModularPageSection<"section.centeredText">,
) {
  return (
    <section
      {...props.rootHtmlAttributes}
      className="full max-w-max-screen mx-auto p-5 lg:p-8"
    >
      <div className="rounded-lg border px-4 py-[90px] lg:py-[108px]">
        <Body
          className="mx-auto max-w-[720px] text-center text-balance"
          desktopSize="4xl"
          font="serif"
          mobileSize="3xl"
        >
          {props.text}
        </Body>
      </div>
    </section>
  );
}
