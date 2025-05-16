"use client";
import {setShippingMethod} from "@/actions/medusa/order";
import {useCheckout} from "@/components/context/checkout-context";
import {Cta} from "@/components/shared/button";
import Body from "@/components/shared/typography/body";
import Heading from "@/components/shared/typography/heading";
import {convertToLocale} from "@/utils/medusa/money";
import {zodResolver} from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  Label,
  RadioGroup,
  RadioGroupItem,
  cn,
} from "@merchify/ui";
import {Check} from "lucide-react";
import {useEffect} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";

const formSchema = z.object({
  shipping_method_id: z.string().optional(),
});

export default function Delivery({active}: {active: boolean}) {
  const {cart, setStep, shippingMethods} = useCheckout();

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
    formState: {isSubmitting},
    handleSubmit,
    reset,
  } = form;

  useEffect(() => {
    if (!active) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const activeShippingMethodPrice = convertToLocale({
    amount: activeShippingMethod?.amount || 0,
    currency_code,
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (data.shipping_method_id) {
      if (data.shipping_method_id != activeShippingMethod?.id) {
        await setShippingMethod(data.shipping_method_id);
      }
      setStep("payment");
    }
  };

  const isFilled = !active && !!activeShippingMethod;

  return (
    <div
      className={cn({"cursor-pointer": !active})}
      onClick={() => (shippingMethods.length ? setStep("delivery") : {})}
    >
      <Form {...form}>
        <form
          className="flex flex-col gap-2 border-t py-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex h-10 items-center justify-between">
            <Heading
              className={cn({"text-muted-foreground": !active})}
              desktopSize="xl"
              font="serif"
              mobileSize="xl"
              tag="h3"
            >
              شركة الشحن
            </Heading>
            {isFilled && (
              <div className="bg-accent flex size-8 items-center justify-center rounded-full">
                <Check className="size-4" />
              </div>
            )}
          </div>
          {isFilled && (
            <div className="flex flex-1 flex-col gap-4">
              <Body className="text-muted-foreground text-sm" font="sans">
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
                      className="gap-0"
                      dir="rtl"
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      {shippingMethods.map((item) => {
                        const price = convertToLocale({
                          amount: item.amount,
                          currency_code,
                        });

                        const selected = field.value == item.id;

                        return (
                          <div
                            className={cn(
                              "-mt-px overflow-hidden border first:rounded-t-md last:rounded-b-md",
                              {
                                "bg-muted border-primary relative z-10":
                                  selected,
                              },
                            )}
                            key={item.id}
                            onClick={(e) => {
                              const target = e.target as HTMLElement;

                              // Prevent triggering if clicking inside the radio or label
                              if (
                                target.closest("label") || // this might include the Label or any nested child like <Body>
                                target.closest("input[type='radio']")
                              ) {
                                return;
                              }

                              field.onChange(item.id);
                            }}
                          >
                            <div className="flex items-center gap-3 p-4">
                              <RadioGroupItem id={item.id} value={item.id} />
                              <Label
                                className="w-full font-normal"
                                htmlFor={item.id}
                              >
                                <div className="flex w-full items-center justify-between">
                                  <div>
                                    <Body
                                      className="font-medium"
                                      font="sans"
                                      mobileSize="sm"
                                    >
                                      {item.name}
                                    </Body>
                                    <Body
                                      className="text-muted-foreground block"
                                      mobileSize="sm"
                                    >
                                      {item.type.description}
                                    </Body>
                                  </div>
                                  <Body font="sans" mobileSize="sm">
                                    {price}
                                  </Body>
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
              <Cta
                className="w-full"
                disabled={!form.formState.isValid}
                loading={isSubmitting}
                type="submit"
              >
                تأكيد شركة الشحن
              </Cta>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
