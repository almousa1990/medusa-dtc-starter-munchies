import {Input, cn} from "@merchify/ui";
import * as React from "react";

interface PhoneInputProps extends React.ComponentPropsWithoutRef<typeof Input> {
  countryCode?: string; // Default country code
}

const PhoneInput = React.forwardRef<
  React.ComponentRef<typeof Input>,
  PhoneInputProps
>(({className, countryCode = "+966", ...props}, ref) => {
  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    let numericValue = input.value.replace(/\D/g, ""); // Remove non-numeric characters

    // Prevent the number from starting with 0
    if (numericValue.startsWith("0")) {
      numericValue = numericValue.slice(1);
    }

    // Limit to 9 digits max
    numericValue = numericValue.slice(0, 9);

    input.value = numericValue; // Update input value directly
  };
  return (
    <div className="relative w-full">
      {/* Country Code Prefix (Looks inside the input) */}
      <span className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-500">
        {countryCode}
      </span>

      {/* Input Field (With left padding to avoid overlap) */}
      <Input
        className={cn("pl-16", className)} // Ensures space for the prefix
        inputMode="numeric"
        onInput={handleInput} // Use onInput for real-time filtering
        pattern="[1-9][0-9]{0,8}" // Allow only numbers, 1-9 followed by up to 8 more digits
        ref={ref}
        type="tel"
        {...props}
      />
    </div>
  );
});

PhoneInput.displayName = "PhoneInput";

export {PhoneInput};
