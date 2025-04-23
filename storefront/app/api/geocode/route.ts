import {GeolocationAddress} from "@/types";

export async function POST(req: Request) {
  const {latitude, longitude} = await req.json();

  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.GOOGLE_MAPS_API_KEY}&language=ar`;

  const response = await fetch(url);
  const data = await response.json();

  const preferredTypes = [
    "street_address",
    "premise",
    "subpremise",
    "route",
    "intersection",
  ];

  const result =
    data.results.find((r: any) =>
      r.types.some((type: string) => preferredTypes.includes(type)),
    ) || data.results?.[0];

  const components = result?.address_components || [];

  const getComponent = (type: string) =>
    components.find((c: any) => c.types.includes(type))?.short_name || "";

  const address: GeolocationAddress = {
    address_1: getComponent("sublocality") || getComponent("neighborhood"),
    address_2: getComponent("route"),
    city: getComponent("locality"),
    province: getComponent("administrative_area_level_1"),
    postal_code: getComponent("postal_code"),
    country_code: getComponent("country").toLowerCase(),
  };

  return Response.json(address);
}
