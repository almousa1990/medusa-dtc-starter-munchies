"use client";

import {useRef} from "react";
import {
  cn,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  useFormContext,
} from "@merchify/ui";
import {NativeSelect} from "./native-select";

interface CreditCardFormProps {
  className?: string;
}

export function CreditCardForm({className}: CreditCardFormProps) {
  const cvcRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLSelectElement>(null);
  const monthRef = useRef<HTMLSelectElement>(null);

  const currentYear = new Date().getFullYear();
  const {control} = useFormContext();

  return (
    <div className={cn("grid gap-4", className)}>
      {/* Card Number */}
      <FormField
        control={control}
        name="card.number"
        render={({field}) => (
          <FormItem>
            <FormLabel>رقم البطاقة</FormLabel>
            <FormControl>
              <Input
                placeholder="رقم البطاقة"
                inputMode="numeric"
                dir="ltr"
                maxLength={19}
                {...field}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  value = value.slice(0, 16);
                  const parts = value.match(/.{1,4}/g) || [];
                  field.onChange(parts.join(" "));
                  if (parts.join("").length === 16 && monthRef.current) {
                    monthRef.current.focus();
                  }
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Expiry and CVC */}
      <div className="grid grid-cols-2 gap-4">
        {/* Month */}
        <FormField
          control={control}
          name="card.month"
          render={({field}) => (
            <FormItem>
              <FormLabel>الشهر</FormLabel>
              <FormControl>
                <NativeSelect
                  placeholder="الشهر"
                  options={Array.from({length: 12}, (_, i) => {
                    const month = i + 1;
                    const formatted = month.toString().padStart(2, "0"); // always 2 digits
                    return {
                      value: formatted,
                      label: formatted,
                    };
                  })}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    if (yearRef.current) {
                      yearRef.current.focus();
                    }
                  }}
                  ref={monthRef}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Year */}
        <FormField
          control={control}
          name="card.year"
          render={({field}) => (
            <FormItem>
              <FormLabel>السنة</FormLabel>
              <FormControl>
                <NativeSelect
                  placeholder="السنة"
                  options={Array.from({length: 10}, (_, i) => {
                    const year = currentYear + i;
                    return {
                      value: String(year).slice(2), // full year for backend (e.g., 2025)
                      label: String(year).slice(2), // only last two digits for display (e.g., "25")
                    };
                  })}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    if (cvcRef.current) {
                      cvcRef.current.focus();
                    }
                  }}
                  ref={yearRef}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* CVC */}
      <FormField
        control={control}
        name="card.cvc"
        render={({field}) => (
          <FormItem>
            <FormLabel>رمز التحقق (CVC)</FormLabel>
            <FormControl>
              <Input
                placeholder="CVC"
                inputMode="numeric"
                dir="ltr"
                maxLength={4}
                {...field}
                ref={cvcRef}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  value = value.slice(0, 4);
                  field.onChange(value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
