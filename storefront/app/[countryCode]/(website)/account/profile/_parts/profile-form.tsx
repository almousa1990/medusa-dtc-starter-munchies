"use client";

import type {HttpTypes} from "@medusajs/types";

import {updateCustomer} from "@/actions/medusa/customer";
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
import {notFound} from "next/navigation";
import {useForm} from "react-hook-form";
import {z} from "zod";

const profileFormSchema = z.object({
  email: z.string().email(),
  first_name: z.string().min(2, {
    message: "مطلوب",
  }),
  last_name: z.string().min(2, {
    message: "مطلوب",
  }),
  phone: z.string().min(10),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

type ProfileFormProps = {
  customer: HttpTypes.StoreCustomer;
  regions: HttpTypes.StoreRegion[];
};

export default function ProfileForm({customer, regions}: ProfileFormProps) {
  if (!customer || !regions) {
    console.log("not found");
    notFound();
  }

  const form = useForm<ProfileFormValues>({
    defaultValues: {
      email: customer.email || "",
      first_name: customer.first_name || "",
      last_name: customer.last_name || "",
      phone: customer.phone || "",
    },
    mode: "onChange",
    resolver: zodResolver(profileFormSchema),
  });

  async function onSubmit(data: ProfileFormValues) {
    await updateCustomer(data);
  }

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
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
