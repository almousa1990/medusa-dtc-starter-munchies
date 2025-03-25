import type {
  StoreCreateCustomerAddress,
  StoreCustomer,
  StoreRegionCountry,
  StoreUpdateCustomerAddress,
} from "@medusajs/types";

import {
  addCustomerAddress,
  deleteCustomerAddress,
  updateCustomerAddress,
} from "@/actions/medusa/customer";
import {RadioGroup} from "@merchify/ui";
import {useState} from "react";

import AddAddressItem from "./add-address-item";
import AddressItem from "./address-item";

type AddressSelectProps = {
  countries?: StoreRegionCountry[];
  customer: StoreCustomer;
  onValueChange: (value: null | string) => void;
  value?: null | string;
};

export default function AddressSelect({
  countries,
  customer,
  onValueChange,
  value,
}: AddressSelectProps) {
  const [removingId, setRemovingId] = useState<null | string>(null);
  const [editFormOpenId, setEditFormOpenId] = useState<null | string>(null);
  const [addFormOpen, setAddFormOpen] = useState(false);

  const handleRemoveAddress = async (id: string) => {
    try {
      setRemovingId(id);
      await deleteCustomerAddress(id);
    } catch (e) {
      console.error("Failed to delete address:", e);
    } finally {
      setRemovingId(null);
    }
  };

  const handleEditCustomerAddress = async (
    id: string,
    address: StoreUpdateCustomerAddress,
  ) => {
    const result = await updateCustomerAddress(id, address);
    if (result.success) setEditFormOpenId(null);
    return result;
  };

  const handleAddCustomerAddress = async (
    address: StoreCreateCustomerAddress,
  ) => {
    const result = await addCustomerAddress(address);
    if (result.success) {
      const [latest] = result.customer.addresses.sort(
        (
          a: {created_at: Date | number | string},
          b: {created_at: Date | number | string},
        ) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
      setAddFormOpen(false);
      onValueChange(latest.id);
    }
    return result;
  };

  const handleSelect = (value: string) => {
    onValueChange(value);
    setAddFormOpen(false);
    setEditFormOpenId(null);
  };

  const handleAddAddressOpenChange = (open: boolean) => {
    setAddFormOpen(open);
    if (open) {
      setEditFormOpenId(null);
      onValueChange(null);
    }
  };

  return (
    <>
      <RadioGroup
        dir="rtl"
        onValueChange={handleSelect}
        value={value ?? ""} // null → undefined
      >
        {customer.addresses.map((address) => (
          <AddressItem
            address={address}
            countries={countries}
            isOpen={editFormOpenId === address.id}
            isRemoving={removingId === address.id}
            isSelected={value === address.id}
            key={address.id}
            onEdit={handleEditCustomerAddress}
            onRemove={handleRemoveAddress}
            onSelect={handleSelect} // ← NEW
            onToggleOpen={() =>
              setEditFormOpenId((prev) =>
                prev === address.id ? null : address.id,
              )
            }
          />
        ))}
      </RadioGroup>

      <AddAddressItem
        countries={countries}
        onOpenChange={handleAddAddressOpenChange}
        onSubmit={handleAddCustomerAddress}
        open={addFormOpen}
      />
    </>
  );
}
