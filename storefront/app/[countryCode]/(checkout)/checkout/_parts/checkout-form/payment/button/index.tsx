import type {StoreCart} from "@medusajs/types";

import {isManual, isStripe} from "../utils";
import ManualPaymentButton from "./manual";

type Props = {
  cart: StoreCart;
  disabled?: boolean;
};
export default function PaymentButton({cart, disabled}: Props) {
  const paymentSession = cart.payment_collection?.payment_sessions?.[0];

  const notReady = !cart || !cart.shipping_address || !cart.email || disabled;
  console.log(cart.email);

  if (isManual(paymentSession?.provider_id)) {
    return <ManualPaymentButton notReady={Boolean(notReady)} />;
  }
}
