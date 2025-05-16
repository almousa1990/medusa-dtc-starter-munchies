"use client";
import {placeOrder} from "@/actions/medusa/order";
import {useCheckout} from "@/components/context/checkout-context";
import Heading from "@/components/shared/typography/heading";
import {PaymentSourceType} from "@/types";
import {getRawPaymentData} from "@/utils/moyasar/payment";
import {zodResolver} from "@hookform/resolvers/zod";
import {
  Checkbox,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  cn,
} from "@merchify/ui";
import {useForm} from "react-hook-form";

import PaymentButton from "../../payment-button";
import PaymentSelect from "../../payment-select";
import {formSchema} from "./schema";

export default function Payment({active}: {active: boolean}) {
  const {cart, paymentMethods, setStep} = useCheckout();

  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (session) => session.status === "pending",
  );

  const sessionData = getRawPaymentData(activeSession?.data);

  const activeType = sessionData?.source.type ?? PaymentSourceType.CreditCard;

  const form = useForm({
    defaultValues: {
      agreement: false,
      card: {
        cvc: "",
        month: "",
        number: "",
        year: "",
      },
      type: activeType,
    },
    resolver: zodResolver(formSchema),
  });

  const {
    formState: {isSubmitting},
  } = form;

  const type = form.watch("type");
  console.log("type", type);

  const handlePaymentInitiated = async (transactionUrl?: string) => {
    if (transactionUrl) {
      window.location.href = transactionUrl;
    } else {
      await placeOrder();
    }
  };

  return (
    <div
      className={cn({"cursor-pointer": !active})}
      onClick={() => (paymentMethods.length ? setStep("payment") : {})}
    >
      <Form {...form}>
        <form className="border-accent flex flex-col gap-2 pb-4">
          <div className="flex w-full flex-col gap-2 border-t py-4">
            <div className="flex h-10 items-center justify-between">
              <Heading
                className={cn({"text-muted-foreground": !active})}
                desktopSize="xl"
                font="serif"
                mobileSize="xl"
                tag="h3"
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
                      onValueChange={field.onChange}
                      value={type}
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
                disabled={!type}
                loading={isSubmitting}
                onInitiated={handlePaymentInitiated}
                type={type}
              />
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
