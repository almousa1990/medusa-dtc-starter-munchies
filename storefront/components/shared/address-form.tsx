import {HttpTypes} from "@medusajs/types";
import React from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@merchify/ui";
import Input from "./input";
import {Cta} from "./button";
import InputCombobox from "./input-combobox";

const formSchema = z.object({
  first_name: z.string({required_error: "مطلوب"}),
  last_name: z.string({required_error: "مطلوب"}),
  address_1: z.string({required_error: "مطلوب"}),
  address_2: z.string({required_error: "مطلوب"}),
  postal_code: z.string().optional(),
  city: z.string({required_error: "مطلوب"}),
  country_code: z.string({required_error: "مطلوب"}).min(2, {
    message: "مطلوب",
  }),
  province: z.string().optional(),
  phone: z.string({required_error: "مطلوب"}).min(10, {
    message: "رقم الجوال يجب أن يكون ١٠ خانات على الأقل",
  }),
});

interface AddressFormProps {
  address?: HttpTypes.StoreCustomerAddress;
  countries?: HttpTypes.StoreRegionCountry[];
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<{success: boolean}>;
}

const AddressForm: React.FC<AddressFormProps> = ({
  address,
  countries,
  onSubmit,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: address?.first_name ?? "",
      last_name: address?.last_name ?? "",
      address_1: address?.address_1 ?? "",
      address_2: address?.address_2 ?? "",
      postal_code: address?.postal_code ?? "",
      city: address?.city ?? "",
      country_code: address?.country_code ?? "sa",
      province: address?.province ?? "",
      phone: address?.phone ?? "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    // async request which may result error
    try {
      const data = await onSubmit(values);
      if (data.success) {
        form.reset();
      }
    } catch (e) {
      // handle your error
    }
  };
  const handleSubmitError = async (values: any) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="grid grid-cols-1 gap-3 md:grid-cols-2"
      >
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
              <FormLabel>العائلة</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="country_code"
          render={({field}) => (
            <FormItem>
              <FormLabel>الدولة</FormLabel>
              <FormControl>
                <InputCombobox
                  defaultValue={address?.country_code}
                  options={
                    countries
                      ?.filter(
                        (
                          country,
                        ): country is {
                          display_name: string;
                          iso_2: string;
                        } & HttpTypes.StoreRegionCountry =>
                          !!country.display_name && !!country.iso_2,
                      )
                      .map(({display_name, iso_2}) => ({
                        id: iso_2,
                        label: display_name,
                      })) || []
                  }
                  placeholder="الدولة"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({field}) => (
            <FormItem>
              <FormLabel>المدينة</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address_1"
          render={({field}) => (
            <FormItem>
              <FormLabel>الحي</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address_2"
          render={({field}) => (
            <FormItem>
              <FormLabel>الشارع</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="postal_code"
          render={({field}) => (
            <FormItem>
              <FormLabel>الرمز البريدي</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
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
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Cta className="mt-6" data-testid="submit-address-button">
          حفظ
        </Cta>
      </form>
    </Form>
  );
};

export default AddressForm;
