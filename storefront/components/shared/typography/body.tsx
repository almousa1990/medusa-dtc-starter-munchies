import type {VariantProps} from "cva";

import {cva} from "cva";
import {ElementType} from "react";

export const bodyStyles = cva("", {
  defaultVariants: {
    font: "sans",
    mobileSize: "base",
  },
  variants: {
    desktopSize: {
      "2xl": "lg:text-2xl",
      "2xs": "lg:text-2xs",
      "4xl": "lg:text-4xl",
      base: "lg:text-base ",
      lg: "lg:text-lg",
      sm: "lg:text-sm",
      xl: "lg:text-xl",
      xs: "lg:text-xs",
    },
    font: {
      sans: "font-sans leading-[150%]",
      serif: "font-serif leading-[150%]",
    },
    mobileSize: {
      "2xl": "text-2xl",
      "2xs": "text-2xs",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
      base: "text-base ",
      lg: "text-lg",
      sm: "text-sm",
      xl: "text-xl",
      xs: "text-xs",
    },
  },
});
type BodyProps<T extends ElementType = "div"> = {
  as?: T;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof bodyStyles>;

export default function Body<T extends ElementType = "div">({
  as,
  children,
  className,
  desktopSize,
  font,
  mobileSize,
  ...rest
}: BodyProps<T>) {
  const Component = as || "div";

  return (
    <Component
      className={bodyStyles({className, desktopSize, font, mobileSize})}
      {...rest}
    >
      {children}
    </Component>
  );
}
