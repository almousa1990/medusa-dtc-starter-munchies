import type {
  StoreCreateCustomerAddress,
  StoreCustomer,
  StoreRegionCountry,
  StoreUpdateCustomerAddress,
} from "@medusajs/types";

import {
  addCustomerAddress,
  updateCustomerAddress,
} from "@/actions/medusa/customer";
import {CHECKOUT_ADD_ADDRESS_ID} from "@/utils/constants";
import {Accordion, RadioGroup} from "@merchify/ui";
import {useCallback, useState} from "react";

import AddAddressItem from "./add-address-item";
import AddressItem from "./address-item";

type AddressSelectProps = {
  countries?: StoreRegionCountry[];
  customer: StoreCustomer;
  onValueChange: (value: null | string) => void;
  value?: null | string;
};

const getMostRecentAddress = (addresses: StoreCustomer["addresses"]) =>
  [...addresses].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )[0];

export default function AddressSelect({
  countries,
  customer,
  onValueChange,
  value,
}: AddressSelectProps) {
  const [expandedItem, setExpandedItem] = useState<
    string | typeof CHECKOUT_ADD_ADDRESS_ID
  >("");
  const [selectedItem, setSelectedItem] = useState<
    string | typeof CHECKOUT_ADD_ADDRESS_ID
  >(value ?? CHECKOUT_ADD_ADDRESS_ID);

  const handleEditCustomerAddress = useCallback(
    async (id: string, address: StoreUpdateCustomerAddress) => {
      const result = await updateCustomerAddress(id, address);
      if (!result.success) return result;
      setExpandedItem("");
      return result;
    },
    [],
  );

  const handleAddCustomerAddress = useCallback(
    async (address: StoreCreateCustomerAddress) => {
      const result = await addCustomerAddress(address);
      if (!result.success) return result;

      if (result.success) {
        const latest = getMostRecentAddress(result.customer.addresses);

        onValueChange(latest.id);
        setSelectedItem(latest.id);
        setExpandedItem("");
      }
      return result;
    },
    [onValueChange],
  );
  const handleSelect = useCallback(
    (value: string) => {
      if (selectedItem === value) return;
      if (value == CHECKOUT_ADD_ADDRESS_ID) {
        setExpandedItem(CHECKOUT_ADD_ADDRESS_ID);
        setSelectedItem(CHECKOUT_ADD_ADDRESS_ID);
        onValueChange(null);
      } else {
        onValueChange(value);
        setSelectedItem(value);
        setExpandedItem("");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onValueChange, expandedItem, selectedItem, setSelectedItem],
  );

  const handleExpand = useCallback((id: string) => {
    setExpandedItem((prev) => {
      return prev === id ? "" : id;
    });
  }, []);

  return (
    <Accordion
      className="grid w-full gap-2"
      collapsible
      type="single"
      value={expandedItem}
    >
      <RadioGroup
        className="gap-0"
        dir="rtl"
        onValueChange={handleSelect}
        value={selectedItem} // null → undefined
      >
        {(customer.addresses ?? []).map((address) => (
          <AddressItem
            address={address}
            countries={countries}
            key={address.id}
            onEdit={handleEditCustomerAddress}
            onSelect={handleSelect}
            onToggleOpen={handleExpand}
            selected={selectedItem === address.id}
          />
        ))}

        <AddAddressItem
          countries={countries}
          defaultAddress={{
            first_name: customer.first_name,
            last_name: customer.last_name,
            phone: customer.phone,
          }}
          onSelect={handleSelect}
          onSubmit={handleAddCustomerAddress}
          selected={selectedItem === CHECKOUT_ADD_ADDRESS_ID}
        />
      </RadioGroup>
    </Accordion>
  );
}
