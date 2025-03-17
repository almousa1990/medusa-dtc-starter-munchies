"use client";

import {useState} from "react";

import {HttpTypes} from "@medusajs/types";

import AddressForm from "@/components/shared/address-form";
import {addCustomerAddress} from "@/actions/medusa/customer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@merchify/ui";

const AddAddress = ({region}: {region: HttpTypes.StoreRegion}) => {
  const [open, setOpen] = useState(false);
  const handleAddAddress = async (
    address: HttpTypes.StoreCreateCustomerAddress,
  ) => {
    const result = await addCustomerAddress(address);

    if (result.success) {
      setOpen(false);
    }

    return result;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            className="border-ui-border-base rounded-rounded flex h-full min-h-[220px] w-full flex-col justify-between border p-5"
            data-testid="add-address-button"
          >
            <span className="text-base-semi">عنوان جديد</span>+
          </button>
        </DialogTrigger>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>إضافة عنوان</DialogTitle>
            <DialogDescription className="hidden">
              إضافة عنوان جديد
            </DialogDescription>
          </DialogHeader>
          <AddressForm
            countries={region.countries}
            onSubmit={handleAddAddress}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddAddress;
