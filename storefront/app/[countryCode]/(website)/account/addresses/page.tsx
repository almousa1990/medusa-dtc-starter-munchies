import {Metadata} from "next";
import {notFound} from "next/navigation";
import {HttpTypes} from "@medusajs/types";
import AddAddress from "./_parts/add-address";
import EditAddress from "./_parts/edit-address";
import {getCustomer} from "@/data/medusa/customer";
import {getRegion} from "@/data/medusa/regions";
import {Separator} from "@merchify/ui";

export const metadata: Metadata = {
  title: "Addresses",
  description: "View your addresses",
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
        <h3 className="text-lg font-medium">العناوين</h3>
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
            <EditAddress region={region} address={address} key={address.id} />
          );
        })}
      </div>
    </div>
  );
};
