import {buttonVariants, cn} from "@merchify/ui";
import {ChevronDown} from "lucide-react";
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
    <div className="relative">
      <select
        className={cn(
          buttonVariants({variant: "outline"}),
          "w-full appearance-none font-normal",
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
      <ChevronDown className="absolute inset-y-0 left-3 my-auto h-4 w-4 opacity-50" />
    </div>
  );
});

NativeSelect.displayName = "NativeSelect";
