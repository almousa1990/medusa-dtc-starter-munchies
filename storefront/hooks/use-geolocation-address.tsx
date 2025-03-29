import {useState} from "react";

type GeolocationAddress = {
  address_1: string;
  address_2: string;
  city: string;
  province?: string;
  postal_code?: string;
  country_code: string;
};

export function useGeolocationAddress() {
  const [isLoading, setIsLoading] = useState(false);
  const isSupported =
    typeof navigator !== "undefined" && "geolocation" in navigator;

  const getAddressFromCurrentLocation =
    async (): Promise<GeolocationAddress | null> => {
      if (!isSupported) {
        alert("Geolocation is not supported by your browser.");
        return null;
      }

      setIsLoading(true);

      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const {latitude, longitude} = position.coords;

            try {
              const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyD6tgox_10l0s1CUC6t26HhEbkkoCd_He0&language=ar`,
              );
              const data = await response.json();
              const result = data.results?.[0];
              const components = result?.address_components || [];

              const getComponent = (type: string) =>
                components.find((c: any) => c.types.includes(type))
                  ?.short_name || "";

              const values: GeolocationAddress = {
                address_1:
                  getComponent("sublocality") || getComponent("neighborhood"),
                address_2: getComponent("route"),
                city: getComponent("locality"),
                province: getComponent("administrative_area_level_1"),
                postal_code: getComponent("postal_code"),
                country_code: getComponent("country").toLowerCase(),
              };

              resolve(values);
            } catch (error) {
              console.error("Failed to fetch location info", error);
              alert("حدث خطأ أثناء جلب الموقع.");
              resolve(null);
            } finally {
              setIsLoading(false);
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            alert("تعذر الحصول على الموقع. تأكد من تفعيل الموقع في المتصفح.");
            setIsLoading(false);
            resolve(null);
          },
        );
      });
    };

  return {
    getAddressFromCurrentLocation,
    isLoading,
    isSupported,
  };
}
