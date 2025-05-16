import {PaymentSourceType} from "@/types";
import {z} from "zod";

const cardSchema = z.object({
  cvc: z
    .string({required_error: "رمز التحقق مطلوب"})
    .min(3, "رمز التحقق قصير")
    .max(4, "رمز التحقق طويل")
    .regex(/^\d+$/, "رمز التحقق يجب أن يحتوي على أرقام فقط"),

  month: z
    .string({required_error: "الشهر مطلوب"})
    .regex(/^(0[1-9]|1[0-2])$/, "الشهر غير صحيح"),

  number: z
    .string({required_error: "رقم البطاقة مطلوب"})
    .min(19, "رقم البطاقة غير مكتمل")
    .regex(/^(\d{4} ){3}\d{4}$/, "صيغة رقم البطاقة غير صحيحة"),

  year: z
    .string({required_error: "السنة مطلوبة"})
    .regex(/^\d{2}$/, "السنة غير صحيح")
    .refine((val) => {
      const fullYear = +("20" + val);
      return fullYear >= new Date().getFullYear();
    }, "السنة منتهية"),
});

export const PaymentSourceTypeSchema = z.nativeEnum(PaymentSourceType);

// Optional inferred type (already defined by the enum, but sometimes helpful)

export const formSchema = z
  .object({
    agreement: z
      .boolean()
      .refine((val) => val === true, {message: "يجب الموافقة على الشروط"}),
    card: z.any().optional(),
    type: PaymentSourceTypeSchema,
  })
  .superRefine((data, ctx) => {
    if (data.type === "creditcard") {
      const result = cardSchema.safeParse(data.card);
      if (!result.success) {
        for (const issue of result.error.issues) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: issue.message,
            path: ["card", ...(issue.path ?? [])],
          });
        }
      }
    }
  })
  .transform((data) => {
    if (data.type !== "creditcard") {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {card, ...rest} = data;
      return rest;
    }
    return data;
  });
