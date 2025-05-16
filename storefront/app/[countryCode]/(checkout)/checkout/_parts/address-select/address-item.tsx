import type {
  StoreCustomerAddress,
  StoreRegionCountry,
  StoreUpdateCustomerAddress,
} from "@medusajs/types";

import AddressForm from "@/components/shared/address-form";
import FormattedAddress from "@/components/shared/formatted-address";
import Body from "@/components/shared/typography/body";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Label,
  RadioGroupItem,
  cn,
} from "@merchify/ui";

export default function AddressItem({
  address,
  countries,
  onEdit,
  onSelect, // ← NEW
  onToggleOpen,
  selected,
}: {
  address: StoreCustomerAddress;
  countries?: StoreRegionCountry[];
  onEdit: (id: string, data: StoreUpdateCustomerAddress) => Promise<any>;
  onSelect: (id: string) => void; // ← NEW
  onToggleOpen: (id: string) => void;
  selected: boolean;
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
      value={address.id}
    >
      <div className="flex items-center justify-between gap-3 p-4">
        <div className="flex w-full items-center gap-3">
          <RadioGroupItem id={address.id} value={address.id} />
          <Label className="w-full font-normal" htmlFor={address.id}>
            <Body className="block font-medium" mobileSize="sm">
              {address.first_name} {address.last_name}
            </Body>
            <Body className="text-muted-foreground block" mobileSize="sm">
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
