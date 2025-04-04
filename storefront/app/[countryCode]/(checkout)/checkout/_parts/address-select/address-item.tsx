import type {
  StoreCustomerAddress,
  StoreRegionCountry,
  StoreUpdateCustomerAddress,
} from "@medusajs/types";

import AddressForm from "@/components/shared/address-form";
import {
  Button,
  Collapsible,
  CollapsibleContent,
  Label,
  RadioGroupItem,
  cn,
} from "@merchify/ui";
import Body from "@/components/shared/typography/body";
import {Cta} from "@/components/shared/button";
import {ChevronDown, ChevronUp} from "lucide-react";
import FormattedAddress from "@/components/shared/formatted-address";

export default function AddressItem({
  address,
  countries,
  isOpen,
  isSelected,
  onEdit,
  onSelect, // ← NEW
  onToggleOpen,
}: {
  address: StoreCustomerAddress;
  countries?: StoreRegionCountry[];
  isOpen: boolean;
  isSelected: boolean;
  onEdit: (id: string, data: StoreUpdateCustomerAddress) => Promise<any>;
  onSelect: (id: string) => void; // ← NEW
  onToggleOpen: (id: string) => void;
}) {
  const handleEditClick = () => {
    onSelect(address.id); // ← Select the address
    onToggleOpen(address.id); // ← Open the form
  };

  return (
    <Collapsible
      className={cn("rounded-md border p-4", {
        "border-primary": isSelected,
      })}
      onOpenChange={() => onToggleOpen(address.id)}
      open={isOpen}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <RadioGroupItem id={address.id} value={address.id} />
          <Label htmlFor={address.id} className="font-normal">
            <Body mobileSize="sm" className="block font-medium">
              {address.first_name} {address.last_name}
            </Body>
            <Body mobileSize="sm" className="block">
              <FormattedAddress address={address} />
            </Body>
          </Label>
        </div>
        <div className="flex gap-2">
          <Cta
            onClick={handleEditClick}
            size="sm"
            type="button"
            variant="ghost"
          >
            {isOpen ? <ChevronUp /> : <ChevronDown />}
          </Cta>
        </div>
      </div>
      <CollapsibleContent className="pt-4">
        <AddressForm
          address={address}
          countries={countries}
          onSubmit={(values) => onEdit(address.id, values)}
        />
      </CollapsibleContent>
    </Collapsible>
  );
}
