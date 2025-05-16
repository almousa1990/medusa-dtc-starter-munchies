import {Input, cn} from "@merchify/ui";
import * as React from "react";

interface InputPhoneProps extends React.ComponentPropsWithoutRef<typeof Input> {
  countryCode?: string;
}

const InputPhone = React.forwardRef<
  React.ComponentRef<typeof Input>,
  InputPhoneProps
>(({className, countryCode = "+966", onBlur, onChange, ...props}, ref) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.currentTarget.value.replace(/\D/g, ""); // Remove non-digits

    const maxLength = rawValue.startsWith("0") ? 10 : 9;
    const trimmedValue = rawValue.slice(0, maxLength);

    const syntheticEvent = {
      ...e,
      currentTarget: {
        ...e.currentTarget,
        value: trimmedValue,
      },
      target: {
        ...e.target,
        value: trimmedValue,
      },
    };

    onChange?.(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    let value = e.currentTarget.value;

    // Remove leading zero on blur if present
    if (value.startsWith("0")) {
      value = value.slice(1);
      e.currentTarget.value = value;

      const syntheticEvent = {
        ...e,
        currentTarget: {
          ...e.currentTarget,
          value,
        },
        target: {
          ...e.target,
          value,
        },
      };
      onChange?.(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
    }

    onBlur?.(e);
  };

  return (
    <div className="relative w-full">
      <span
        className="absolute top-1/2 left-3 -translate-y-1/2 transform cursor-not-allowed text-base opacity-50 md:text-sm"
        dir="ltr"
      >
        {countryCode}
      </span>

      <Input
        className={cn("pl-14 sm:pl-12", className)}
        inputMode="numeric"
        onBlur={handleBlur}
        onChange={handleChange}
        pattern="\d{1,10}"
        ref={ref}
        type="tel"
        {...props}
      />
    </div>
  );
});

InputPhone.displayName = "PhoneInput";

export {InputPhone};
