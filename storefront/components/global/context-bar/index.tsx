import {cn} from "@merchify/ui";
import {SearchInput} from "./_parts/search-input";
import {Breadcrumb} from "./_parts/breadcrumb";
import {ShippingFromDropdown} from "./_parts/shipping-from-dropdown";
import {listCountries} from "@/data/medusa/regions";

export default async function ContextBar({
  className,
  countryCode,
  breadcrumbItems,
}: {
  countryCode: string;
  className: string;
  breadcrumbItems?: {
    label: string;
    href?: string;
  }[];
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
              countryCode={countryCode}
              countries={countries}
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
