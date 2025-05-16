import type {StoreCustomer} from "@medusajs/types";

import {type Header} from "@/types/sanity.generated";

import Hamburger from ".";

export default async function HamburgerContainer({
  customer,
  sanityData,
}: {
  customer: StoreCustomer | null;
  sanityData: Header;
}) {
  return <Hamburger customer={customer} data={sanityData} />;
}
