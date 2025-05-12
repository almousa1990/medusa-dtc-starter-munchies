"use client";

import {cx} from "cva";

import Heading from "./typography/heading";
import {Link} from "./button";
import {ReactNode} from "react";

type Props = {
  cta?: {
    href: string | undefined;
    text: string | undefined;
  };
  children: ReactNode;
  subtitle?: string;
  title: string;
};

export default function CarouselSection(props: Props) {
  const {cta, children, title, subtitle} = props;

  if (!children) return null;

  return (
    <div className="mx-auto">
      <div className={cx("mb-6 grid gap-1")}>
        <div className="flex flex-1 justify-between">
          <Heading desktopSize="2xl" mobileSize="xl" tag="h3">
            {title}
          </Heading>
          {cta?.text && (
            <Link
              className="h-fit p-0 underline"
              href={cta.href}
              variant="ghost"
            >
              {cta.text}
            </Link>
          )}
        </div>

        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="relative -mb-6 w-full overflow-x-auto pb-6">
        <div className="mx-4 inline-flex space-x-8 sm:mx-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-x-8 lg:space-x-0">
          {children}
        </div>
      </div>
    </div>
  );
}
