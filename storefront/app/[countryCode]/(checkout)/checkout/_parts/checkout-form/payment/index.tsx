"use client";
import {useCheckout} from "@/components/context/checkout-context";
import Heading from "@/components/shared/typography/heading";

import {
  Checkbox,
  cn,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@merchify/ui";
import PaymentSelect from "../../payment-select";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {formSchema} from "./schema";
import PaymentButton from "../../payment-button";

export const PAYMENT_METHODS = {
  CARD: "creditcard",
  APPLEPAY: "applepay",
  STCPAY: "stcpay",
} as const;

export default function Payment({active}: {active: boolean}) {
  const {cart, customer, paymentMethods, setStep} = useCheckout();

  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (session: any) => session.status === "pending",
  );

  const activeSessionSource = activeSession
    ? (activeSession.data.source as {
        type: "creditcard" | "applepay";
      })
    : undefined;

  const activeType = activeSessionSource?.type ?? "creditcard";

  const form = useForm({
    defaultValues: {
      type: activeType,
      card: {
        number: "",
        month: "",
        year: "",
        cvc: "",
      },
      agreement: false,
    },
    resolver: zodResolver(formSchema),
  });

  const {
    formState: {isSubmitSuccessful, isSubmitting},
    handleSubmit,
    reset,
  } = form;

  const type = form.watch("type");

  return (
    <div
      onClick={() => (paymentMethods.length ? setStep("payment") : {})}
      className={cn({"cursor-pointer": !active})}
    >
      <Form {...form}>
        <form className="border-accent flex flex-col gap-2 pb-4">
          <div className="flex w-full flex-col gap-2 border-t py-4">
            <div className="flex h-10 items-center justify-between">
              <Heading
                desktopSize="xl"
                font="serif"
                mobileSize="xl"
                tag="h3"
                className={cn({"text-muted-foreground": !active})}
              >
                الدفع
              </Heading>
            </div>
          </div>
          {active && (
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({field}) => (
                  <FormItem>
                    <PaymentSelect
                      value={type}
                      onValueChange={field.onChange}
                      customer={customer}
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="agreement"
                render={({field}) => (
                  <FormItem>
                    <div className="flex flex-row items-start gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>
                        باستمرارك بالدفع فأنت موافق على الشروط والأحكام
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <PaymentButton
                type={type}
                loading={isSubmitting}
                disabled={!type}
              />
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
