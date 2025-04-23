import {GeolocationAddress} from "@/types";
import {useState} from "react";

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
              const response = await fetch("/api/geocode", {
                method: "POST",
                body: JSON.stringify({latitude, longitude}),
                headers: {"Content-Type": "application/json"},
              });
              const values: GeolocationAddress = await response.json();

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
