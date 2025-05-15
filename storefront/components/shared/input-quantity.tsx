import {cn} from "@merchify/ui";
import React from "react";

import Body from "./typography/body";

interface InputQuantityProps {
  disabled?: boolean;
  onChange: (newQuantity: number) => void;
  quantity: number;
}

export const InputQuantity: React.FC<InputQuantityProps> = ({
  disabled = false,
  onChange,
  quantity,
}) => {
  return (
    <div className="border-input flex h-10 w-24 items-center justify-center gap-1 overflow-hidden rounded-md border">
      <button
        className="group hover:bg-accent active:bg-accent flex h-full w-full flex-1 items-center justify-center disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled}
        onClick={() => onChange(quantity - 1)}
      >
        <span className="bg-primary h-px w-2 transition-all duration-300" />
      </button>
      <Body
        className={cn("flex-1 text-center", {
          "text-muted-foreground": disabled,
        })}
        font="sans"
        mobileSize="base"
      >
        {quantity}
      </Body>
      <button
        className="group hover:bg-accent active:bg-accent relative flex h-full w-full flex-1 items-center justify-center disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled}
        onClick={() => onChange(quantity + 1)}
      >
        <span className="bg-primary h-px w-2 transition-all duration-300" />
        <span className="bg-primary absolute top-1/2 left-1/2 h-2 w-px -translate-x-1/2 -translate-y-1/2 transition-all duration-300" />
      </button>
    </div>
  );
};
