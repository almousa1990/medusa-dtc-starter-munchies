import type {Footer} from "@/types/sanity.generated";

import {RichText} from "@/components/shared/rich-text";
import {SanityImage} from "@/components/shared/sanity-image";

import BottomLinks from "./parts/bottom-links";
import TopLinks from "./parts/top-links";

interface FooterProps extends NonNullable<Footer> {
  variant?: "default" | "simple";
}

export default function Footer({variant = "default", ...props}: FooterProps) {
  if (variant === "simple") {
    return (
      <footer className="bg-primary w-full" id="footer">
        <div className="max-w-max-screen text-background mx-auto flex w-full flex-col gap-8 px-5 py-8 lg:px-8">
          {props.image && (
            <SanityImage className="lg:mt-10" data={props.image} />
          )}
          <div className="flex w-full justify-between lg:justify-start lg:gap-16">
            {props.information?.map((column) => {
              if (!column.text) return null;
              return (
                <div
                  className="flex w-[170px] flex-col gap-8"
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
      <footer className="bg-primary w-full" id="footer">
        <div className="max-w-max-screen text-background mx-auto flex w-full flex-col gap-10 px-5 pt-16 pb-5 lg:px-8 lg:pb-8">
          <TopLinks {...props} />
          {props.image && (
            <SanityImage className="lg:mt-10" data={props.image} />
          )}
          <BottomLinks {...props} />
        </div>
      </footer>
    </>
  );
}
