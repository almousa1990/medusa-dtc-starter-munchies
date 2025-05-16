import type {
  StoreCreateCustomerAddress,
  StoreCustomerAddress,
  StoreRegionCountry,
} from "@medusajs/types";

import AddressForm from "@/components/shared/address-form";
import {CHECKOUT_ADD_ADDRESS_ID} from "@/utils/constants";
import {
  AccordionContent,
  AccordionItem,
  Label,
  RadioGroupItem,
  cn,
} from "@merchify/ui";

export default function AddAddressItem({
  countries,
  defaultAddress,
  onSelect,
  onSubmit,
  selected,
}: {
  countries?: StoreRegionCountry[];
  defaultAddress?: Partial<StoreCustomerAddress>;
  onSelect: (id: string) => void;
  onSubmit: (address: StoreCreateCustomerAddress) => Promise<any>;
  selected: boolean;
}) {
  return (
    <AccordionItem
      className={cn(
        "-mt-px overflow-hidden border first:rounded-t-md last:rounded-b-md",
        {
          "bg-muted border-primary relative z-10": selected,
        },
      )}
      onClick={(e) => {
        const target = e.target as HTMLElement;

        // Prevent triggering if clicking inside the radio or label
        if (
          target.closest("label") || // this might include the Label or any nested child like <Body>
          target.closest("input[type='radio']")
        ) {
          return;
        }

        onSelect(CHECKOUT_ADD_ADDRESS_ID);
      }}
      value={CHECKOUT_ADD_ADDRESS_ID}
    >
      <div className="flex w-full items-center gap-3 p-4">
        <RadioGroupItem
          id={CHECKOUT_ADD_ADDRESS_ID}
          value={CHECKOUT_ADD_ADDRESS_ID}
        />
        <Label htmlFor={CHECKOUT_ADD_ADDRESS_ID}>إضافة عنوان جديد</Label>
      </div>
      <AccordionContent className="bg-background border-primary border-t p-4">
        <AddressForm
          address={defaultAddress}
          countries={countries}
          onSubmit={(data) => onSubmit(data as StoreCreateCustomerAddress)}
        />
      </AccordionContent>
    </AccordionItem>
  );
}
