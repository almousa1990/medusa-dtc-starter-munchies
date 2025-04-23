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
import {RadioGroup} from "@merchify/ui";
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
  const [editFormOpenId, setEditFormOpenId] = useState<null | string>(null);
  const [addFormOpen, setAddFormOpen] = useState(false);

  const handleEditCustomerAddress = useCallback(
    async (id: string, address: StoreUpdateCustomerAddress) => {
      const result = await updateCustomerAddress(id, address);
      if (!result.success) return result;
      if (result.success) setEditFormOpenId(null);
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
        setAddFormOpen(false);
      }
      return result;
    },
    [onValueChange],
  );

  const handleSelect = useCallback(
    (value: string) => {
      onValueChange(value);
      setAddFormOpen(false);
    },
    [onValueChange],
  );

  const handleAddAddressOpenChange = useCallback(
    (open: boolean) => {
      setAddFormOpen(open);
      if (open) {
        setEditFormOpenId(null);
        onValueChange(null);
      }
    },
    [onValueChange],
  );

  const handleExpand = useCallback((id: string) => {
    setEditFormOpenId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <>
      <RadioGroup
        dir="rtl"
        onValueChange={handleSelect}
        value={value ?? ""} // null → undefined
      >
        {(customer.addresses ?? []).map((address) => (
          <AddressItem
            address={address}
            countries={countries}
            isOpen={editFormOpenId === address.id && value === address.id}
            isSelected={value === address.id}
            key={address.id}
            onEdit={handleEditCustomerAddress}
            onSelect={handleSelect} // ← NEW
            onToggleOpen={handleExpand}
          />
        ))}
      </RadioGroup>

      <AddAddressItem
        defaultAddress={{
          first_name: customer.first_name,
          last_name: customer.last_name,
          phone: customer.phone,
        }}
        countries={countries}
        onOpenChange={handleAddAddressOpenChange}
        onSubmit={handleAddCustomerAddress}
        open={addFormOpen}
      />
    </>
  );
}
