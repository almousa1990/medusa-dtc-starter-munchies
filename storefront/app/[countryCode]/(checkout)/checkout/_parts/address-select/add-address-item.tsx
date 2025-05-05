import type {
  StoreCreateCustomerAddress,
  StoreCustomerAddress,
  StoreRegionCountry,
} from "@medusajs/types";

import AddressForm from "@/components/shared/address-form";
import {
  AccordionContent,
  AccordionItem,
  Label,
  RadioGroupItem,
  cn,
} from "@merchify/ui";
import {CHECKOUT_ADD_ADDRESS_ID} from "@/utils/constants";

export default function AddAddressItem({
  defaultAddress,
  countries,
  onSelect,
  selected,
  onSubmit,
}: {
  defaultAddress?: Partial<StoreCustomerAddress>;
  countries?: StoreRegionCountry[];
  selected: boolean;
  onSelect: (id: string) => void;
  onSubmit: (address: StoreCreateCustomerAddress) => Promise<any>;
}) {
  return (
    <AccordionItem
      className={cn(
        "-mt-px overflow-hidden border first:rounded-t-md last:rounded-b-md",
        {
          "bg-muted border-primary relative z-10": selected,
        },
      )}
      value={CHECKOUT_ADD_ADDRESS_ID}
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
    >
      <div className="flex w-full items-center gap-3 p-4">
        <RadioGroupItem
          value={CHECKOUT_ADD_ADDRESS_ID}
          id={CHECKOUT_ADD_ADDRESS_ID}
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
