import React from "react";

import type {ModularPageSection} from "./types";

import Label from "../shared/typography/label";

export default function Marquee(props: ModularPageSection<"section.marquee">) {
  const item = (
    <div className="animate-marquee flex shrink-0 items-center justify-start gap-20 [--duration:15s] [--gap:5rem]">
      {props.text?.map((item) => {
        return (
          <Label
            className="whitespace-nowrap"
            font="display"
            key={item}
            mobileSize="6xl"
          >
            {item}
          </Label>
        );
      })}
    </div>
  );
  return (
    <section
      className="max-w-max-screen mx-auto flex items-center gap-20 overflow-hidden px-8 py-10"
      {...props.rootHtmlAttributes}
    >
      {item}
      {item}
    </section>
  );
}
