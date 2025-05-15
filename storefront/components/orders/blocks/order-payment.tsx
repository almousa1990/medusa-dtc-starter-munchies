import type {StoreOrder} from "@medusajs/types";

import Body from "@/components/shared/typography/body";
import {getFormattedPaymentData} from "@/utils/moyasar/payment";

export default function OrderPaymentBlock({order}: {order: StoreOrder}) {
  const paymentData = getFormattedPaymentData(
    order.payment_collections?.[0].payments?.[0].data,
  );
  return (
    <div>
      <Body as="dt" className="font-medium" mobileSize="sm">
        طريقة الدفع
      </Body>
      <Body as="dd" className="mt-2" mobileSize="sm">
        <p>{paymentData?.type}</p>
        <p>{paymentData?.company}</p>
        <p> {paymentData?.number}</p>
      </Body>
    </div>
  );
}
