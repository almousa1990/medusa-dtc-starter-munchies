import {cn} from "@merchify/ui";
import * as React from "react";

export interface NativeSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: {disabled?: boolean; label: string; value: string}[];
  placeholder?: string;
}

export const NativeSelect = React.forwardRef<
  HTMLSelectElement,
  NativeSelectProps
>(({className, options, placeholder, ...props}, ref) => {
  return (
    <select
      className={cn(
        "border-input bg-background ring-offset-background flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-base md:text-sm",
        "focus:ring-ring focus:ring-2 focus:ring-offset-2 focus:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        (props.value === "" || props.defaultValue === "") &&
          "text-muted-foreground",
        className,
      )}
      ref={ref}
      {...props}
    >
      {placeholder && (
        <option disabled hidden value="">
          {placeholder}
        </option>
      )}
      {options.map((opt) => (
        <option disabled={opt.disabled} key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
});

NativeSelect.displayName = "NativeSelect";
