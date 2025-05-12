import {
  createCardToken,
  initiateApplePaySession,
} from "@/actions/medusa/moyasar";
import {initiatePaymentSession} from "@/actions/medusa/payment";
import {useCheckout} from "@/components/context/checkout-context";
import {useCountryCode} from "@/components/context/country-code-context";
import {Cta} from "@/components/shared/button";
import config from "@/config";
import {
  ApplePaySource,
  PaymentData,
  CreditCardSource,
  PaymentSourceType,
} from "@/types";
import {useFormContext, useToast} from "@merchify/ui";

interface PaymentButtonProps {
  type: PaymentSourceType;
  loading: boolean;
  disabled: boolean;
  onInitiated: (transactionUrl?: string) => Promise<void>;
}

export default function PaymentButton({
  type,
  loading,
  disabled,
  onInitiated,
}: PaymentButtonProps) {
  switch (type) {
    case PaymentSourceType.CreditCard:
      return (
        <CreditCardPaymentButton
          onInitiated={onInitiated}
          loading={loading}
          disabled={disabled}
        />
      );
    case PaymentSourceType.ApplePay:
      return (
        <ApplePayPaymentButton
          onInitiated={onInitiated}
          loading={loading}
          disabled={disabled}
        />
      );
    // You can add more cases like stcpay
    default:
      return null;
  }
}
interface Props {
  loading: boolean;
  disabled: boolean;
  onInitiated: (transactionUrl?: string) => Promise<void>;
}

function ApplePayPaymentButton({loading, disabled, onInitiated}: Props) {
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
            provider_id: "pp_moyasar_moyasar",
            data: {
              source: {
                type: PaymentSourceType.ApplePay,
                token: JSON.stringify(token),
              },
            },
          },
        },
      );

      if (!session.success) {
        applePaySession.completePayment({
          status: ApplePaySession.STATUS_FAILURE,
          errors: [
            new ApplePayError("unknown", undefined, session.error as string),
          ],
        });
        throw new Error(session.error || "فشل في بدء عملية الدفع");
      }

      if (session.data?.status != "paid") {
        applePaySession.completePayment({
          status: ApplePaySession.STATUS_FAILURE,
          errors: [
            new ApplePayError(
              "unknown",
              undefined,
              session.data?.source.message,
            ),
          ],
        });

        return;
      }

      // TODO: Report payment result to merchant backend
      // TODO: Add any merchant related bussiness logic here

      applePaySession.completePayment({
        status: ApplePaySession.STATUS_SUCCESS,
      });
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

function CreditCardPaymentButton({loading, disabled, onInitiated}: Props) {
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
        toast({description: result.error.message, variant: "destructive"});
        return;
      }

      const session = await initiatePaymentSession<
        PaymentData<CreditCardSource>
      >({
        cart,
        input: {
          provider_id: "pp_moyasar_moyasar",
          data: {
            source: {
              type: PaymentSourceType.Token,
              token: result.data.id,
            },
            callback_url: `${window.location.origin}/api/payment-redirect/${cart.id}`,
          },
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
