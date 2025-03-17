"use client";
import type {
  StoreCart,
  StoreCartAddress,
  StoreCreateCustomerAddress,
  StoreCustomer,
  StoreCustomerAddress,
  StoreRegionCountry,
  StoreUpdateCustomerAddress,
} from "@medusajs/types";
import type {BaseRegionCountry} from "@medusajs/types/dist/http/region/common";
import type {Dispatch, SetStateAction} from "react";

import {setCheckoutAddresses} from "@/actions/medusa/order";
import {Cta} from "@/components/shared/button";
import Checkbox from "@/components/shared/checkbox";
import {
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
} from "@merchify/ui";
import InputCombobox from "@/components/shared/input-combobox";
import Body from "@/components/shared/typography/body";
import Heading from "@/components/shared/typography/heading";
import {useResetableActionState} from "@/hooks/use-resetable-action-state";
import {useEffect, useState, useTransition} from "react";
import {useFormStatus} from "react-dom";
import {
  addCustomerAddress,
  deleteCustomerAddress,
  updateCustomerAddress,
} from "@/actions/medusa/customer";
import AddressForm from "@/components/shared/address-form";

export default function Address({
  active,
  cart,
  customer,
  nextStep,
  setStep,
}: {
  active: boolean;
  cart: StoreCart;
  customer: StoreCustomer;
  nextStep: "addresses" | "delivery" | "payment" | "review";
  setStep: Dispatch<
    SetStateAction<"addresses" | "delivery" | "payment" | "review">
  >;
}) {
  const [checked, setChecked] = useState(true);
  const [, startTransition] = useTransition();

  const [{status}, action, , reset] = useResetableActionState(
    setCheckoutAddresses,
    {
      error: null,
      status: "idle",
    },
  );

  useEffect(() => {
    if (status === "success") {
      setStep(nextStep);
      startTransition(() => reset());
    }
  }, [status, setStep, nextStep, reset]);

  const isFilled = !active && !!cart.shipping_address?.address_1;

  return (
    <form
      action={action}
      className="border-accent flex flex-col gap-8 border-t py-8"
    >
      <div className="flex items-center justify-between">
        <Heading desktopSize="xs" font="sans" mobileSize="xs" tag="h6">
          Shipping Address
        </Heading>
        {isFilled && (
          <Cta onClick={() => setStep("addresses")} size="sm" variant="outline">
            Edit
          </Cta>
        )}
      </div>
      {isFilled && (
        <div className="flex w-full flex-col gap-4 lg:flex-row">
          <div className="flex flex-1 flex-col gap-4">
            <Body className="font-semibold" font="sans">
              Shipping address
            </Body>
            <div className="flex flex-col gap-[6px]">
              <Body font="sans">
                {cart.shipping_address?.first_name}{" "}
                {cart.shipping_address?.last_name}
              </Body>
              <Body font="sans">{cart.shipping_address?.address_1}</Body>
              <Body font="sans">
                {cart.shipping_address?.postal_code},{" "}
                {cart.shipping_address?.city}
              </Body>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-4">
            <Body className="font-semibold" font="sans">
              Contact
            </Body>
            <Body font="sans">{cart.email}</Body>
          </div>
        </div>
      )}
      {active && (
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <AddressSelect
              customer={customer}
              countries={cart.region?.countries}
            />
            <AddressInputs
              address={cart.shipping_address}
              addressName="shipping_address"
              countries={cart.region?.countries}
            />
          </div>
          <Checkbox
            checked={checked}
            onCheckedChange={(v) =>
              setChecked(v === "indeterminate" ? false : v)
            }
          />
          <div className="grid gap-4 lg:grid-cols-2">
            <Input
              defaultValue={cart.email}
              name="email"
              placeholder="Email"
              required
            />
            {cart.shipping_address?.phone}
            <Input
              defaultValue={cart.shipping_address?.phone}
              name="phone"
              placeholder="Phone"
            />
          </div>

          {!checked && (
            <>
              <Heading desktopSize="xs" font="sans" mobileSize="xs" tag="h6">
                Billing address
              </Heading>
              <div className="grid gap-4 lg:grid-cols-2">
                <AddressInputs
                  address={cart.billing_address}
                  addressName="billing_address"
                  countries={cart.region?.countries}
                />
                <Input
                  defaultValue={cart.billing_address?.phone}
                  name="billing_address.phone"
                  placeholder="Phone"
                />
              </div>
            </>
          )}
          <SubmitButton />
        </div>
      )}
    </form>
  );
}

function SubmitButton() {
  const {pending} = useFormStatus();
  return (
    <Cta loading={pending} size="sm" type="submit">
      Continue to delivery
    </Cta>
  );
}

