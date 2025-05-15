import type {PageProps} from "@/types";

import Body from "@/components/shared/typography/body";
import Heading from "@/components/shared/typography/heading";
import {enrichLineItems} from "@/data/medusa/line-items";
import {getOrder} from "@/data/medusa/order";
import {notFound} from "next/navigation";

import {Link} from "@/components/shared/button";
import {ChevronLeft} from "lucide-react";
import OrderDetails from "@/components/orders/order-details";
import OrderItem from "@/components/orders/order-item";
import OrderAddressBlock from "@/components/orders/blocks/order-address";
import OrderContactInfoBlock from "@/components/orders/blocks/order-contact-info";
import OrderPaymentBlock from "@/components/orders/blocks/order-payment";
import OrderShippingOptionBlock from "@/components/orders/blocks/order-shipping-option";
import {TotalsBreakdown} from "@/components/shared/totals-breakdown";

export default async function OrderConfirmedPage(props: PageProps<"id">) {
  const params = await props.params;
  const baseOrder = await getOrder(params.id);

  if (!baseOrder) {
    return notFound();
  }

  const order = {
    ...baseOrder,
    items: await enrichLineItems(baseOrder.items, baseOrder.region_id!),
  };

  return (
    <div className="lg:col-start-2">
      <div className="max-w-xl">
        <Heading font="serif" mobileSize="4xl" tag="h1">
          شكراً لطلبكم!
        </Heading>

        <Body className="text-muted-foreground mt-2" font="sans">
          تم استلام طلبكم وإرسال تفاصيل الطلب إلى البريد الإلكتروني.
        </Body>
      </div>
      <section className="mt-10 border-t">
        <h2 className="sr-only">ملخص الطلب</h2>
        <h3 className="sr-only">المنتجات</h3>

        {order.items?.map((item) => {
          return (
            <OrderItem
              className="border-b py-10"
              currencyCode={order.currency_code}
              key={item.id}
              item={item}
            />
          );
        })}
        <div className="sm:mr-40 sm:pr-6">
          <h3 className="sr-only">معلوماتك</h3>

          <dl className="grid grid-cols-2 gap-x-6 py-10">
            <OrderAddressBlock order={order} />

            <OrderContactInfoBlock order={order} />
          </dl>

          <h4 className="sr-only">الدفع</h4>
          <dl className="grid grid-cols-2 gap-x-6 border-t py-10 text-sm">
            <OrderPaymentBlock order={order} />

            <OrderShippingOptionBlock order={order} />
          </dl>

          <h3 className="sr-only">Summary</h3>

          <TotalsBreakdown data={order} variant="small" />
        </div>
      </section>
      <div className="mt-16 border-t py-6 text-left">
        <Link href="/" variant="secondary">
          <ChevronLeft /> متابعة التسوق
        </Link>
      </div>
    </div>
  );
}
