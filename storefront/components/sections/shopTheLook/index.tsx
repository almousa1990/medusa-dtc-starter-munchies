import Heading from "@/components/shared/typography/heading";
import {Suspense} from "react";

import type {ModularPageSection} from "../types";

import Hotspots from "./hotspots";
import HotspotsLoading from "./hotspots-loading";

export default async function ShopTheLook(
  props: ModularPageSection<"section.shopTheLook">,
) {
  return (
    <section
      {...props.rootHtmlAttributes}
      className="max-w-max-screen mx-auto flex w-full flex-col items-start gap-2 px-5 py-10 lg:px-8"
    >
      <Heading desktopSize="3xl" font="serif" mobileSize="xl" tag="h3">
        {props.title}
      </Heading>
      <Suspense fallback={<HotspotsLoading image={props.image} />}>
        <Hotspots
          countryCode={props.countryCode}
          image={props.image}
          productHotSpots={props.productHotSpots}
        />
      </Suspense>
    </section>
  );
}
