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
      <section className="bg-accent text-background flex w-full flex-col items-center justify-center gap-2 px-8 py-20 text-center">
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
      <section className="max-w-max-screen mx-auto h-full w-full flex-col items-stretch justify-start gap-8 px-5 py-10 lg:flex-row lg:justify-center lg:gap-16 lg:py-20">
        <div className="flex w-full flex-col justify-center gap-8 lg:flex-row lg:gap-20">
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
