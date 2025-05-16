import {cn} from "@merchify/ui";

import type {SanityImageProps} from "../shared/sanity-image";

import {SanityImage} from "../shared/sanity-image";

export default function ImageBlock(props: SanityImageProps) {
  return (
    <div className="mt-10 flex flex-col">
      <div className={cn("overflow-hidden rounded-lg")}>
        <SanityImage data={props.data} />
      </div>
    </div>
  );
}
