"use client";
import {useEffect} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

import {setShippingMethod} from "@/actions/medusa/order";
import {Cta} from "@/components/shared/button";
import Body from "@/components/shared/typography/body";
import Heading from "@/components/shared/typography/heading";
import {convertToLocale} from "@/utils/medusa/money";
import {
  Form,
  FormField,
  FormItem,
  Label,
  RadioGroup,
  RadioGroupItem,
} from "@merchify/ui";
import {useCheckout} from "@/components/context/checkout-context";

const formSchema = z.object({
  shipping_method_id: z.string().optional(),
});

export default function Delivery({active}: {active: boolean}) {
  const {cart, shippingMethods, setStep} = useCheckout();

  const currency_code = cart.currency_code;

  const cartShippingMethod = cart.shipping_methods?.[0];

  const activeShippingMethod = shippingMethods.find(
    ({id}) => id === cartShippingMethod?.shipping_option_id,
  );

  const form = useForm({
    defaultValues: {
      shipping_method_id: cartShippingMethod?.shipping_option_id,
    },
    resolver: zodResolver(formSchema),
  });

  const {
    formState: {isSubmitSuccessful, isSubmitting},
    handleSubmit,
    reset,
  } = form;

  const activeShippingMethodPrice = convertToLocale({
    amount: activeShippingMethod?.amount || 0,
    currency_code,
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (data.shipping_method_id) {
      await setShippingMethod(data.shipping_method_id);
    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      setStep("payment");
      reset();
    }
  }, [isSubmitSuccessful, setStep, reset]);

  const isFilled = !active && !!activeShippingMethod;

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2 border-t py-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex h-10 items-center justify-between">
          <Heading desktopSize="xl" font="serif" mobileSize="xl" tag="h3">
            شركة الشحن
          </Heading>
          {isFilled && (
            <Cta
              onClick={() => setStep("delivery")}
              size="sm"
              variant="outline"
            >
              تعديل
            </Cta>
          )}
        </div>
        {isFilled && (
          <div className="flex flex-1 flex-col gap-4">
            <Body font="sans">
              {activeShippingMethod.name} ({activeShippingMethodPrice})
            </Body>
          </div>
        )}
        {active && (
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="shipping_method_id"
              render={({field}) => (
                <FormItem>
                  <RadioGroup
                    dir="rtl"
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    {shippingMethods.map((item) => {
                      const price = convertToLocale({
                        amount: item.amount,
                        currency_code,
                      });

                      return (
                        <div className="rounded-md border p-4" key={item.id}>
                          <div className="flex items-center gap-3">
                            <RadioGroupItem id={item.id} value={item.id} />
                            <Label className="w-full" htmlFor={item.id}>
                              <div className="flex w-full items-center justify-between">
                                <Body font="sans">{item.name}</Body>
                                <Body font="sans">{price}</Body>
                              </div>
                            </Label>
                          </div>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </FormItem>
              )}
            />
            <Cta className="w-full" loading={isSubmitting} type="submit">
              تأكيد شركة الشحن
            </Cta>
          </div>
        )}
      </form>
    </Form>
  );
}
