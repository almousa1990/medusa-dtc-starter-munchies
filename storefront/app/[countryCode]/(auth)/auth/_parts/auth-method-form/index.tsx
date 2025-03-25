"use client";

import {generateOtp} from "@/actions/medusa/auth";
import {Cta} from "@/components/shared/button";
import {InputPhone} from "@/components/shared/input-phone";
import {zodResolver} from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@merchify/ui";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
const phoneRegex = /^5\d{8}$/; // Ensures exactly 9 digits, starting with '5'

interface AuthMethodFormProps {
  onErorr: (message: string) => void;
  onSuccess: (
    stateKey: string,
    type: "email" | "phone",
    identifier?: string,
  ) => void;
}

const formSchema = z.object({
  email: z.string().email().or(z.literal("")).optional(),
  phone: z
    .string()
    .optional()
    .refine((value) => !value || phoneRegex.test(value), {
      message:
        "Invalid phone number format. It must be exactly 9 digits and start with '5'.",
    }),
});

export default function AuthMethodForm({
  onErorr,
  onSuccess,
}: AuthMethodFormProps) {
  const [method, setMethod] = useState<"email" | "phone">("phone");

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
      phone: "",
    },
    resolver: zodResolver(formSchema),
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const identifier = values.phone || values.email;
    const data = await generateOtp({
      identifier,
      type: method,
    });

    if (data.success) {
      form.reset();
      onSuccess(data.stateKey, method, identifier);
    } else {
      onErorr(data.error);
    }
  }

  const handleMethodChange = (method: "email" | "phone") => {
    setMethod(method);
  };

  return (
    <>
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <>
            {method == "email" ? (
              <FormField
                control={form.control}
                name="email"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>البريد الالكتروني</FormLabel>
                    <FormControl>
                      <Input placeholder="" type="email" {...field} />
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
                      <InputPhone placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </>

          <div>
            <Cta
              data-testid="sign-in-button"
              disabled={!form.formState.isDirty || !form.formState.isValid}
              loading={form.formState.isSubmitting}
            >
              الاستمرار
            </Cta>
          </div>
        </form>
      </Form>

      {method == "email" ? (
        <Cta className="w-full" onClick={() => handleMethodChange("phone")}>
          تسجيل الدخول برقم الجوال
        </Cta>
      ) : (
        <Cta className="w-full" onClick={() => handleMethodChange("email")}>
          تسجيل الدخول بالبريد الالكتروني
        </Cta>
      )}
    </>
  );
}
