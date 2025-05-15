import {cn} from "@merchify/ui";
import {type ComponentProps} from "react";
import {preload} from "react-dom";

export const illustrations = {
  EmptyCart: "/illustrations/empty-cart.svg",
  OrderSuccess: "/illustrations/order-success.svg",
};

type Illustration = keyof typeof illustrations;

export const illustrationAlts: Record<Illustration, string> = {
  EmptyCart: "Empty cart",
  OrderSuccess: "Order success",
};

export type IllustrationProps = {
  fetchPriority?: "default" | "high";
  name: Illustration;
} & Omit<
  ComponentProps<"img">,
  "alt" | "fetchPriority" | "sizes" | "src" | "srcSet"
>;

export default function Illustration({
  className,
  fetchPriority = "default",
  name,
  ...rest
}: IllustrationProps) {
  if (fetchPriority === "high") {
    preload(illustrations[name], {
      as: "image",
      fetchPriority: "high",
    });
  }

  return (
    <img
      alt={illustrationAlts[name]}
      className={cn("size-48", className)}
      loading={fetchPriority === "high" ? "eager" : "lazy"}
      src={illustrations[name]}
      {...rest}
    />
  );
}
