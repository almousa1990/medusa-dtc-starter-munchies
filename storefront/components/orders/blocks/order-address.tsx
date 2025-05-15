import type {StoreOrder} from "@medusajs/types";

import Body from "@/components/shared/typography/body";

export default function OrderAddressBlock({order}: {order: StoreOrder}) {
  return (
    <div>
      <Body as="dt" className="font-medium" mobileSize="sm">
        عنوان الشحن
      </Body>

      <Body as="dd" className="mt-2" mobileSize="sm">
        <address className="not-italic">
          <span className="block">
            {order.shipping_address?.first_name}{" "}
            {order.shipping_address?.last_name}
          </span>
          <span className="block">{order.shipping_address?.address_1}</span>
          <span className="block">
            {order.shipping_address?.postal_code},{" "}
            {order.shipping_address?.city}
          </span>
        </address>
      </Body>
    </div>
  );
}
