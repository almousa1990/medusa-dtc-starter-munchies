import {listCountries} from "@/data/medusa/regions";
import {cn} from "@merchify/ui";

import {Breadcrumb} from "./_parts/breadcrumb";
import {SearchInput} from "./_parts/search-input";
import {ShippingFromDropdown} from "./_parts/shipping-from-dropdown";

export default async function ContextBar({
  breadcrumbItems,
  className,
  countryCode,
}: {
  breadcrumbItems?: {
    href?: string;
    label: string;
  }[];
  className: string;
  countryCode: string;
}) {
  const countries = (await listCountries()).filter(Boolean);

  return (
    <section
      className={cn(
        "mx-auto max-w-xl px-4 sm:px-6 lg:max-w-7xl lg:px-8",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span>الشحن من</span>
            <ShippingFromDropdown
              countries={countries}
              countryCode={countryCode}
            />
          </div>
        </div>

        <div className="relative mt-2 block basis-full">
          <SearchInput />
        </div>
      </div>
      {breadcrumbItems && breadcrumbItems.length && (
        <div className="mt-2">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      )}
    </section>
  );
}
