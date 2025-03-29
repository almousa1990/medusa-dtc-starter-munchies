import React from "react";
import Body from "./typography/body";

interface InputQuantityProps {
  quantity: number;
  disabled?: boolean;
  onChange: (newQuantity: number) => void;
}

export const InputQuantity: React.FC<InputQuantityProps> = ({
  quantity,
  disabled = false,
  onChange,
}) => {
  return (
    <div className="border-input flex h-10 w-32 items-center justify-center gap-1 overflow-hidden rounded-md border">
      <button
        className="group hover:bg-secondary active:bg-accent flex h-full w-full flex-1 items-center justify-center disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled}
        onClick={() => onChange(quantity - 1)}
      >
        <span className="bg-primary h-px w-2 transition-all duration-300" />
      </button>
      <Body className="flex-1 text-center" font="sans" mobileSize="base">
        {quantity}
      </Body>
      <button
        className="group hover:bg-secondary active:bg-accent relative flex h-full w-full flex-1 items-center justify-center disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled}
        onClick={() => onChange(quantity + 1)}
      >
        <span className="bg-primary h-px w-2 transition-all duration-300" />
        <span className="bg-primary absolute top-1/2 left-1/2 h-2 w-px -translate-x-1/2 -translate-y-1/2 transition-all duration-300" />
      </button>
    </div>
  );
};
