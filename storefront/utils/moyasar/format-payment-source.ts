import {PaymentSourceCompany, PaymentSourceType} from "@/types";

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
