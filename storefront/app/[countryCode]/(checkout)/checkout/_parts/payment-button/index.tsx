import type {ApplePaySource, CreditCardSource, PaymentData} from "@/types";

import {
  createCardToken,
  initiateApplePaySession,
} from "@/actions/medusa/moyasar";
import {initiatePaymentSession} from "@/actions/medusa/payment";
import {useCheckout} from "@/components/context/checkout-context";
import {useCountryCode} from "@/components/context/country-code-context";
import {Cta} from "@/components/shared/button";
import config from "@/config";
import {PaymentSourceType} from "@/types";
import {useFormContext, useToast} from "@merchify/ui";

interface PaymentButtonProps {
  disabled: boolean;
  loading: boolean;
  onInitiated: (transactionUrl?: string) => Promise<void>;
  type: PaymentSourceType;
}

export default function PaymentButton({
  disabled,
  loading,
  onInitiated,
  type,
}: PaymentButtonProps) {
  switch (type) {
    case PaymentSourceType.CreditCard:
      return (
        <CreditCardPaymentButton
          disabled={disabled}
          loading={loading}
          onInitiated={onInitiated}
        />
      );
    case PaymentSourceType.ApplePay:
      return (
        <ApplePayPaymentButton
          disabled={disabled}
          loading={loading}
          onInitiated={onInitiated}
        />
      );
    // You can add more cases like stcpay
    default:
      return null;
  }
}
interface Props {
  disabled: boolean;
  loading: boolean;
  onInitiated: (transactionUrl?: string) => Promise<void>;
}

function ApplePayPaymentButton({disabled, loading, onInitiated}: Props) {
  const form = useFormContext();
  const {cart} = useCheckout();
  const countryCode = useCountryCode();

  const {toast} = useToast();

  const handleClick = form.handleSubmit(async () => {
    if (typeof window !== "undefined" && !(window as any).ApplePaySession) {
      return;
    }

    // Define ApplePayPaymentRequest
    const applePayPaymentRequest: ApplePayJS.ApplePayPaymentRequest = {
      countryCode: countryCode.toUpperCase(),
      currencyCode: cart.currency_code.toUpperCase(),
      merchantCapabilities: ["supports3DS", "supportsDebit", "supportsCredit"],
      supportedNetworks: ["mada", "visa", "masterCard"],
      total: {
        amount: cart.total.toString(),
        label: config.siteName,
      },
    };

    // Create Apple Pay Session
    const applePaySession = new ApplePaySession(5, applePayPaymentRequest);

    applePaySession.onvalidatemerchant = async (event) => {
      try {
        const result = await initiateApplePaySession(event);

        if (!result.success) {
          toast({description: result.error.message, variant: "destructive"});
          return;
        }

        applePaySession.completeMerchantValidation(result.data);
      } catch (error) {
        applePaySession.completeMerchantValidation(error);
      }
    };

    // Payment Authorization
    applePaySession.onpaymentauthorized = async (event) => {
      const token = event.payment.token;
      const session = await initiatePaymentSession<PaymentData<ApplePaySource>>(
        {
          cart,
          input: {
            data: {
              source: {
                token: JSON.stringify(token),
                type: PaymentSourceType.ApplePay,
              },
            },
            provider_id: "pp_moyasar_moyasar",
          },
        },
      );

      if (!session.success) {
        applePaySession.completePayment({
          errors: [
            new ApplePayError("unknown", undefined, session.error as string),
          ],
          status: ApplePaySession.STATUS_FAILURE,
        });
        throw new Error(session.error || "فشل في بدء عملية الدفع");
      }

      if (session.data?.status != "paid") {
        applePaySession.completePayment({
          errors: [
            new ApplePayError(
              "unknown",
              undefined,
              session.data?.source.message,
            ),
          ],
          status: ApplePaySession.STATUS_FAILURE,
        });

        return;
      }

      onInitiated();

      applePaySession.completePayment({
        status: ApplePaySession.STATUS_SUCCESS,
      });
    };

    applePaySession.oncancel = () => {
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

function CreditCardPaymentButton({disabled, loading, onInitiated}: Props) {
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
        cvc: data.card.cvc,
        first_name: customer.first_name,
        last_name: customer.last_name,
        month: data.card.month,
        number: normalizedCardNumber,
        year: data.card.year,
      });

      if (!result.success) {
        toast({description: result.error.message, variant: "destructive"});
        return;
      }

      const session = await initiatePaymentSession<
        PaymentData<CreditCardSource>
      >({
        cart,
        input: {
          data: {
            callback_url: `${window.location.origin}/api/payment-redirect/${cart.id}`,
            source: {
              token: result.data.id,
              type: PaymentSourceType.Token,
            },
          },
          provider_id: "pp_moyasar_moyasar",
        },
      });

      if (session.success) {
        const transactionUrl = session.data?.source?.transaction_url;

        await onInitiated(transactionUrl);
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
