import React from "react";

interface Address {
  address_1?: null | string;
  address_2?: null | string;
  city?: null | string;
  metadata?: {
    country_name?: string;
  } | null;
  province?: null | string;
}

interface FormattedAddressProps {
  address: Address;
}

const FormattedAddress: React.FC<FormattedAddressProps> = ({address}) => {
  const {address_1, address_2, city, metadata, province} = address;

  return (
    <span>
      {metadata?.country_name}, {city}, {address_1}, {address_2}
    </span>
  );
};

export default FormattedAddress;
