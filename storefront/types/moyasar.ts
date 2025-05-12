type BasePaymentResponse = {[key: string]: unknown};

export type PaymentStatus =
  | "initiated"
  | "paid"
  | "failed"
  | "authorized"
  | "voided"
  | "refunded"
  | "captured";

export enum PaymentSourceType {
  CreditCard = "creditcard",
  ApplePay = "applepay",
  Token = "token",
}

export enum PaymentSourceCompany {
  Mada = "mada",
  Visa = "visa",
  Master = "master",
  Amex = "amex",
}

export enum PaymentSourceIssuerCardType {
  Debit = "debit",
  Credit = "credit",
  ChargeCard = "charge_card",
  Unspecified = "unspecified",
}

export interface CreditCardSource {
  type: PaymentSourceType.CreditCard;
  company: PaymentSourceCompany;
  name: string;
  number: string; // MaskedPanNumber - format: first 6 and last 4 digits
  gateway_id: string;
  token: string;
  message: string;
  transaction_url: string; // should be a URI
  reference_number: string; // must match /^\d{12}$/
  authorization_code?: string; // optional, must match /^\d{6}$/
  response_code?: string; // ISO 8583 two-digit code
  issuer_name?: string;
  issuer_country?: string; // ISO 3166-1 alpha-2 code
  issuer_card_type?: PaymentSourceIssuerCardType;
  issuer_card_category?: string; // human-readable, no fixed set
}

export interface ApplePaySource {
  type: PaymentSourceType.CreditCard;
  name: null;
  company: PaymentSourceCompany;
  number: string; // LastFourPanNumber - format: last 4 digits
  dpan?: string; // MaskedPanNumber - format: first 6 and last 4 digits
  gateway_id: string; // may start with ap, sp, gp based on payment source
  reference_number: string; // must match /^\d{12}$/
  message: string;
  response_code?: string; // ISO 8583 two-digit code
  authorization_code?: string; // optional, must match /^\d{6}$/
  issuer_name?: string;
  issuer_country?: string; // ISO 3166-1 alpha-2 code
  issuer_card_type?: PaymentSourceIssuerCardType;
  issuer_card_category?: string; // human-readable, no fixed set
}

export type PaymentSource = CreditCardSource | ApplePaySource;

export interface PaymentData<T = PaymentSource> extends BasePaymentResponse {
  id: string;
  status: PaymentStatus;
  amount: number; // In the smallest unit (e.g., 100 = 1.00 SAR)
  fee: number;
  currency: string; // ISO code, e.g., 'SAR'
  refunded: boolean;
  refunded_at: string | null; // ISO timestamp or null
  description: string | null;
  amount_format: string; // e.g., '1.00'
  fee_format: string; // e.g., '0.00'
  invoice_id: string | null;
  ip: string;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  callback_url: string;
  source: T;
  metadata: Record<string, string>;
}

export type InitiateApplePaySessionResponse = {
  epochTimestamp: number;
  expiresAt: number;
  merchantSessionIdentifier: string;
  nonce: string;
  merchantIdentifier: string;
  domainName: string;
  displayName: string;
  signature: string;
  operationalAnalyticsIdentifier: string;
  retries: number;
};

export type InitiateApplePaySessionResult =
  | {success: true; data: InitiateApplePaySessionResponse}
  | {success: false; error: ErrorResponse};

export interface CreateCardTokenInput {
  number: string;
  month: string;
  year: string;
  cvc: string;
  first_name: string;
  last_name: string;
}

export interface CardToken {
  id: string;
  status: "initiated" | "verified" | "failed"; // Extend if more statuses exist
  brand: CreditCardSource; // Extend if needed
  funding: "debit" | "credit" | "prepaid" | "unknown"; // Common funding types
  country: string; // ISO 3166-1 alpha-2 country code, e.g., "US"
  month: string; // MM
  year: string; // YYYY
  name: string;
  last_four: string;
  metadata: Record<string, any> | null;
  message: string | null;
  verification_url: string;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export type CreateCardTokenResponse = CardToken;

export type CreateCardTokenResult =
  | {success: true; data: CreateCardTokenResponse}
  | {success: false; error: ErrorResponse};

export type ErrorResponse = {
  type: ErrorType;
  message: string;
  errors: string[];
};

export enum ErrorType {
  Validation = "validation_error",
  InvalidRequest = "invalid_request_error",
  Authentication = "authentication_error",
  RateLimit = "rate_limit_error",
  ApiConnection = "api_connection_error",
  AccountInactive = "account_inactive_error",
  Api = "api_error",
  ThreeDSAuth = "3ds_auth_error",
}
