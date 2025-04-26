"use client";

import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRef} from "react";
import {
  Button,
  Checkbox,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@merchify/ui";
import {NativeSelect} from "./native-select";
import {StoreCustomer} from "@medusajs/types";
import {Cta} from "./button";
import {useToast} from "@merchify/ui";

const creditCardSchema = z.object({
  number: z
    .string({
      required_error: "رقم البطاقة مطلوب",
    })
    .min(19, "رقم البطاقة غير مكتمل") // 16 digits + 3 spaces
    .regex(/^(\d{4} ){3}\d{4}$/, "صيغة رقم البطاقة غير صحيحة"),

  month: z
    .string({
      required_error: "الشهر مطلوب",
    })
    .regex(/^(0[1-9]|1[0-2])$/, "الشهر غير صحيح"),

  year: z
    .string({
      required_error: "السنة مطلوبة",
    })
    .regex(/^\d{2}$/, "السنة غير صحيح")
    .refine((val) => {
      const fullYear = +("20" + val); // example: "25" => 2025
      return fullYear >= new Date().getFullYear();
    }, "السنة منتهية"),

  cvc: z
    .string({
      required_error: "رمز التحقق مطلوب",
    })
    .min(3, "رمز التحقق قصير")
    .max(4, "رمز التحقق طويل")
    .regex(/^\d+$/, "رمز التحقق يجب أن يحتوي على أرقام فقط"),

  agreement: z.boolean(),
});

interface CreditCardFormProps {
  customer: StoreCustomer;
  onTokenCreated: (token: string) => void;
}

export function CreditCardForm(props: CreditCardFormProps) {
  const {onTokenCreated, customer} = props;
  const {toast} = useToast();

  const form = useForm<z.infer<typeof creditCardSchema>>({
    resolver: zodResolver(creditCardSchema),
    defaultValues: {
      number: "",
      month: "",
      year: "",
      cvc: "",
      agreement: false,
    },
  });

  const cvcRef = useRef<HTMLInputElement>(null);

  const currentYear = new Date().getFullYear();
  const onSubmit = async (values: z.infer<typeof creditCardSchema>) => {
    try {
      const normalizedCardNumber = values.number.replace(/\s/g, ""); // remove all spaces

      const data = {
        publishable_api_key: process.env.NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY,
        save_only: "true",
        name: `${customer.first_name} ${customer.last_name}`,
        number: normalizedCardNumber,
        month: values.month,
        year: values.year,
        cvc: values.cvc,
      };

      const res = await fetch("https://api.moyasar.com/v1/tokens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        console.error("Failed to create token:", errorBody);

        if (errorBody?.type === "validation_error" && errorBody.errors) {
          const fieldErrors = errorBody.errors;

          let handled = false;

          for (const field in fieldErrors) {
            const messages = fieldErrors[field];
            if (messages?.length > 0) {
              // If the field matches one of our form fields, set field-specific error
              if (["number", "month", "year", "cvc"].includes(field)) {
                form.setError(field as keyof z.infer<typeof creditCardSchema>, {
                  type: "server",
                  message: messages[0], // show the first error for that field
                });
                handled = true;
              }
            }
          }

          if (!handled) {
            // If none of the errors matched fields, show a global/root error
            form.setError("root", {
              type: "server",
              message: "خطأ في البيانات المدخلة، يرجى التحقق من الحقول",
            });
          }
        } else if (errorBody?.message) {
          // General API error
          form.setError("root", {
            type: "server",
            message: errorBody.message,
          });
        } else {
          // Unknown error
          form.setError("root", {
            type: "server",
            message: "حدث خطأ أثناء إنشاء رمز البطاقة",
          });
        }

        // Always throw to stop the flow
        throw new Error("تأكد من البيانات المدخلة");
      }

      const response = await res.json();

      if (!response.id) {
        console.error("Invalid token response:", response);
        throw new Error("الاستجابة من مويسار غير صحيحة");
      }

      const token = response.id;
      onTokenCreated(token);
      console.log("Token created:", token);

      // You can continue your payment flow here
    } catch (error) {
      console.error(error);

      toast({
        description: "حدث خطأ أثناء المعالجة",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid gap-4">
          {/* Card Number */}
          <FormField
            control={form.control}
            name="number"
            render={({field}) => (
              <FormItem>
                <FormLabel>رقم البطاقة</FormLabel>
                <FormControl>
                  <Input
                    placeholder="رقم البطاقة"
                    inputMode="numeric"
                    dir="ltr"
                    maxLength={19}
                    {...field}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, "");
                      value = value.slice(0, 16);
                      const parts = value.match(/.{1,4}/g) || [];
                      field.onChange(parts.join(" "));
                      if (parts.join("").length === 16 && cvcRef.current) {
                        cvcRef.current.focus();
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Expiry and CVC */}
          <div className="grid grid-cols-2 gap-4">
            {/* Month */}
            <FormField
              control={form.control}
              name="month"
              render={({field}) => (
                <FormItem>
                  <FormLabel>الشهر</FormLabel>
                  <FormControl>
                    <NativeSelect
                      placeholder="الشهر"
                      options={Array.from({length: 12}, (_, i) => {
                        const month = i + 1;
                        const formatted = month.toString().padStart(2, "0"); // always 2 digits
                        return {
                          value: formatted,
                          label: formatted,
                        };
                      })}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Year */}
            <FormField
              control={form.control}
              name="year"
              render={({field}) => (
                <FormItem>
                  <FormLabel>السنة</FormLabel>
                  <FormControl>
                    <NativeSelect
                      placeholder="السنة"
                      options={Array.from({length: 10}, (_, i) => {
                        const year = currentYear + i;
                        return {
                          value: String(year).slice(2), // full year for backend (e.g., 2025)
                          label: String(year).slice(2), // only last two digits for display (e.g., "25")
                        };
                      })}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* CVC */}
          <FormField
            control={form.control}
            name="cvc"
            render={({field}) => (
              <FormItem>
                <FormLabel>رمز التحقق (CVC)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="CVC"
                    inputMode="numeric"
                    dir="ltr"
                    maxLength={4}
                    {...field}
                    ref={cvcRef}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, "");
                      value = value.slice(0, 4);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="agreement"
            render={({field}) => (
              <FormItem className="flex flex-row items-start">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>
                  باستمرارك بالدفع فأنت موافق على الشروط والأحكام
                </FormLabel>
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button */}
        <Cta
          className="w-full"
          disabled={!form.formState.isDirty || !form.getValues().agreement}
          loading={form.formState.isSubmitting}
          type="submit"
        >
          الدفع
        </Cta>
      </form>
    </Form>
  );
}
