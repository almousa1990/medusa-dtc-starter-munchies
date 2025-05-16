import {cn} from "@merchify/ui";
import {type ComponentProps} from "react";
import {preload} from "react-dom";

export const icons = {
  AccordionBottom: "/icons/accordion-bottom.svg",
  AccordionLeft: "/icons/accordion-left.svg",
  AccordionRight: "/icons/accordion-right.svg",
  AccordionTop: "/icons/accordion-top.svg",
  Account: "/icons/account.svg",
  Amex: "/icons/amex.svg",
  ApplePay: "/icons/apple-pay.svg",
  ArrowLeft: "/icons/arrow-left-primary.svg",
  ArrowLeftAccent: "/icons/arrow-left-accent.svg",
  ArrowRight: "/icons/arrow-right-primary.svg",
  ArrowRightAccent: "/icons/arrow-right-accent.svg",
  Cart: "/icons/cart.svg",
  Check: "/icons/check.svg",
  Checkbox: "/icons/checkbox.svg",
  Close: "/icons/close.svg",
  Ellips: "/icons/ellips-accent.svg",
  Hamburger: "/icons/hamburger.svg",
  Instagram: "/social/instagram.svg",
  LoadingAccent: "/icons/loading-accent.svg",
  LoadingPrimary: "/icons/loading-primary.svg",
  Mada: "/icons/mada.svg",
  Mastercard: "/icons/mastercard.svg",
  Search: "/icons/search.svg",
  Snapchat: "/social/snapchat.svg",
  TikTok: "/social/tiktok.svg",
  Trash: "/icons/trash.svg",
  Visa: "/icons/visa.svg",
  Whatsapp: "/social/whatsapp.svg",
  X: "/social/x.svg",
};

type Icon = keyof typeof icons;

export const iconAlts: Record<Icon, string> = {
  AccordionBottom: "Accordion Bottom",
  AccordionLeft: "Accordion Left",
  AccordionRight: "Accordion Right",
  AccordionTop: "Accordion Top",
  Account: "Account",
  Amex: "Amex",
  ApplePay: "Apple Pay",
  ArrowLeft: "Arrow Left",
  ArrowLeftAccent: "Arrow Left Accent",
  ArrowRight: "Arrow Right",
  ArrowRightAccent: "Arrow Right Accent",
  Cart: "Shopping Cart",
  Check: "Check mark",
  Checkbox: "Checkbox icon",
  Close: "Close",
  Ellips: "Ellipse",
  Hamburger: "Menu",
  Instagram: "Instagram",
  LoadingAccent: "Loading",
  LoadingPrimary: "Loading",
  Mada: "Mada",
  Mastercard: "Mastercard",
  Search: "Search icon",
  Snapchat: "Snapchat",
  TikTok: "TikTok",
  Trash: "Trash icon",
  Visa: "Visa",
  Whatsapp: "Whatsapp",
  X: "X",
};

export type IconProps = {fetchPriority?: "default" | "high"; name: Icon} & Omit<
  ComponentProps<"img">,
  "alt" | "fetchPriority" | "sizes" | "src" | "srcSet"
>;

export default function Icon({
  className,
  fetchPriority = "default",
  name,
  ...rest
}: IconProps) {
  if (fetchPriority === "high") {
    preload(icons[name], {
      as: "image",
      fetchPriority: "high",
    });
  }

  return (
    <img
      alt={iconAlts[name]}
      className={cn(className)}
      loading={fetchPriority === "high" ? "eager" : "lazy"}
      src={icons[name]}
      {...rest}
    />
  );
}
