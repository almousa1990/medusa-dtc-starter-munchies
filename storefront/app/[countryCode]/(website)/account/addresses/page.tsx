import type {HttpTypes} from "@medusajs/types";
import type {Metadata} from "next";

import Heading from "@/components/shared/typography/heading";
import {getCustomer} from "@/data/medusa/customer";
import {getRegion} from "@/data/medusa/regions";
import {Separator} from "@merchify/ui";
import {notFound} from "next/navigation";

import AddAddress from "./_parts/add-address";
import EditAddress from "./_parts/edit-address";

export const metadata: Metadata = {
  description: "View your addresses",
  title: "Addresses",
};

export default async function AddressPage(props: {
  params: Promise<{countryCode: string}>;
}) {
  const params = await props.params;
  const {countryCode} = params;
  const customer = await getCustomer();
  const region = await getRegion(countryCode);

  if (!customer || !region) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Heading mobileSize="lg" tag="h3">
          العناوين
        </Heading>
        <p className="text-muted-foreground text-sm">تحديث عناوينك المسجلة</p>
      </div>
      <Separator />
      <AddressBook customer={customer} region={region} />
    </div>
  );
}

type AddressBookProps = {
  customer: HttpTypes.StoreCustomer;
  region: HttpTypes.StoreRegion;
};

const AddressBook: React.FC<AddressBookProps> = ({customer, region}) => {
  const {addresses} = customer;
  return (
    <div className="w-full">
      <div className="mt-4 grid flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
        <AddAddress region={region} />
        {addresses.map((address) => {
          return (
            <EditAddress address={address} key={address.id} region={region} />
          );
        })}
      </div>
    </div>
  );
};
