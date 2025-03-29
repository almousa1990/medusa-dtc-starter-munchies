"use client";

import {useState} from "react";

import {HttpTypes, StoreCreateCustomerAddress} from "@medusajs/types";

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
import Heading from "@/components/shared/typography/heading";
import {Plus} from "lucide-react";

const AddAddress = ({region}: {region: HttpTypes.StoreRegion}) => {
  const [open, setOpen] = useState(false);
  const handleAddAddress = async (address: StoreCreateCustomerAddress) => {
    const result = await addCustomerAddress(address);

    if (result.success) {
      setOpen(false);
    }

    return result;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex h-full min-h-[220px] w-full flex-col justify-between rounded-md border p-5">
          <Heading tag="h4" mobileSize="lg" className="text-right">
            عنوان جديد
          </Heading>
          <div className="flex justify-end">
            <Plus />
          </div>
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
          onSubmit={(data) =>
            handleAddAddress(data as StoreCreateCustomerAddress)
          }
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddAddress;
