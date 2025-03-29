"use client";

import type {StoreProduct, StoreProductVariant} from "@medusajs/types";
import type {PropsWithChildren} from "react";

import React, {createContext, useContext, useState} from "react";

interface ProductVariantsContextType {
  product: StoreProduct | undefined;
  activeVariant: StoreProductVariant | undefined;
  selectedOptions: Record<string, string | undefined>;
  setSelectedOptions: React.Dispatch<
    React.SetStateAction<Record<string, string | undefined>>
  >;
  updateOption: (optionId: string, value: string) => void; // NEW
}

const ProductVariantsContext = createContext<
  ProductVariantsContextType | undefined
>(undefined);

export function ProductVariantsProvider({
  children,
  product,
}: PropsWithChildren<{
  product: StoreProduct;
}>) {
  const [selectedOptions, setSelectedOptions] = useState(
    Object.fromEntries(
      product.options?.map((option) => [
        option.id,
        option.values?.[0]?.value,
      ]) ?? [],
    ),
  );

  const activeVariant =
    product.variants?.find((variant) => {
      return variant?.options?.every(
        ({option, value}) => selectedOptions[option?.id || ""] === value,
      );
    }) || product.variants?.[0];

  const activeVariantWithProduct = !activeVariant
    ? activeVariant
    : {...activeVariant, product};

  const updateOption = (optionId: string, value: string) => {
    if (!product) return;
    const updated = getUpdatedOptionsForValidVariant(
      product,
      selectedOptions,
      optionId,
      value,
    );
    setSelectedOptions(updated);
  };

  return (
    <ProductVariantsContext.Provider
      value={{
        product,
        activeVariant: activeVariantWithProduct,
        selectedOptions,
        setSelectedOptions,
        updateOption, // include it
      }}
    >
      {children}
    </ProductVariantsContext.Provider>
  );
}

export function useProductVariants() {
  const context = useContext(ProductVariantsContext);
  if (context === undefined) {
    throw new Error(
      "useProductVariants must be used within a ProductVariantsProvider",
    );
  }
  return context;
}

function getUpdatedOptionsForValidVariant(
  product: StoreProduct,
  selected: Record<string, string | undefined>,
  updatedKey: string,
  updatedValue: string,
): Record<string, string | undefined> {
  const newOptions = {
    ...selected,
    [updatedKey]: updatedValue,
  };

  // Check if the updated combination is already valid
  const isValid = product.variants?.some((variant) =>
    variant.options?.every((opt) => newOptions[opt.option_id] === opt.value),
  );

  if (isValid) {
    // Just return the updated selection
    return newOptions;
  }

  // Otherwise, find the first variant that includes the updated option value
  const fallbackVariant = product.variants?.find((variant) =>
    variant.options?.some(
      (opt) => opt.option_id === updatedKey && opt.value === updatedValue,
    ),
  );

  if (!fallbackVariant) {
    return newOptions; // No valid variant, keep as-is
  }

  // Update selected options to match the fallback variant
  const correctedOptions = {...selected};
  for (const opt of fallbackVariant.options || []) {
    correctedOptions[opt.option_id] = opt.value;
  }

  return correctedOptions;
}
