"use client";

import {HttpTypes} from "@medusajs/types";
import React, {useEffect, useMemo, useCallback} from "react";
import * as RadioGroup from "@radix-ui/react-radio-group";
import {cn} from "@merchify/ui";
import {MerchifyProductOption} from "@/types";

type OptionSelectProps = {
  option: MerchifyProductOption;
  current: string | undefined;
  updateOption: (value: string) => void;
  product?: HttpTypes.StoreProduct | null;
  disabled: boolean;
  selectedOptions?: Record<string, string | undefined>;
  "data-testid"?: string;
};

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  product,
  selectedOptions,
  "data-testid": dataTestId,
  disabled,
}) => {
  const validValues = useMemo(() => {
    const validSet = new Set<string>();
    if (product?.variants) {
      for (const variant of product.variants) {
        const isValid =
          selectedOptions &&
          Object.entries(selectedOptions).every(([key, value]) => {
            if (key === option.id) return true;
            return variant.options?.some(
              (o) => o.option_id === key && o.value === value,
            );
          });

        if (isValid) {
          variant.options
            ?.filter((o) => o.option_id === option.id)
            .forEach((o) => validSet.add(o.value));
        }
      }
    }
    return validSet;
  }, [product, selectedOptions, option.id]);

  // Auto-correct if current value becomes invalid
  useEffect(() => {
    if (!current || validValues.has(current)) return;

    const fallback = Array.from(validValues)[0];
    if (fallback && fallback !== current) {
      updateOption(fallback);
    }
  }, [validValues, current, updateOption]);

  const isColorOption = option.metadata?.type == "color";

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-primary text-sm font-medium">{option.title}</h3>
      </div>

      <fieldset aria-label={`تحديد ${option.title}`} className="mt-2">
        <RadioGroup.Root
          dir="rtl"
          value={current}
          onValueChange={updateOption}
          className={cn(
            isColorOption
              ? "mr-1 flex items-center gap-x-3"
              : "grid grid-cols-3 gap-3 sm:grid-cols-6",
          )}
        >
          {(option.values ?? []).map((v, index) => {
            const isValid = validValues.has(v.value);
            const hasFallback = validValues.size > 0;
            const shouldDisable = !isValid && !hasFallback;

            return (
              <RadioGroup.Item
                key={index}
                value={v.value}
                disabled={shouldDisable}
                style={
                  isColorOption
                    ? ({
                        "--tw-ring-color": v.metadata?.color.hex,
                      } as React.CSSProperties)
                    : {}
                }
                className={cn(
                  "flex cursor-pointer",
                  !isValid && "opacity-50",
                  isColorOption
                    ? "relative -m-0.5 rounded-full p-0.5 focus:outline-none data-[state=checked]:ring-2 data-[focus]:data-[state=checked]:ring data-[focus]:data-[state=checked]:ring-offset-1"
                    : "border-input bg-background hover:bg-accent data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[focus]:bg-primary/90 data-[state=checked]:hover:bg-primary items-center justify-center rounded-md border px-3 py-3 text-sm font-medium uppercase disabled:opacity-50 data-[focus]:ring-2 data-[focus]:ring-offset-2 data-[state=checked]:border-transparent sm:flex-1",
                )}
              >
                {isColorOption ? (
                  <span
                    aria-hidden="true"
                    style={{backgroundColor: v.metadata?.color?.hex}}
                    className="size-8 rounded-full border border-black/10"
                  />
                ) : (
                  <span>{v.value}</span>
                )}
              </RadioGroup.Item>
            );
          })}
        </RadioGroup.Root>
      </fieldset>
    </div>
  );
};

export default OptionSelect;
