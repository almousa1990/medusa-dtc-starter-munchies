"use client";

import {StoreCustomer} from "@medusajs/types";
import {Cta} from "./button";

interface ApplePayFormProps {
  customer: StoreCustomer;
  onTokenCreated: (token: string) => void;
}

export function ApplePayForm(props: ApplePayFormProps) {
  const {customer, onTokenCreated} = props;
  const onApplePayButtonClicked = () => {
    console.log("clicked");
    if (typeof window !== "undefined" && !(window as any).ApplePaySession) {
      return;
    }
    // Define ApplePayPaymentRequest
    const applePayPaymentRequest: ApplePayJS.ApplePayPaymentRequest = {
      countryCode: "SA",
      currencyCode: "SAR",
      supportedNetworks: ["mada", "visa", "masterCard"],
      merchantCapabilities: ["supports3DS", "supportsDebit", "supportsCredit"],
      total: {
        label: "Abdullah Store",
        amount: "99.95",
      },
    };

    // Create Apple Pay Session
    const session = new ApplePaySession(5, applePayPaymentRequest);

    session.onvalidatemerchant = async (event) => {
      const body = {
        validation_url: event.validationURL,
        display_name: "Abdullah Software",
        domain_name: window.location.hostname,
        publishable_api_key: process.env.NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY,
      };

      try {
        const response = await fetch(
          "https://api.moyasar.com/v1/applepay/initiate",
          {
            method: "post",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body),
          },
        );

        session.completeMerchantValidation(await response.json());
      } catch (error) {
        session.completeMerchantValidation(error);
      }
    };

    // Payment Authorization
    session.onpaymentauthorized = async (event) => {
      const token = event.payment.token;
      onTokenCreated(token);
    };

    session.oncancel = (event) => {
      console.log("payment canceled");
    };

    session.begin();
  };

  return (
    <Cta onClick={onApplePayButtonClicked} className="w-full">
      الدفع
    </Cta>
  );
}
