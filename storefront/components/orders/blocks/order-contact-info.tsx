import type {StoreOrder} from "@medusajs/types";

import Body from "@/components/shared/typography/body";

export default function OrderContactInfoBlock({order}: {order: StoreOrder}) {
  return (
    <div>
      <Body as="dt" className="font-medium" mobileSize="sm">
        بيانات التواصل
      </Body>

      <Body as="dd" className="mt-2" mobileSize="sm">
        <span className="block">{order.email}</span>
        <span className="block">{order.shipping_address?.phone}</span>
      </Body>
    </div>
  );
}
