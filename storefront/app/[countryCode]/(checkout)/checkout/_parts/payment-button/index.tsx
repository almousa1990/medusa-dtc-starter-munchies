import {
  createCardToken,
  initiatePaymentSession,
} from "@/actions/medusa/payment";
import {useCheckout} from "@/components/context/checkout-context";
import {useCountryCode} from "@/components/context/country-code-context";
import {Cta} from "@/components/shared/button";
import config from "@/config";
import {convertToLocale} from "@/utils/medusa/money";
import {useFormContext, useToast} from "@merchify/ui";

interface PaymentButtonProps {
  type: "creditcard" | "applepay" | "stcpay";
  loading: boolean;
  disabled: boolean;
}

export default function PaymentButton({
  type,
  loading,
  disabled,
}: PaymentButtonProps) {
  switch (type) {
    case "creditcard":
      return <CreditCardPaymentButton loading={loading} disabled={disabled} />;
    case "applepay":
      return <ApplePayPaymentButton loading={loading} disabled={disabled} />;
    // You can add more cases like stcpay
    default:
      return null;
  }
}
interface Props {
  loading: boolean;
  disabled: boolean;
}

function ApplePayPaymentButton({loading, disabled}: Props) {
  const form = useFormContext();
  const {cart, customer} = useCheckout();
  const countryCode = useCountryCode();

  const {toast} = useToast();

  const handleClick = form.handleSubmit(async (_data) => {
    if (typeof window !== "undefined" && !(window as any).ApplePaySession) {
      return;
    }

    // Define ApplePayPaymentRequest
    const applePayPaymentRequest: ApplePayJS.ApplePayPaymentRequest = {
      countryCode: countryCode.toUpperCase(),
      currencyCode: cart.currency_code.toUpperCase(),
      supportedNetworks: ["mada", "visa", "masterCard"],
      merchantCapabilities: ["supports3DS", "supportsDebit", "supportsCredit"],
      total: {
        label: config.siteName,
        amount: cart.total.toString(),
      },
    };

    // Create Apple Pay Session
    const applePaySession = new ApplePaySession(5, applePayPaymentRequest);

    applePaySession.onvalidatemerchant = async (event) => {
      const body = {
        validation_url: event.validationURL,
        display_name: config.siteName,
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

        applePaySession.completeMerchantValidation(await response.json());
      } catch (error) {
        applePaySession.completeMerchantValidation(error);
      }
    };

    // Payment Authorization
    applePaySession.onpaymentauthorized = async (event) => {
      const token = event.payment.token;
      const session = await initiatePaymentSession({
        cart,
        input: {
          provider_id: "pp_moyasar_moyasar",
          data: {
            source: {
              type: "applepay",
              token: JSON.stringify(token),
            },
          },
        },
      });

      if (session.status === "success" && session.redirect_url) {
        window.location.href = session.redirect_url;
      } else {
        throw new Error(session.error || "فشل في بدء عملية الدفع");
      }
    };

    applePaySession.oncancel = (event) => {
      toast({description: "تم إلغاء العملية", variant: "destructive"});
    };

    applePaySession.begin();
  });

  return (
    <Cta
      className="w-full"
      disabled={disabled}
      loading={loading}
      onClick={handleClick}
    >
      الدفع عبر Apple Pay
    </Cta>
  );
}

function CreditCardPaymentButton({loading, disabled}: Props) {
  const form = useFormContext();
  const {toast} = useToast();
  const {cart, customer} = useCheckout();

  const handleClick = form.handleSubmit(async (data) => {
    try {
      const normalizedCardNumber = data.card.number.replace(/\s/g, "");
      if (!customer.first_name || !customer.last_name) {
        return;
      }

      const result = await createCardToken({
        first_name: customer.first_name,
        last_name: customer.last_name,
        number: normalizedCardNumber,
        month: data.card.month,
        year: data.card.year,
        cvc: data.card.cvc,
      });

      if (!result.success) {
        toast({description: result.error, variant: "destructive"});
        return;
      }

      const session = await initiatePaymentSession({
        cart,
        input: {
          provider_id: "pp_moyasar_moyasar",
          data: {
            source: {
              type: "token",
              token: result.token,
            },
          },
        },
      });

      if (session.status === "success" && session.redirect_url) {
        window.location.href = session.redirect_url;
      } else {
        throw new Error(session.error || "فشل في بدء عملية الدفع");
      }
    } catch (err: any) {
      toast({
        description: err?.message || "حدث خطأ أثناء المعالجة",
        variant: "destructive",
      });
    }
  });

  return (
    <Cta
      className="w-full"
      disabled={disabled}
      loading={loading}
      onClick={handleClick}
    >
      الدفع
    </Cta>
  );
}
