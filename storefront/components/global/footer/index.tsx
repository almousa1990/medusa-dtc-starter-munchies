import type {Footer} from "@/types/sanity.generated";

import {RichText} from "@/components/shared/rich-text";
import {SanityImage} from "@/components/shared/sanity-image";

import BottomLinks from "./parts/bottom-links";
import Newsletter from "./parts/newsletter";
import TopLinks from "./parts/top-links";

interface FooterProps extends NonNullable<Footer> {
  variant?: "default" | "simple";
}

export default function Footer({variant = "default", ...props}: FooterProps) {
  if (variant === "simple") {
    return (
      <footer className="bg-accent w-full" id="footer">
        <div className="max-w-max-screen gap-xl px-md py-xl text-background lg:px-xl mx-auto flex w-full flex-col">
          {props.image && (
            <SanityImage className="lg:mt-2xl" data={props.image} />
          )}
          <div className="lg:gap-6xl flex w-full justify-between lg:justify-start">
            {props.information?.map((column) => {
              if (!column.text) return null;
              return (
                <div
                  className="gap-xl flex w-[170px] flex-col"
                  key={column._key}
                >
                  <RichText value={column.text} />
                </div>
              );
            })}
          </div>
        </div>
      </footer>
    );
  }

  return (
    <>
      <Newsletter {...props} />
      <footer className="bg-accent w-full" id="footer">
        <div className="max-w-max-screen gap-2xl px-md pb-md pt-6xl text-background lg:px-xl lg:pb-xl mx-auto flex w-full flex-col">
          <TopLinks {...props} />
          {props.image && (
            <SanityImage className="lg:mt-2xl" data={props.image} />
          )}
          <BottomLinks {...props} />
        </div>
      </footer>
    </>
  );
}
