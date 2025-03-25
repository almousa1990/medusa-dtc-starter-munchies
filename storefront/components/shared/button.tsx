import type {VariantProps} from "cva";
import type {LinkProps} from "next/link";
import type {ComponentProps} from "react";

import {Button, buttonVariants, cn} from "@merchify/ui";
import {cva, cx} from "cva";

import Icon from "./icon";
import LocalizedLink from "./localized-link";

export const styles = cva(
  cx(
    "flex font-serif relative items-center whitespace-nowrap leading-[150%] justify-center  transition-all duration-300 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-accent focus-visible:ring-offset-background w-fit",
    "disabled:opacity-50 disabled:cursor-not-allowed ",
  ),
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      loading: {
        true: "pointer-events-none",
      },
      size: {
        default: "text-md px-4 h-10",
        lg: "text-lg px-6 h-11 tracking-[-1px]",
        sm: "text-sm px-2 h-9",
        xl: "text-xl px-8 h-12 tracking-[-1px]",
      },
      variant: {
        default: "",
        ghost: "",
        outline: "",
        secondary: "",
      },
    },
  },
);

export type ButtonProps = {
  loading?: boolean;
} & ComponentProps<"button"> &
  VariantProps<typeof styles>;

export function Cta({
  children,
  className,
  disabled,
  loading,
  size,
  variant = "default",
  ...rest
}: ButtonProps) {
  const loadingIconName =
    variant === "default" ? "LoadingPrimary" : "LoadingAccent";
  return (
    <Button
      className={styles({className, loading, size, variant})}
      disabled={disabled}
      variant={variant}
      {...rest}
    >
      <span className={cx(loading && "opacity-0")}>{children}</span>
      {loading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Icon
            className={cx("animate-spin-loading", {
              "size-5": size === "sm",
              "size-8": size === "default",
              "size-10": size === "lg" || size === "xl",
            })}
            name={loadingIconName}
          />
        </div>
      )}
    </Button>
  );
}
type StyleProps = VariantProps<typeof styles>;

export function Link({
  children,
  className,
  href,
  prefetch = true,
  ref,
  renderAsChild,
  size,
  variant = "default",
  ...rest
}: {
  prefetch?: LinkProps["prefetch"];
} & {
  renderAsChild?: boolean;
} & ComponentProps<"a"> &
  StyleProps) {
  if (renderAsChild) {
    return (
      <div
        className={styles({
          className,
          size,
          variant,
        })}
      >
        {children}
      </div>
    );
  }
  return (
    <LocalizedLink
      className={cn(
        buttonVariants({size, variant}),
        styles({
          className,
          size,
          variant,
        }),
      )}
      href={href ?? "/"}
      prefetch={prefetch}
      ref={ref}
      {...rest}
    >
      {children}
    </LocalizedLink>
  );
}
