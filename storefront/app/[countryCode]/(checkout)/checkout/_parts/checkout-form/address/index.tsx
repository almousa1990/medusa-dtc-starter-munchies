"use client";
import type {StoreCart, StoreCustomer} from "@medusajs/types";
import type {Dispatch, SetStateAction} from "react";

import {setCheckoutAddresses} from "@/actions/medusa/order";
import {Cta} from "@/components/shared/button";
import Body from "@/components/shared/typography/body";
import Heading from "@/components/shared/typography/heading";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormField, FormItem} from "@merchify/ui";
import {useEffect} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";

import AddressSelect from "../../address-select";

const formSchema = z.object({
  customer_address_id: z.string().nullable(),
});

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
  const form = useForm({
    defaultValues: {
      customer_address_id:
        (cart?.shipping_address?.metadata?.customer_address_id as string) ||
        null,
    },
    resolver: zodResolver(formSchema),
  });

  const {
    formState: {isSubmitSuccessful, isSubmitting},
    handleSubmit,
    reset,
  } = form;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const address = customer.addresses.find(
      (address) => address.id == data.customer_address_id,
    );
    if (address) {
      await setCheckoutAddresses({
        address_1: address.address_1 || undefined,
        address_2: address.address_2 || undefined,
        city: address.city || undefined,
        company: address.company || undefined,
        country_code: address.country_code || undefined,
        first_name: address.first_name || customer?.first_name || undefined,
        last_name: address.last_name || customer?.last_name || undefined,
        metadata: {customer_address_id: address.id},
        phone: address.phone || undefined,
        postal_code: address.postal_code || undefined,
        province: address.province || undefined,
      });
    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      setStep(nextStep);
      reset();
    }
  }, [isSubmitSuccessful, setStep, nextStep, reset]);

  const isFilled = !active && !!cart.shipping_address?.address_1;
  const customerAddressId = form.watch("customer_address_id");

  return (
    <Form {...form}>
      <form
        className="border-accent flex flex-col gap-2 pb-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex h-10 items-center justify-between">
          <Heading desktopSize="xl" font="serif" mobileSize="xl" tag="h3">
            عنوان التوصيل
          </Heading>
          {isFilled && (
            <Cta
              onClick={() => setStep("addresses")}
              size="sm"
              variant="outline"
            >
              تعديل
            </Cta>
          )}
        </div>
        {isFilled && (
          <Body font="sans">
            {cart.shipping_address?.city}, {cart.shipping_address?.address_1},{" "}
            {cart.shipping_address?.address_2}
          </Body>
        )}
        {active && (
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="customer_address_id"
              render={({field}) => (
                <FormItem>
                  <AddressSelect
                    countries={cart.region?.countries}
                    customer={customer}
                    onValueChange={field.onChange}
                    value={field.value}
                  />
                </FormItem>
              )}
            />

            <Cta
              className="w-full"
              disabled={!customerAddressId}
              loading={isSubmitting}
              size="sm"
              type="submit"
            >
              تأكيد العنوان
            </Cta>
          </div>
        )}
      </form>
    </Form>
  );
}
