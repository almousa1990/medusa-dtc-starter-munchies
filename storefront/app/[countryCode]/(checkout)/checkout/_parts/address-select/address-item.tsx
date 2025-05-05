import type {
  StoreCustomerAddress,
  StoreRegionCountry,
  StoreUpdateCustomerAddress,
} from "@medusajs/types";

import AddressForm from "@/components/shared/address-form";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Label,
  RadioGroupItem,
  cn,
} from "@merchify/ui";
import Body from "@/components/shared/typography/body";
import FormattedAddress from "@/components/shared/formatted-address";

export default function AddressItem({
  address,
  countries,
  selected,
  onEdit,
  onSelect, // ← NEW
  onToggleOpen,
}: {
  address: StoreCustomerAddress;
  countries?: StoreRegionCountry[];
  selected: boolean;
  onEdit: (id: string, data: StoreUpdateCustomerAddress) => Promise<any>;
  onSelect: (id: string) => void; // ← NEW
  onToggleOpen: (id: string) => void;
}) {
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(address.id);
    onToggleOpen(address.id);
  };

  return (
    <AccordionItem
      className={cn(
        "-mt-px overflow-hidden border first:rounded-t-md last:rounded-b-md",
        {
          "bg-muted border-primary relative z-10": selected,
        },
      )}
      value={address.id}
      onClick={(e) => {
        const target = e.target as HTMLElement;

        // Prevent triggering if clicking inside the radio or label
        if (
          target.closest("label") || // this might include the Label or any nested child like <Body>
          target.closest("input[type='radio']")
        ) {
          return;
        }

        onSelect(address.id);
      }}
    >
      <div className="flex items-center justify-between gap-3 p-4">
        <div className="flex w-full items-center gap-3">
          <RadioGroupItem id={address.id} value={address.id} />
          <Label htmlFor={address.id} className="w-full font-normal">
            <Body mobileSize="sm" className="block font-medium">
              {address.first_name} {address.last_name}
            </Body>
            <Body mobileSize="sm" className="text-muted-foreground block">
              <FormattedAddress address={address} />
            </Body>
          </Label>
        </div>
        <AccordionTrigger
          className="flex gap-2"
          onClick={handleEditClick}
        ></AccordionTrigger>
      </div>
      <AccordionContent className="bg-background border-primary border-t p-4">
        <AddressForm
          address={address}
          countries={countries}
          onSubmit={(values) => onEdit(address.id, values)}
        />
      </AccordionContent>
    </AccordionItem>
  );
}
