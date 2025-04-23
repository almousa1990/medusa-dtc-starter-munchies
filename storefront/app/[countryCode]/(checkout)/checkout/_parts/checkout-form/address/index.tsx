"use client";
import {setCheckoutAddresses} from "@/actions/medusa/order";
import {useCheckout} from "@/components/context/checkout-context";
import {Cta} from "@/components/shared/button";
import FormattedAddress from "@/components/shared/formatted-address";
import Body from "@/components/shared/typography/body";
import Heading from "@/components/shared/typography/heading";
import {zodResolver} from "@hookform/resolvers/zod";
import {cn, Form, FormField, FormItem} from "@merchify/ui";
import {useForm} from "react-hook-form";
import {z} from "zod";

import AddressSelect from "../../address-select";
import {useEffect, useState} from "react";
import {Check} from "lucide-react";

const formSchema = z.object({
  customer_address_id: z.string().nullable(),
});

export default function Address({active}: {active: boolean}) {
  const {cart, customer, setStep, shippingMethods} = useCheckout();

  const nextStep = shippingMethods.length > 0 ? "delivery" : "payment";

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

  useEffect(() => {
    if (!active) {
      reset();
    }
  }, [active]);

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
        metadata: {
          ...address.metadata,
          customer_address_id: address.id,
        },
        phone: address.phone || undefined,
        postal_code: address.postal_code || undefined,
        province: address.province || undefined,
      });

      form.setValue("customer_address_id", address.id);
      setStep(nextStep);
    }
  };

  const isFilled = !active && !!cart.shipping_address?.address_1;
  const customerAddressId = form.watch("customer_address_id");

  return (
    <div
      onClick={() => (isFilled ? setStep("addresses") : {})}
      className={cn({"cursor-pointer": !active})}
    >
      <Form {...form}>
        <form
          className="border-accent flex flex-col gap-2 pb-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex h-10 items-center justify-between">
            <Heading
              desktopSize="xl"
              font="serif"
              mobileSize="xl"
              tag="h3"
              className={cn({"text-muted-foreground": !active})}
            >
              عنوان التوصيل
            </Heading>
            {isFilled && (
              <div className="bg-secondary flex size-10 items-center justify-center rounded-full">
                <Check className="size-4" />
              </div>
            )}
          </div>
          {isFilled && cart.shipping_address && (
            <Body font="sans" className="text-muted-foreground text-sm">
              <FormattedAddress address={cart.shipping_address} />
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
                type="submit"
              >
                تأكيد العنوان
              </Cta>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
