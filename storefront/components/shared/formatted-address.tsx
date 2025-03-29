import React from "react";

interface Address {
  metadata?: {
    country_name?: string;
  } | null;
  city?: string | null;
  province?: string | null;
  address_1?: string | null;
  address_2?: string | null;
}

interface FormattedAddressProps {
  address: Address;
}

const FormattedAddress: React.FC<FormattedAddressProps> = ({address}) => {
  const {metadata, city, address_1, address_2, province} = address;

  return (
    <span>
      {metadata?.country_name}, {city}, {address_1}, {address_2}
    </span>
  );
};

export default FormattedAddress;
