import {buttonVariants, cn} from "@merchify/ui";
import {ChevronsUpDown} from "lucide-react";
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
    <div
      className={cn(
        "relative inline-flex w-full items-center rounded-md border px-4 py-2",
        className,
      )}
    >
      <select
        className={cn(
          "w-full appearance-none bg-transparent pl-6 text-sm focus:outline-none",
        )}
        ref={ref}
        {...props}
      >
        {placeholder && (
          <option disabled value="">
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option disabled={opt.disabled} key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronsUpDown className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
    </div>
  );
});

NativeSelect.displayName = "NativeSelect";
