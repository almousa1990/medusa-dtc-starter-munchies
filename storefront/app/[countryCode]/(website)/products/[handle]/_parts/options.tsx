"use client";

import type {MerchifyProductOption} from "@/types";

import {useProductVariants} from "../../../../../../components/context/product-context";
import OptionSelect from "./option-select";

type Props = {
  options: MerchifyProductOption[];
};

export default function OptionsSelect({options}: Props) {
  const {product, selectedOptions, updateOption} = useProductVariants();

  return options?.map((option) => {
    const values = option.values?.map(({value}) => ({
      label: value,
      value: value.toLowerCase(),
    }));

    if (!values || values.length <= 1) return null;
    const activeOption = selectedOptions[option.id];

    return (
      <OptionSelect
        current={activeOption}
        data-testid="product-options"
        disabled={false}
        key={option.id}
        option={option}
        product={product}
        selectedOptions={selectedOptions}
        updateOption={(v) => updateOption(option.id, v)}
      />
    );
  });
}
