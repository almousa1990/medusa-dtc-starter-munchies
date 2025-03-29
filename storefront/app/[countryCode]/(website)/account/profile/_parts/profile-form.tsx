"use client";

import {notFound} from "next/navigation";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@merchify/ui";
import {HttpTypes} from "@medusajs/types";
import {Cta} from "@/components/shared/button";
import {updateCustomer} from "@/actions/medusa/customer";

const profileFormSchema = z.object({
  first_name: z.string().min(2, {
    message: "مطلوب",
  }),
  last_name: z.string().min(2, {
    message: "مطلوب",
  }),
  email: z.string().email(),
  phone: z.string().min(10),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

type ProfileFormProps = {
  customer: HttpTypes.StoreCustomer;
  regions: HttpTypes.StoreRegion[];
};

export default function ProfileForm({
  customer,
  regions,
  ...props
}: ProfileFormProps) {
  if (!customer || !regions) {
    console.log("not found");
    notFound();
  }

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      first_name: customer.first_name || "",
      last_name: customer.last_name || "",
      phone: customer.phone || "",
      email: customer.email || "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: ProfileFormValues) {
    await updateCustomer(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="first_name"
          render={({field}) => (
            <FormItem>
              <FormLabel>الأسم الأول</FormLabel>
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
              <FormLabel>اسم العائلة</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({field}) => (
            <FormItem>
              <FormLabel>البريد الالكتروني</FormLabel>
              <FormControl>
                <Input disabled placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({field}) => (
            <FormItem>
              <FormLabel>رقم الجوال</FormLabel>
              <FormControl>
                <Input disabled placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Cta type="submit">تحديث</Cta>
      </form>
    </Form>
  );
}
