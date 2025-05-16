import type {MerchifyRegionCountry} from "@/types";
import type {HttpTypes} from "@medusajs/types";

import medusaError from "@/utils/medusa/error";
import {unstable_cache} from "next/cache";

import client from "./client";

export const listRegions = unstable_cache(
  async function () {
    return client.store.region
      .list({}, {next: {tags: ["regions"]}})
      .then(({regions}) => regions)
      .catch(medusaError);
  },
  ["regions"],
  {
    revalidate: 120,
  },
);

export type CountryListItem = {
  code: string;
  currency: {
    code: string;
    symbol: string;
  };
  name: string;
};
export const listCountries = unstable_cache(
  async function (): Promise<CountryListItem[]> {
    const regions = await listRegions();
    const countries = regions.flatMap((region) => {
      if (!region.countries) return [];

      return region.countries.map((country) => ({
        code: country.iso_2 as string,
        currency: {
          code: region.currency_code,
          symbol: new Intl.NumberFormat("en-US", {
            currency: region.currency_code,
            style: "currency",
          })
            .format(9)
            .split("9")[0],
        },
        name:
          (country as MerchifyRegionCountry).metadata?.ar_name ??
          country.display_name ??
          "unkown",
      }));
    });

    return countries.filter(
      (country, index, self) =>
        index === self.findIndex((t) => t?.code === country?.code),
    );
  },
  ["countries"],
  {
    revalidate: 120,
  },
);

const regionMap = new Map<string, HttpTypes.StoreRegion>();

export const getRegion = unstable_cache(
  async function (countryCode: string) {
    try {
      if (regionMap.has(countryCode)) {
        return regionMap.get(countryCode);
      }

      const regions = await listRegions();

      if (!regions) {
        return null;
      }

      regions.forEach((region) => {
        region.countries?.forEach((c) => {
          regionMap.set(c?.iso_2 ?? "", region);
        });
      });

      const region = countryCode
        ? regionMap.get(countryCode)
        : regionMap.get("sa");

      return region;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return null;
    }
  },
  ["region"],
  {
    revalidate: 120,
  },
);