function AddressInputs({
  address,
  addressName,
  countries,
}: {
  address?: StoreCartAddress;
  addressName: string;
  countries?: BaseRegionCountry[];
}) {
  const inputName = (name: string) => addressName + "." + name;

  return (
    <>
      <Input
        defaultValue={address?.first_name}
        name={inputName("first_name")}
        placeholder="First name"
        required
      />
      <Input
        defaultValue={address?.last_name}
        name={inputName("last_name")}
        placeholder="Last name"
        required
      />
      <Input
        defaultValue={address?.address_1}
        name={inputName("address_1")}
        placeholder="Address"
        required
      />
      <Input
        defaultValue={address?.company}
        name={inputName("company")}
        placeholder="Company"
      />
      <Input
        defaultValue={address?.postal_code}
        name={inputName("postal_code")}
        placeholder="Postal code"
        required
      />
      <Input
        defaultValue={address?.city}
        name={inputName("city")}
        placeholder="City"
        required
      />
      <InputCombobox
        defaultValue={address?.country_code}
        name={inputName("country_code")}
        options={
          countries
            ?.filter(
              (
                country,
              ): country is {
                display_name: string;
                iso_2: string;
              } & BaseRegionCountry =>
                !!country.display_name && !!country.iso_2,
            )
            .map(({display_name, iso_2}) => ({
              id: iso_2,
              label: display_name,
            })) || []
        }
        placeholder="Country"
        required
      />
      <Input
        defaultValue={address?.province}
        name={inputName("province")}
        placeholder="State/Province"
        required
      />
    </>
  );
}

const AddressSelect = ({
  customer,
  countries,
  value,
  onValueChange,
}: {
  customer: StoreCustomer;
  countries?: StoreRegionCountry[];
  value?: string;
  onValueChange: (value: string) => void;
}) => {
  const [removing, setRemoving] = useState(false);
  const [addressEditFormOpen, setAddressEditFormOpen] = useState(false);
  const [addressAddFormOpen, setAddressAddFormOpen] = useState(false);

  const removeAddress = async (id: string) => {
    setRemoving(true);
    await deleteCustomerAddress(id);
    setRemoving(false);
  };

  const handleEditCustomerAddress = async (
    id: string,
    address: StoreUpdateCustomerAddress,
  ) => {
    const result = await updateCustomerAddress(id, address);

    if (result.success) {
      setAddressEditFormOpen(false);
    }

    return result;
  };

  const handleAddCustomerAddress = async (
    address: StoreCreateCustomerAddress,
  ) => {
    const result = await addCustomerAddress(address);

    if (result.success) {
      const [address] = result.customer.addresses.sort(
        (a: StoreCustomerAddress, b: StoreCustomerAddress) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
      setAddressAddFormOpen(false);
      handleSelectionChange(address.id);
    }

    return result;
  };

  return (
    <RadioGroup onValueChange={onValueChange} value={value} dir="rtl">
      {customer.addresses.map((address) => {
        return (
          <div
            key={address.id}
            className={cn(
              "flex items-center justify-between space-x-3 space-x-reverse rounded-md border p-4",
              {"border-primary": address.id == value},
            )}
          >
            <div className="flex items-center space-x-3 space-x-reverse">
              <RadioGroupItem value={address.id} id={address.id} />
              <Label htmlFor={address.id}>
                {address.country_code} - {address.city} -{" "}
                {address.address_1}{" "}
              </Label>
            </div>
            <div className="flex space-x-2 space-x-reverse">
              <Button
                disabled={removing}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => removeAddress(address.id)}
              >
                {removing ? <>spinner icon</> : <>trash icon</>}
                حذف
              </Button>
              <Dialog
                open={addressEditFormOpen}
                onOpenChange={setAddressEditFormOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    تعديل
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>تعديل العنوان</DialogTitle>
                    <DialogDescription className="sr-only">
                      تعديل عنوان الشحن
                    </DialogDescription>
                  </DialogHeader>
                  <AddressForm
                    address={address}
                    countries={countries}
                    onSubmit={(values) =>
                      handleEditCustomerAddress(address.id, values)
                    }
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        );
      })}
      <Dialog open={addressAddFormOpen} onOpenChange={setAddressEditFormOpen}>
        <DialogTrigger className="w-full space-y-6 space-y-reverse rounded-md border border-dashed p-4 text-right">
          إضافة عنوان جديد
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة عنوان جديد</DialogTitle>
            <DialogDescription className="hidden">
              إضافة عنوان الشحن
            </DialogDescription>
          </DialogHeader>
          <AddressForm
            countries={countries}
            onSubmit={handleAddCustomerAddress}
          />
        </DialogContent>
      </Dialog>
    </RadioGroup>
  );
};
