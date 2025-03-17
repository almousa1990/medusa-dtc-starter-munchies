"use client";

import React, {useEffect, useState, useActionState} from "react";
import {HttpTypes} from "@medusajs/types";
import {
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

type EditAddressProps = {
  region: HttpTypes.StoreRegion;
  address: HttpTypes.StoreCustomerAddress;
  isActive?: boolean;
};

const EditAddress: React.FC<EditAddressProps> = ({
  region,
  address,
  isActive = false,
}) => {
  const [open, setOpen] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [successState, setSuccessState] = useState(false);

  const hanldeRemoveAddress = async () => {
    setRemoving(true);
    await deleteCustomerAddress(address.id);
    setRemoving(false);
  };

  const handleEditAddress = async (
    data: HttpTypes.StoreCreateCustomerAddress,
  ) => {
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
          "rounded-rounded flex h-full min-h-[220px] w-full flex-col justify-between border p-5 transition-colors",
          {
            "border-gray-900": isActive,
          },
        )}
        data-testid="address-container"
      >
        <div className="flex flex-col">
          <Heading
            tag="h4"
            className="text-base-semi text-right"
            data-testid="address-name"
          >
            {address.first_name} {address.last_name}
          </Heading>
          {address.company && (
            <Body
              className="txt-compact-small text-ui-fg-base"
              data-testid="address-company"
            >
              {address.company}
            </Body>
          )}
          <Body className="text-base-regular mt-2 flex flex-col text-right">
            <span data-testid="address-address">
              {address.address_1}
              {address.address_2 && <span>, {address.address_2}</span>}
            </span>
            <span data-testid="address-postal-city">
              {address.postal_code}, {address.city}
            </span>
            <span data-testid="address-province-country">
              {address.province && `${address.province}, `}
              {address.country_code?.toUpperCase()}
            </span>
          </Body>
        </div>
        <div className="flex items-center gap-x-4">
          <button
            className="text-small-regular text-ui-fg-base flex items-center gap-x-2"
            onClick={() => setOpen(true)}
            data-testid="address-edit-button"
          >
            (edit icon) تعديل
          </button>
          <button
            className="text-small-regular text-ui-fg-base flex items-center gap-x-2"
            onClick={hanldeRemoveAddress}
            data-testid="address-delete-button"
          >
            {removing ? <>spinner</> : <>trash</>}
            حذف
          </button>
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

export default EditAddress;
