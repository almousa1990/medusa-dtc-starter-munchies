"use client";
import type {HttpTypes} from "@medusajs/types";

import {addPromotions, removePromotions} from "@/actions/medusa/cart";
import {Cta} from "@/components/shared/button";
import Body from "@/components/shared/typography/body";
import {convertToLocale} from "@/utils/medusa/money";
import {zodResolver} from "@hookform/resolvers/zod";
import {
  Badge,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  cn,
} from "@merchify/ui";
import {X} from "lucide-react";
import {useForm} from "react-hook-form";
import {z} from "zod";

export const formSchema = z.object({
  code: z.string(),
});

export default function PromotionForm({cart}: {cart: HttpTypes.StoreCart}) {
  const {promotions = []} = cart;

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      code: "",
    },
    resolver: zodResolver(formSchema),
  });

  const removePromotionCode = async (code: string) => {
    if (!code) {
      return;
    }
    const codes = [code];
    const {cart} = await removePromotions(codes);
    const isPresent = cart.promotions.some((p) => p.code === code);
    if (isPresent) {
      throw new Error("Couldn't remove promotion code.");
    }
  };

  const addPromotionCode = async (values: z.infer<typeof formSchema>) => {
    if (!values.code) {
      return;
    }

    const codes = [values.code];

    const {cart} = await addPromotions(codes);
    const isValidCode = cart.promotions.some((p) => p.code === values.code);
    if (!isValidCode) {
      form.setError("code", {
        message: `الكود (${values.code.toUpperCase()}) منتهي أو غير صحيح.`,
        type: "manual",
      });
    } else {
      form.reset();
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          className={cn("flex gap-2")}
          onSubmit={form.handleSubmit(addPromotionCode)}
        >
          <FormField
            control={form.control}
            name="code"
            render={({field}) => (
              <FormItem className="w-full overflow-visible">
                <FormControl>
                  <Input
                    className="uppercase"
                    placeholder="SUMMER_20"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Cta
            disabled={!form.getValues("code").length}
            loading={form.formState.isSubmitting}
          >
            تطبيق
          </Cta>
        </form>
      </Form>
      {promotions.length > 0 && (
        <div className="mt-2 flex w-full items-center">
          <div className="flex w-full flex-col gap-1">
            {promotions.map((promotion) => {
              return (
                <div
                  className="flex w-full max-w-full items-center justify-between"
                  data-testid="discount-row"
                  key={promotion.id}
                >
                  <Body className="items-baseline gap-x-1 pr-1 text-sm">
                    <span className="truncate" data-testid="discount-code">
                      <Badge
                        className={cn({
                          "bg-background": !promotion.is_automatic,
                        })}
                        size="small"
                        variant={promotion.is_automatic ? "primary" : "outline"}
                      >
                        {promotion.code?.toUpperCase()}
                      </Badge>{" "}
                      (
                      {promotion.application_method?.value !== undefined &&
                        promotion.application_method.currency_code !==
                          undefined && (
                          <>
                            {promotion.application_method.type === "percentage"
                              ? `${promotion.application_method.value}%`
                              : convertToLocale({
                                  amount: Number(
                                    promotion.application_method.value,
                                  ),
                                  currency_code:
                                    promotion.application_method.currency_code,
                                })}
                          </>
                        )}
                      )
                      {/* {promotion.is_automatic && (
                          <Tooltip content="This promotion is automatically applied">
                            <InformationCircleSolid className="inline text-zinc-400" />
                          </Tooltip>
                        )} */}
                    </span>
                  </Body>
                  {!promotion.is_automatic && (
                    <button
                      className="flex items-center"
                      data-testid="remove-discount-button"
                      onClick={() => {
                        if (!promotion.code) {
                          return;
                        }

                        removePromotionCode(promotion.code);
                      }}
                    >
                      <X className="size-4" />
                      <span className="sr-only">حذف كود الخصم</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
