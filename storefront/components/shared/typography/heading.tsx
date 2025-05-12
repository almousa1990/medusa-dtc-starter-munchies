import type {VariantProps} from "cva";

import {cn} from "@merchify/ui";
import {cva} from "cva";

export const headingStyles = cva("", {
  defaultVariants: {
    font: "serif",
  },
  variants: {
    tag: {
      h1: "font-bold",
      h2: "font-bold",
      h3: "font-semibold",
      h4: "font-semibold",
      h5: "font-medium",
      h6: "font-medium",
    },

    desktopSize: {
      "2xl": "lg:text-2xl",
      "3xl": "lg:text-3xl",
      "4xl": "lg:text-4xl",
      base: "lg:text-base",
      lg: "lg:text-lg",
      sm: "lg:text-sm",
      xl: "lg:text-xl",
      xs: "lg:text-xs",
    },
    font: {
      sans: "font-sans ",
      serif: "font-serif ",
    },
    mobileSize: {
      "2xl": "text-2xl text-pretty tracking-[-1.12px]",
      "3xl": "text-3xl text-pretty tracking-[-1.28px]",
      "4xl": "text-4xl text-pretty lg:tracking-[-1.6px]",
      base: "text-base tracking-[-0.64px]",
      lg: "text-lg tracking-[-0.8px]",
      sm: "text-sm tracking-[-0.52px]",
      xl: "text-xl tracking-[-0.96px]",
      xs: "text-xs tracking-[-0.48px]",
    },
  },
});

type HeadingProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
} & VariantProps<typeof headingStyles>;
export default function Heading({
  children,
  className,
  desktopSize,
  font,
  id,
  mobileSize,
  tag,
  ...props
}: HeadingProps) {
  const Tag = tag;
  return (
    <Tag
      className={cn(
        headingStyles({desktopSize, font, mobileSize, tag}),
        className,
      )}
      id={id}
      {...props}
    >
      {children}
    </Tag>
  );
}
