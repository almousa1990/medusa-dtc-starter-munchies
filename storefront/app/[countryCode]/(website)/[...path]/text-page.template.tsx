import type {TEXT_PAGE_QUERYResult} from "@/types/sanity.generated";

import {TextPageRichText} from "@/components/shared/rich-text";
import Body from "@/components/shared/typography/body";
import Heading from "@/components/shared/typography/heading";
import React from "react";

import TableOfContents from "./_part/table-of-content";

export default function TextPage({
  data,
}: {
  data: NonNullable<TEXT_PAGE_QUERYResult>;
}) {
  return (
    <div className="scroll-mt-header-height flex-col items-center justify-center">
      <section className="gap-xs bg-accent px-xl py-8xl text-background flex w-full flex-col items-center justify-center text-center">
        <Heading
          className="heading-l mx-auto w-fit"
          desktopSize="5xl"
          font="serif"
          mobileSize="xl"
          tag="h1"
        >
          {data?.title}
        </Heading>
        <Body className="max-w-[600px]" font="sans" mobileSize="base">
          {data.description}
        </Body>
      </section>
      <section className="max-w-max-screen gap-xl px-md py-2xl lg:gap-6xl lg:py-8xl mx-auto h-full w-full flex-col items-stretch justify-start lg:flex-row lg:justify-center">
        <div className="gap-xl flex w-full flex-col justify-center lg:flex-row lg:gap-20">
          {data?.body && (
            <aside className="h-auto w-full lg:max-w-[300px]">
              <TableOfContents body={data?.body} />
            </aside>
          )}
          {data?.body && (
            <div className="w-full lg:max-w-[700px]">
              <TextPageRichText value={data?.body} />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
