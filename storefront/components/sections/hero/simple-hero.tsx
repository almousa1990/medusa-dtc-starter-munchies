import {Link} from "@/components/shared/button";
import {SanityImage} from "@/components/shared/sanity-image";
import Body from "@/components/shared/typography/body";
import Heading from "@/components/shared/typography/heading";
import {stegaClean} from "next-sanity";

import type {ModularPageSection} from "../types";

export default function SimpleHero(props: ModularPageSection<"section.hero">) {
  const image = stegaClean(props.image);
  return (
    <div className="flex flex-col items-stretch justify-center gap-2 lg:flex-row-reverse">
      <div className="bg-secondary flex min-h-[470px] w-full flex-col items-center justify-center gap-4 rounded-lg px-5 py-12 text-center lg:w-1/2 lg:py-5">
        <Heading
          className="leading-[100%]!"
          desktopSize="5xl"
          font="serif"
          mobileSize="3xl"
          tag="h1"
        >
          {props.title}
        </Heading>
        <Body
          className="max-w-[580px] text-center text-balance"
          desktopSize="xl"
          font="sans"
          mobileSize="lg"
        >
          {props.subtitle}
        </Body>
        {props.cta?.link && (
          <Link
            className="mt-6"
            href={props.cta.link}
            prefetch
            size="md"
            variant="default"
          >
            {props.cta.label}
          </Link>
        )}
      </div>
      {image ? (
        <div className="aspect-square rounded-lg lg:w-1/2">
          <SanityImage
            alt="arrow-right"
            className="aspect-square object-cover object-center"
            data={image}
            fetchPriority="high"
          />
        </div>
      ) : (
        <div className="bg-accent aspect-square rounded-lg lg:w-1/2" />
      )}
    </div>
  );
}
