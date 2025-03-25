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

const formSchema = z.object({
  address_1: z.string({required_error: "مطلوب"}),
  address_2: z.string({required_error: "مطلوب"}),
  city: z.string({required_error: "مطلوب"}),
  country_code: z.string({required_error: "مطلوب"}).min(2, {
    message: "مطلوب",
  }),
  first_name: z.string({required_error: "مطلوب"}),
  last_name: z.string({required_error: "مطلوب"}),
  phone: z.string({required_error: "مطلوب"}).min(9, {
    message: "رقم الجوال يجب أن يكون ٩ خانات على الأقل",
  }),
  postal_code: z.string().optional(),
  province: z.string().optional(),
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
  });

  // Save handler that the parent can trigger
  const onSave = async () => {
    try {
      const values = await form.trigger(); // Validate fields first
      if (!values) return;

      const data = await onSubmit(form.getValues());
      if (data.success) {
        form.reset();
      }
    } catch (e) {
      console.error("Address save error:", e);
    }
  };

  const getLocationAndFillForm = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const {latitude, longitude} = position.coords;

      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyD6tgox_10l0s1CUC6t26HhEbkkoCd_He0&language=ar`,
        );
        const data = await response.json();

        const result = data.results[0];
        const components = result.address_components;

        const getComponent = (type: string) =>
          components.find((c: any) => c.types.includes(type))?.short_name || "";

        form.setValue(
          "address_1",
          getComponent("sublocality") || getComponent("neighborhood"),
          {shouldDirty: true},
        );
        form.setValue("address_2", getComponent("route"), {shouldDirty: true});
        form.setValue("city", getComponent("locality"), {shouldDirty: true});
        form.setValue("province", getComponent("administrative_area_level_1"), {
          shouldDirty: true,
        });
        form.setValue("postal_code", getComponent("postal_code"), {
          shouldDirty: true,
        });
        form.setValue("country_code", getComponent("country").toLowerCase(), {
          shouldDirty: true,
        });
      } catch (error) {
        console.error("Failed to fetch location info", error);
        alert("حدث خطأ أثناء جلب الموقع.");
      }
    });
  };

  return (
    <Form {...form}>
      <div className="grid gap-4">
        <div className="flex justify-end">
          <Cta
            className="w-full"
            onClick={getLocationAndFillForm}
            type="button"
            variant="outline"
          >
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
                  <NativeSelect
                    options={
                      countries
                        ?.filter(
                          (
                            country,
                          ): country is {
                            display_name: string;
                            iso_2: string;
                          } & BaseRegionCountry =>
                            !!country.display_name && !!country.iso_2,
                        )
                        .map(({display_name, iso_2}) => ({
                          label: display_name,
                          value: iso_2,
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
                  <InputPhone placeholder="" {...field} />
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
          onClick={onSave}
          type="button"
        >
          حفظ
        </Cta>
      </div>
    </Form>
  );
};

export default AddressForm;
