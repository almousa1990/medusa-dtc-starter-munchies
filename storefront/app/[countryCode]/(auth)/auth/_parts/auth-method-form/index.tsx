"use client";

import {generateOtp} from "@/actions/medusa/auth";
import {Cta} from "@/components/shared/button";
import {InputPhone} from "@/components/shared/input-phone";
import Heading from "@/components/shared/typography/heading";
import {zodResolver} from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  useToast,
} from "@merchify/ui";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
const phoneRegex = /^5\d{8}$/; // Ensures exactly 9 digits, starting with '5'

const formSchema = z
  .object({
    email: z.string().email().or(z.literal("")).optional(),
    phone: z
      .string()
      .optional()
      .refine((value) => !value || phoneRegex.test(value), {
        message: "رقم الجوال غير صحيح.",
      }),
  })
  .superRefine((data, ctx) => {
    if (!data.email && !data.phone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Either email or phone must be provided.",
        path: [], // applies to the whole object
      });
    }
  });

interface AuthMethodFormProps {
  disabled?: boolean;
  onSuccess: (
    stateKey: string,
    type: "email" | "phone",
    identifier?: string,
  ) => void;
}

export default function AuthMethodForm({
  disabled,
  onSuccess,
}: AuthMethodFormProps) {
  const [method, setMethod] = useState<"email" | "phone">("phone");
  const {toast} = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
      phone: "",
    },
    mode: "onSubmit", // validate only when submitting
    reValidateMode: "onSubmit", // don't re-validate on blur/change
    resolver: zodResolver(formSchema),
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (disabled) {
      return;
    }
    const identifier = values.phone || values.email;
    const response = await generateOtp({
      identifier,
      type: method,
    });

    if (response.success) {
      form.reset();
      onSuccess(response.stateKey, method, identifier);
    } else {
      toast({
        description: response.error,
        variant: "destructive",
      });
    }
  }

  const handleMethodChange = (method: "email" | "phone") => {
    form.reset();
    setMethod(method);
  };

  return (
    <>
      <Form {...form}>
        <form
          className="grid w-full gap-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <Heading mobileSize="2xl" tag="h1">
              تسجيل الدخول أو إنشاء حساب جديد
            </Heading>
            <p className="text-muted-foreground text-sm text-balance">
              أدخل {method === "phone" ? "رقم جوالك" : "بريدك الالكتروني"}{" "}
              لتسجيل الدخول أو إنشاء حساب جديد.
            </p>
          </div>
          <>
            {method == "email" ? (
              <FormField
                control={form.control}
                name="email"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>البريد الالكتروني</FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        type="email"
                        {...field}
                        onChange={(value) => {
                          field.onChange(value);
                          form.clearErrors([field.name]);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="phone"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>رقم الجوال</FormLabel>
                    <FormControl>
                      <InputPhone
                        placeholder=""
                        {...field}
                        onChange={(value) => {
                          field.onChange(value);
                          form.clearErrors([field.name]);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </>

          <div>
            <Cta
              className="w-full"
              data-testid="sign-in-button"
              loading={form.formState.isSubmitting}
            >
              الاستمرار
            </Cta>
          </div>
        </form>
      </Form>

      {method == "email" ? (
        <Cta
          className="w-full"
          onClick={() => handleMethodChange("phone")}
          size="sm"
          variant="ghost"
        >
          تسجيل الدخول برقم الجوال
        </Cta>
      ) : (
        <Cta
          className="w-full"
          onClick={() => handleMethodChange("email")}
          size="sm"
          variant="ghost"
        >
          تسجيل الدخول بالبريد الالكتروني
        </Cta>
      )}
    </>
  );
}
