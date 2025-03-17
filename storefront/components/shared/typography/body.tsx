import type {VariantProps} from "cva";

import {cva} from "cva";

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
      sans: "font-sans font-medium leading-[150%]",
      serif: "font-serif font-normal leading-[150%]",
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
type BodyProps = {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLParagraphElement> &
  VariantProps<typeof bodyStyles>;

export default function Body({
  children,
  className,
  desktopSize,
  font,
  mobileSize,
  ...rest
}: BodyProps) {
  return (
    <div
      className={bodyStyles({className, desktopSize, font, mobileSize})}
      {...rest}
    >
      {children}
    </div>
  );
}
