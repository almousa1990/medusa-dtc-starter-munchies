"use client";

import type {
  DialogCloseProps,
  DialogContentProps,
  DialogProps,
  DialogTriggerProps,
} from "@radix-ui/react-dialog";

import {
  Close,
  Content,
  Overlay,
  Portal,
  Root,
  Trigger,
} from "@radix-ui/react-dialog";

import {useCart} from "../context/cart-context";

export function Dialog(props: Omit<DialogProps, "onOpenChange" | "open">) {
  const {cartOpen, setCartOpen} = useCart();
  return (
    <Root onOpenChange={(v) => setCartOpen(v)} open={cartOpen} {...props} />
  );
}

export function OpenDialog(props: DialogTriggerProps) {
  return <Trigger {...props} />;
}

export function CloseDialog(props: DialogCloseProps) {
  return <Close {...props} />;
}

export function SideDialog({style, ...passThrough}: DialogContentProps) {
  return (
    <Portal>
      <Overlay className="fixed inset-0 bg-transparent" />
      <Content
        className="bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left fixed inset-y-0 left-0 z-[100] h-screen w-full max-w-[430px] shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500"
        style={{...style}}
        {...passThrough}
      />
    </Portal>
  );
}
