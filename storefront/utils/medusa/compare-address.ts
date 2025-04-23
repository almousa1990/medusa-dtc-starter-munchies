type Address = {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  country_code: string;
  province: string;
  postal_code: string;
  phone: string;
};

function normalize(value?: string): string {
  return (value ?? "").trim().toLowerCase();
}

export function compareAddress(
  a: Partial<Address> | undefined | string,
  b: Partial<Address> | undefined | string,
): boolean {
  if (!a || !b) return false;
  if (typeof a === "string" || typeof b === "string") return false;
  return (
    normalize(a.first_name) === normalize(b.first_name) &&
    normalize(a.last_name) === normalize(b.last_name) &&
    normalize(a.address_1) === normalize(b.address_1) &&
    normalize(a.address_2) === normalize(b.address_2) &&
    normalize(a.city) === normalize(b.city) &&
    normalize(a.country_code) === normalize(b.country_code) &&
    normalize(a.province) === normalize(b.province) &&
    normalize(a.postal_code) === normalize(b.postal_code) &&
    normalize(a.phone) === normalize(b.phone)
  );
}
