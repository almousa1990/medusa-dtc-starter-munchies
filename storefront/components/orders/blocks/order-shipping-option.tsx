import type {StoreOrder} from "@medusajs/types";

import Body from "@/components/shared/typography/body";
import {convertToLocale} from "@/utils/medusa/money";

export default function OrderShippingOptionBlock({order}: {order: StoreOrder}) {
  const shippingMethod = order.shipping_methods?.[0];
  function convertMoney(amount: number) {
    return convertToLocale({
      amount,
      currency_code: order.currency_code,
    });
  }

  if (!shippingMethod) {
    return null;
  }
  return (
    <div>
      <Body as="dt" className="font-medium" mobileSize="sm">
        الشحن
      </Body>
      <Body as="dd" className="mt-2" mobileSize="sm">
        <p>{shippingMethod?.name}</p>
        <p>{shippingMethod?.description}</p>
        <p>
          {shippingMethod?.amount
            ? ` (${convertMoney(shippingMethod?.amount)})`
            : null}
        </p>
      </Body>
    </div>
  );
}
