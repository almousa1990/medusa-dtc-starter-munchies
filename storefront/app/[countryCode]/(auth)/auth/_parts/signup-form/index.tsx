import type {HttpTypes} from "@medusajs/types";

import {signup} from "@/actions/medusa/auth";
import {Cta} from "@/components/shared/button";
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

interface SignupFormProps {
  input: {email?: string; phone?: string};
  onErorr: (message: string) => void;
  onSuccess: (customer: HttpTypes.StoreCustomer) => void;
}

const formSchema = z.object({
  email: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  phone: z.string(),
});

export default function SignupForm({
  input,
  onErorr,
  onSuccess,
}: SignupFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: input.email ?? "",
      first_name: "",
      last_name: "",
      phone: input.phone ?? "",
    },
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
      onErorr(response.error);
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({field}) => (
            <FormItem>
              <FormLabel>البريد الالكتروني</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} disabled={input.email} />
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
                  <Input placeholder="" {...field} />
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
                  <Input placeholder="" {...field} />
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
                <Input placeholder="" {...field} disabled={input.phone} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Cta
          data-testid="sign-in-button"
          disabled={!form.formState.isDirty || !form.formState.isValid}
          loading={form.formState.isSubmitting}
        >
          الاستمرار
        </Cta>
      </form>
    </Form>
  );
}
