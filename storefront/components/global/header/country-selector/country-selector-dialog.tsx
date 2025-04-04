"use client";

import {useCountryCode} from "@/components/context/country-code-context";
import Icon from "@/components/shared/icon";
import {
  CloseDialog,
  OpenDialog,
  SideDialog,
} from "@/components/shared/side-dialog";
import Body from "@/components/shared/typography/body";
import Heading from "@/components/shared/typography/heading";
import config from "@/config";
import {Dialog, Title} from "@radix-ui/react-dialog";
import {cx} from "cva";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {Suspense, useState} from "react";

export type Country = {
  code: string;
  currency: {
    code: string;
    symbol: string;
  };
  name: string;
};

type DialogRootProps = {
  className?: string;
  countries: Country[];
};

export default function CountrySelectorDialog({
  className,
  countries,
}: DialogRootProps) {
  const [open, setOpen] = useState(false);

  const pathname = usePathname();
  const countryCode = useCountryCode();

  const getNewPath = (newCountryCode: string) => {
    const pathParts = pathname.split("/");

    const isDefault = newCountryCode === config.defaultCountryCode;
    const currentIsDefault = countryCode === config.defaultCountryCode;

    if (isDefault && !currentIsDefault) {
      pathParts.splice(1, 1);
    } else if (!isDefault && currentIsDefault) {
      pathParts.splice(1, 0, newCountryCode);
    } else if (!isDefault) {
      pathParts[1] = newCountryCode;
    }

    const path = pathParts.join("/");

    return path.startsWith("/") ? path : "/" + path;
  };

  const selectedCountry =
    countries.find((country) => country?.code === countryCode) || countries[0];

  return (
    <Dialog onOpenChange={(v) => setOpen(v)} open={open}>
      <OpenDialog className={className}>
        <Body
          className={cx(
            "border-accent overflow-hidden rounded-lg border-[1.5px] p-2 whitespace-nowrap lg:border-none",
            className,
          )}
          font="sans"
          mobileSize="lg"
        >
          {selectedCountry.code?.toUpperCase()} [
          {selectedCountry.currency.symbol}]
        </Body>
      </OpenDialog>
      <SideDialog>
        <div className="border-accent bg-background relative flex h-full w-full flex-col border-l">
          <div className="bg-background pr-xs flex h-full w-full flex-col p-4">
            <Title asChild>
              <Heading
                className="py-4"
                desktopSize="lg"
                font="serif"
                mobileSize="base"
                tag="h2"
              >
                Select your country
              </Heading>
            </Title>
            <CloseDialog
              aria-label="Close"
              className="absolute top-[10px] right-[10px]"
            >
              <Icon className="h-9 w-9" name="Close" />
            </CloseDialog>
            <div className="flex flex-1 flex-col items-stretch overflow-y-scroll">
              {countries.map((country) => (
                <Suspense key={country?.code}>
                  <Link
                    className="hover:bg-secondary rounded-sm px-4 py-2 whitespace-nowrap"
                    href={getNewPath(country?.code)}
                    onClick={() => setOpen(false)}
                    prefetch
                  >
                    {country.name} [{country.currency.symbol}]
                  </Link>
                </Suspense>
              ))}
            </div>
          </div>
        </div>
      </SideDialog>
    </Dialog>
  );
}
