import type {HttpTypes} from "@medusajs/types";

import {signup} from "@/actions/medusa/auth";
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
} from "@merchify/ui";
import {useForm} from "react-hook-form";
import {z} from "zod";
const phoneRegex = /^5\d{8}$/; // Ensures exactly 9 digits, starting with '5'

interface SignupFormProps {
  input: {email?: string; phone?: string};
  onError: (message: string) => void;
  onSuccess: (customer: HttpTypes.StoreCustomer) => void;
}

const formSchema = z.object({
  email: z.string().email("البريد الالكتروني غير صحيح"),
  first_name: z.string().min(3, {message: "مطلوب"}),
  last_name: z.string().min(3, {message: "مطلوب"}),
  phone: z.string().refine((value) => phoneRegex.test(value), {
    message: "رقم الجوال غير صحيح.",
  }),
});

export default function SignupForm({
  input,
  onError,
  onSuccess,
}: SignupFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: input.email ?? "",
      first_name: "",
      last_name: "",
      phone: input.phone ?? "",
    },
    mode: "onSubmit", // validate only when submitting
    reValidateMode: "onSubmit", // don't re-validate on blur/change
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (input.phone) {
      values.phone = input.phone;
    }

    if (input.email) {
      values.phone = input.email;
    }

    const response = await signup(values);

    if (response.success) {
      onSuccess(response.customer);
    } else {
      onError(response.error);
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col items-center gap-2 text-center">
          <Heading mobileSize="2xl" tag="h1">
            إنشاء حساب جديد
          </Heading>
          <p className="text-muted-foreground text-sm text-balance">
            يرجى إدخال معلوماتك لإنشاء حسابك والبدء في استخدام المنصة
          </p>
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({field}) => (
            <FormItem>
              <FormLabel>البريد الالكتروني</FormLabel>
              <FormControl>
                <Input
                  placeholder=""
                  {...field}
                  disabled={!!input.email}
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
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <FormField
            control={form.control}
            name="first_name"
            render={({field}) => (
              <FormItem>
                <FormLabel>الاسم الأول</FormLabel>
                <FormControl>
                  <Input
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
          <FormField
            control={form.control}
            name="last_name"
            render={({field}) => (
              <FormItem>
                <FormLabel>الاسم الأخير</FormLabel>
                <FormControl>
                  <Input
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
        </div>

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
                  disabled={!!input.phone}
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

        <Cta
          className="w-full"
          data-testid="sign-in-button"
          loading={form.formState.isSubmitting}
        >
          الاستمرار
        </Cta>
      </form>
    </Form>
  );
}
