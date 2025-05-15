"use client";

import React, {useEffect, useState, useActionState} from "react";
import {HttpTypes, StoreUpdateCustomerAddress} from "@medusajs/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  cn,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@merchify/ui";
import AddressForm from "@/components/shared/address-form";
import {
  deleteCustomerAddress,
  updateCustomerAddress,
} from "@/actions/medusa/customer";
import Heading from "@/components/shared/typography/heading";
import Body from "@/components/shared/typography/body";
import {Pencil, Trash, Trash2} from "lucide-react";
import {Cta} from "@/components/shared/button";

type EditAddressProps = {
  region: HttpTypes.StoreRegion;
  address: HttpTypes.StoreCustomerAddress;
};

const EditAddress: React.FC<EditAddressProps> = ({region, address}) => {
  const [open, setOpen] = useState(false);
  const [removing, setRemoving] = useState(false);

  const hanldeRemoveAddress = async () => {
    setRemoving(true);
    await deleteCustomerAddress(address.id);
    setRemoving(false);
  };

  const handleEditAddress = async (data: StoreUpdateCustomerAddress) => {
    const result = await updateCustomerAddress(address.id, data);

    if (result.success) {
      setOpen(false);
    }
    return result;
  };

  return (
    <>
      <div
        className={cn(
          "flex h-full min-h-[220px] w-full flex-col justify-between rounded-md border p-5 transition-colors",
        )}
      >
        <div className="flex flex-col">
          <Heading tag="h4" mobileSize="base" className="text-right">
            {address.first_name} {address.last_name}
          </Heading>

          <Body className="mt-2 flex flex-col text-right" mobileSize="sm">
            <span data-testid="address-address">
              {address.address_1}
              {address.address_2 && <span>, {address.address_2}</span>}
            </span>
            <span data-testid="address-postal-city">
              {address.postal_code}, {address.city}
            </span>
            <span data-testid="address-province-country">
              {address.province && `${address.province}, `}
              {address.metadata?.country_name as string}
            </span>
          </Body>
        </div>
        <div className="flex items-center justify-end gap-x-2">
          <Cta size="sm" variant="secondary" onClick={() => setOpen(true)}>
            <Pencil /> تعديل
          </Cta>

          <DeleteAddressButton
            onConfirm={hanldeRemoveAddress}
            loading={removing}
          />
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل العنوان</DialogTitle>
            <DialogDescription className="hidden">
              تعديل عنوان الشحن
            </DialogDescription>
          </DialogHeader>
          <AddressForm
            address={address}
            countries={region.countries}
            onSubmit={handleEditAddress}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

function DeleteAddressButton({
  onConfirm,
  loading = false,
}: {
  onConfirm: () => void;
  loading?: boolean;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Cta loading={loading} size="sm" variant="secondary">
          <Trash2 />
          حذف
        </Cta>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>تأكيد حذف العنوان</AlertDialogTitle>
          <AlertDialogDescription>
            لا يمكن التراجع عن هذا الإجراء. سيتم حذف هذا العنوان من حسابك.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>تأكيد</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default EditAddress;
