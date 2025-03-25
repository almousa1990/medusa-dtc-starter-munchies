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

export default function AddressItem({
  address,
  countries,
  isOpen,
  isRemoving,
  isSelected,
  onEdit,
  onRemove,
  onSelect, // ← NEW
  onToggleOpen,
}: {
  address: StoreCustomerAddress;
  countries?: StoreRegionCountry[];
  isOpen: boolean;
  isRemoving: boolean;
  isSelected: boolean;
  onEdit: (id: string, values: StoreUpdateCustomerAddress) => Promise<any>;
  onRemove: (id: string) => void;
  onSelect: (id: string) => void; // ← NEW
  onToggleOpen: () => void;
}) {
  const handleEditClick = () => {
    onSelect(address.id); // ← Select the address
    onToggleOpen(); // ← Open the form
  };

  return (
    <Collapsible
      className={cn("rounded-md border p-4", {
        "border-primary": isSelected,
      })}
      onOpenChange={onToggleOpen}
      open={isOpen}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <RadioGroupItem id={address.id} value={address.id} />
          <Label htmlFor={address.id}>
            {address.country_code} - {address.city} - {address.address_1}
          </Label>
        </div>
        <div className="flex gap-2">
          <Button
            className="flex items-center gap-2"
            disabled={isRemoving}
            onClick={() => onRemove(address.id)}
            size="sm"
            type="button"
            variant="ghost"
          >
            {isRemoving ? <>⏳</> : <>🗑️</>}
            حذف
          </Button>
          <Button
            onClick={handleEditClick}
            size="sm"
            type="button"
            variant="ghost"
          >
            تعديل
          </Button>
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
