import type {CountryListItem} from "@/data/medusa/regions";

import {Cta} from "@/components/shared/button";
import {CountryFlag} from "@/components/shared/country-flag";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@merchify/ui";

export function ShippingFromDropdown({
  countries,
  countryCode,
}: {
  countries: CountryListItem[];
  countryCode: string;
}) {
  const country = countries?.find((c) => c.code == countryCode);
  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger asChild>
        <Cta size="sm" variant="ghost">
          <CountryFlag code={countryCode} />
          {country?.name}
        </Cta>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>اختر مصدر الشحن</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {countries?.map((c) => (
          <DropdownMenuItem className="gap-2" key={c.code}>
            <CountryFlag code={c.code} />
            <span>{c.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
