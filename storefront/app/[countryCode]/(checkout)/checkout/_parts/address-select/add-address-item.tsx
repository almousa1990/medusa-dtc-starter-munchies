import type {
  StoreCreateCustomerAddress,
  StoreCustomerAddress,
  StoreRegionCountry,
} from "@medusajs/types";

import AddressForm from "@/components/shared/address-form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Label,
  cn,
} from "@merchify/ui";

export default function AddAddressItem({
  defaultAddress,
  countries,
  onOpenChange,
  onSubmit,
  open,
}: {
  defaultAddress?: Partial<StoreCustomerAddress>;
  countries?: StoreRegionCountry[];
  onOpenChange: (open: boolean) => void;
  onSubmit: (address: StoreCreateCustomerAddress) => Promise<any>;
  open: boolean;
}) {
  return (
    <Collapsible
      className={cn("w-full rounded-md border p-4 text-right", {
        "border-dashed": !open,
        "border-primary": open,
      })}
      onOpenChange={onOpenChange}
      open={open}
    >
      <CollapsibleTrigger asChild>
        <div className="flex items-center gap-2">
          <Label htmlFor="new">إضافة عنوان جديد</Label>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4">
        <AddressForm
          address={defaultAddress}
          countries={countries}
          onSubmit={(data) => onSubmit(data as StoreCreateCustomerAddress)}
        />
      </CollapsibleContent>
    </Collapsible>
  );
}
