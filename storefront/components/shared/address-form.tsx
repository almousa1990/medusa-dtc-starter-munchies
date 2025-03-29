import type {HttpTypes} from "@medusajs/types";
import type {BaseRegionCountry} from "@medusajs/types/dist/http/region/common";

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
import React from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";

import {Cta} from "./button";
import {InputPhone} from "./input-phone";
import {NativeSelect} from "./native-select";
import {Navigation} from "lucide-react";
import {useGeolocationAddress} from "@/hooks/use-geolocation-address";

const formSchema = z.object({
  address_1: z.string().min(3, {message: "مطلوب"}),
  address_2: z.string().min(3, {message: "مطلوب"}),
  city: z.string().min(3, {message: "مطلوب"}),
  country_code: z.string().min(2, {message: "مطلوب"}),
  first_name: z.string().min(3, {message: "مطلوب"}),
  last_name: z.string().min(3, {message: "مطلوب"}),
  phone: z.string({required_error: "مطلوب"}).min(9, {
    message: "رقم الجوال يجب أن يكون ٩ خانات على الأقل",
  }),
  postal_code: z.string().optional(),
  province: z.string().optional(),
});

interface AddressFormProps {
  address?: Partial<HttpTypes.StoreCustomerAddress>;
  countries?: HttpTypes.StoreRegionCountry[];
  onSubmit: (
    data:
      | HttpTypes.StoreCreateCustomerAddress
      | HttpTypes.StoreUpdateCustomerAddress,
  ) => Promise<{success: boolean}>;
}

export default function AddressForm({
  address,
  countries,
  onSubmit,
}: AddressFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      address_1: address?.address_1 ?? "",
      address_2: address?.address_2 ?? "",
      city: address?.city ?? "",
      country_code: address?.country_code ?? "sa",
      first_name: address?.first_name ?? "",
      last_name: address?.last_name ?? "",
      phone: address?.phone ?? "",
      postal_code: address?.postal_code ?? "",
      province: address?.province ?? "",
    },
    resolver: zodResolver(formSchema),
    mode: "onSubmit", // validate only when submitting
    reValidateMode: "onSubmit", // don't re-validate on blur/change
  });

  const {getAddressFromCurrentLocation, isLoading, isSupported} =
    useGeolocationAddress();

  const handleLocationClick = async () => {
    const values = await getAddressFromCurrentLocation();
    if (values) {
      form.setValue("address_1", values.address_1, {shouldDirty: true});
      form.setValue("address_2", values.address_2, {shouldDirty: true});
      form.setValue("city", values.city, {shouldDirty: true});
      form.setValue("province", values.province ?? "", {shouldDirty: true});
      form.setValue("postal_code", values.postal_code ?? "", {
        shouldDirty: true,
      });
      form.setValue("country_code", values.country_code, {shouldDirty: true});
    }
  };

  return (
    <Form {...form}>
      <div className="grid gap-4">
        <div className="flex justify-end">
          <Cta
            disabled={!isSupported}
            size="sm"
            loading={isLoading}
            className="w-full"
            onClick={handleLocationClick}
            type="button"
            variant="secondary"
          >
            <Navigation />
            استخدام موقعي الحالي
          </Cta>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <FormField
            control={form.control}
            name="first_name"
            render={({field}) => (
              <FormItem>
                <FormLabel>الأسم الأول</FormLabel>
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
                <FormLabel>العائلة</FormLabel>
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
            name="country_code"
            render={({field}) => (
              <FormItem>
                <FormLabel>الدولة</FormLabel>
                <FormControl>
                  <NativeSelect
                    options={
                      countries
                        ?.filter(
                          (
                            country,
                          ): country is {
                            metadata: {ar_name: string};
                            display_name: string;
                            iso_2: string;
                          } & BaseRegionCountry =>
                            !!country.display_name && !!country.iso_2,
                        )
                        .map(({metadata, iso_2}) => ({
                          label: metadata.ar_name,
                          value: iso_2,
                        })) || []
                    }
                    placeholder="الدولة"
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
            name="city"
            render={({field}) => (
              <FormItem>
                <FormLabel>المدينة</FormLabel>
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
            name="address_1"
            render={({field}) => (
              <FormItem>
                <FormLabel>الحي</FormLabel>
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
            name="address_2"
            render={({field}) => (
              <FormItem>
                <FormLabel>الشارع</FormLabel>
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
            name="postal_code"
            render={({field}) => (
              <FormItem>
                <FormLabel>الرمز البريدي</FormLabel>
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
        </div>

        {/* Save button - onSave must be called explicitly */}
        <Cta
          className="w-full"
          disabled={!form.formState.isDirty}
          loading={form.formState.isSubmitting}
          onClick={form.handleSubmit(async (data) => {
            const country_name = (
              countries?.find(
                (c) => c.iso_2 === data.country_code,
              ) as HttpTypes.StoreRegionCountry & {metadata: {ar_name: string}}
            )?.metadata.ar_name;

            await onSubmit({...data, metadata: {country_name}});
          })}
          type="button"
        >
          حفظ
        </Cta>
      </div>
    </Form>
  );
}
