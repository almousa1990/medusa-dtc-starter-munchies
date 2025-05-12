import {
  PaymentData,
  PaymentSource,
  PaymentSourceCompany,
  PaymentSourceType,
} from "@/types";

export function getRawPaymentData<T = PaymentSource>(
  data?: Record<string, unknown>,
): PaymentData<T> | undefined {
  return data ? (data as PaymentData<T>) : undefined;
}

export function getFormattedPaymentData(
  data?: Record<string, unknown>,
): {company: string; type: string; number: string} | null {
  if (!data) return null;

  const typedData = data as PaymentData;
  return {
    company: formatPaymentSourceCompany(typedData.source.company),
    type: formatPaymentSourceType(typedData.source.type),
    number: typedData.source.number,
  };
}

export function formatPaymentSourceType(type?: PaymentSourceType): string {
  switch (type) {
    case PaymentSourceType.CreditCard:
      return "البطاقة الائتمانية";
    case PaymentSourceType.ApplePay:
      return "Apple Pay";
    default:
      return "Unknown";
  }
}

export function formatPaymentSourceCompany(
  type?: PaymentSourceCompany,
): string {
  switch (type) {
    case PaymentSourceCompany.Mada:
      return "مدى";
    case PaymentSourceCompany.Master:
      return "Mastercard";
    case PaymentSourceCompany.Amex:
      return "Amex";
    case PaymentSourceCompany.Visa:
      return "Visa";
    default:
      return "Unknown";
  }
}
