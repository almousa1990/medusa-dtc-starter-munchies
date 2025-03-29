"use client";

import type {StoreProductOption} from "@medusajs/types";

import {useProductVariants} from "../../../../../../components/context/product-context";
import OptionSelect from "./option-select";

type Props = {
  options: StoreProductOption[];
};

export default function OptionsSelect({options}: Props) {
  const {selectedOptions, product, updateOption} = useProductVariants();

  return options?.map((option) => {
    const values = option.values?.map(({value}) => ({
      label: value,
      value: value.toLowerCase(),
    }));

    if (!values || values.length <= 1) return null;
    const activeOption = selectedOptions[option.id];

    return (
      <OptionSelect
        key={option.id}
        option={option}
        product={product}
        selectedOptions={selectedOptions}
        current={activeOption}
        updateOption={(v) => updateOption(option.id, v)}
        disabled={false}
        data-testid="product-options"
      />
    );
  });
}
