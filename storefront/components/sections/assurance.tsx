import React from "react";

import type {ModularPageSection} from "./types";

import Body from "../shared/typography/body";
import Heading from "../shared/typography/heading";

export default function Assurance(
  props: ModularPageSection<"section.assurance">,
) {
  return (
    <section
      {...props.rootHtmlAttributes}
      className="max-w-max-screen gap-4xl px-md py-2xl lg:px-xl mx-auto flex w-full flex-col items-center justify-start"
    >
      {props.title && (
        <Heading
          className="text-center"
          desktopSize="3xl"
          mobileSize="xl"
          tag="h3"
        >
          {props.title}
        </Heading>
      )}
      <div className="gap-md lg:gap-2xl flex w-full flex-col items-center justify-between lg:flex-row">
        {props.cards?.map((card) => (
          <Item
            description={card.description}
            key={card._key}
            title={card.title}
          />
        ))}
      </div>
    </section>
  );
}

function Item({
  description,
  title,
}: {
  description: string | undefined;
  title: string | undefined;
}) {
  return (
    <div className="gap-xs flex w-full max-w-[400px] flex-col items-center text-center">
      <Heading mobileSize="base" tag="h5">
        {title}
      </Heading>
      <Body font="sans" mobileSize="base">
        {description}
      </Body>
    </div>
  );
}
