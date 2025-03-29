import type {VariantProps} from "cva";
import type {LinkProps} from "next/link";
import type {ComponentProps} from "react";

import {Button, ButtonProps, buttonVariants, cn} from "@merchify/ui";
import {cva, cx} from "cva";

import LocalizedLink from "./localized-link";
import {Loader2} from "lucide-react";

export const styles = cva("", {
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
      xl: "text-xl px-8 h-12 tracking-[-1px] ",
    },
    variant: {
      default: "",
      ghost: "",
      outline: "",
      secondary: "",
    },
  },
});

export interface CtaButtonProps
  extends ButtonProps,
    VariantProps<typeof styles> {
  loading?: boolean;
}

export function Cta({
  children,
  className,
  disabled,
  loading,
  size,
  variant = "default",
  ...rest
}: CtaButtonProps) {
  const loadingIconName =
    variant === "default" ? "LoadingPrimary" : "LoadingAccent";
  return (
    <Button
      className={cn(
        buttonVariants({variant, size, className}),
        styles({className, loading, size, variant}),
      )}
      disabled={disabled}
      variant={variant}
      {...rest}
    >
      {loading ? <Loader2 className="animate-spin" /> : children}
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
