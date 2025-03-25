import {Cta} from "@/components/shared/button";
import Icon from "@/components/shared/icon";
import {SanityImage} from "@/components/shared/sanity-image";

import type {ModularPageSection} from "../types";

export default function HotspotsLoading({
  image,
}: Pick<ModularPageSection<"section.shopTheLook">, "image">) {
  return (
    <div className="flex w-full flex-col items-stretch justify-start gap-2 lg:flex-row lg:gap-4">
      {image ? (
        <div className="relative w-full min-w-[63%] rounded-lg">
          <SanityImage className="w-full rounded-lg" data={image} />
        </div>
      ) : (
        <div className="bg-secondary w-full min-w-[63%] rounded-lg" />
      )}
      <div className="hidden w-full max-w-[450px] flex-col justify-between gap-10 rounded-lg lg:flex">
        <div className="flex w-full max-w-[450px] flex-1 flex-col items-center justify-center rounded-lg">
          <div className="border-accent relative aspect-square w-full rounded-lg border">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Icon
                className="animate-spin-loading size-10"
                name="LoadingAccent"
              />
            </div>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-1 px-6 py-4">
            <div className="bg-accent h-[30px] w-3/4 rounded-sm opacity-10" />
            <div className="bg-accent h-6 w-1/2 rounded-sm opacity-10" />
          </div>
        </div>
        <Cta className="w-full" loading={true} size="xl" variant="outline">
          Shop now
        </Cta>
      </div>

      <div className="flex flex-col gap-2 lg:hidden">
        <div className="flex w-full gap-[10px] rounded-2xl p-2">
          <div className="border-accent relative aspect-square w-full max-w-[100px] rounded-lg border">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Icon
                className="animate-spin-loading size-6"
                name="LoadingAccent"
              />
            </div>
          </div>
          <div className="flex w-full flex-col items-start justify-start gap-1 py-2">
            <div className="bg-accent h-[27px] w-3/4 rounded-sm opacity-10" />
            <div className="bg-accent h-5 w-1/2 rounded-sm opacity-10" />
          </div>
        </div>
        <Cta className="w-full" loading={true} size="xl" variant="outline">
          Shop now
        </Cta>
      </div>
    </div>
  );
}
