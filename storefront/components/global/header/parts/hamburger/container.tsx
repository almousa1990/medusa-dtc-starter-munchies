import {listCountries} from "@/data/medusa/regions";
import {type Header} from "@/types/sanity.generated";

import type {Country} from "../../country-selector/country-selector-dialog";

import Hamburger from ".";
import {StoreCustomer} from "@medusajs/types";

export default async function HamburgerContainer({
  sanityData,
  customer,
}: {
  sanityData: Header;
  customer: StoreCustomer | null;
}) {
  const countries = (await listCountries()).filter(Boolean) as Country[];

  return (
    <Hamburger countries={countries} customer={customer} data={sanityData} />
  );
}
