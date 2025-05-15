import type {Metadata} from "next";

import {Badge, cn, Separator} from "@merchify/ui";
import {notFound} from "next/navigation";

import {getOrder} from "@/data/medusa/order";
import {enrichLineItems} from "@/data/medusa/line-items";
import Body from "@/components/shared/typography/body";
import {
  enrichFulfillmentsWithOrderItems,
  getFulfillmentState,
  getOrderStatusLabel,
} from "@/utils/medusa/order";
import OrderItem from "@/components/orders/order-item";
import OrderAddressBlock from "@/components/orders/blocks/order-address";
import OrderContactInfoBlock from "@/components/orders/blocks/order-contact-info";
import OrderPaymentBlock from "@/components/orders/blocks/order-payment";
import OrderShippingOptionBlock from "@/components/orders/blocks/order-shipping-option";
import {TotalsBreakdown} from "@/components/shared/totals-breakdown";
import Heading from "@/components/shared/typography/heading";
import Link from "next/link";

type Props = {
  params: Promise<{id: string}>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const order = await getOrder(params.id).catch(() => null);

  if (!order) {
    notFound();
  }

  return {
    description: `View your order`,
    title: `Order #${order.display_id}`,
  };
}

export default async function OrderDetailPage(props: Props) {
  const params = await props.params;
  const order = await getOrder(params.id).catch(() => null);

  if (!order) {
    notFound();
  }

  const fulfillments = enrichFulfillmentsWithOrderItems(
    order.fulfillments,
    order.items,
  );

  const unfulfilledItems = order.items?.filter(
    (item) => item.detail.fulfilled_quantity < item.detail.quantity,
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">الطلبات</h3>
        <p className="text-muted-foreground text-sm">عرض سجل الطلبات</p>
      </div>
      <Separator />

      <dl className="my-8 grid grid-cols-1 gap-x-4 gap-y-4 lg:grid-cols-3">
        <div className="bg-accent rounded-md px-4 py-2">
          <Body className="font-medium" mobileSize="sm" as="dt">
            تاريخ الطلب
          </Body>
          <Body className="mt-2" mobileSize="sm" as="dd">
            <time dateTime={new Date(order.created_at).toDateString()}>
              {new Date(order.created_at ?? "").toLocaleDateString(
                "ar-SA-u-ca-gregory",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                },
              )}
            </time>
          </Body>
        </div>
        <div className="bg-accent rounded-md px-4 py-2">
          <Body className="font-medium" mobileSize="sm" as="dt">
            رقم الطلب
          </Body>
          <Body className="mt-2" mobileSize="sm" as="dd">
            {order.display_id}
          </Body>
        </div>
        <div className="bg-accent rounded-md px-4 py-2">
          <Body className="font-medium" mobileSize="sm" as="dt">
            حالة الطلب
          </Body>
          <Body className="mt-2" mobileSize="sm" as="dd">
            {getOrderStatusLabel(order.status)}
          </Body>
        </div>
      </dl>
      <div>
        <h2 className="sr-only">ملخص الطلب</h2>

        {fulfillments && (
          <>
            {fulfillments?.map((fulfillment, index) => {
              const labels = fulfillment.labels;
              const shippingOption = fulfillment.shipping_option;
              const state = getFulfillmentState(fulfillment);
              return (
                <div key={fulfillment.id} className="pb-4">
                  <div className="flex justify-between rounded-t-md border px-4 py-4">
                    <Heading tag="h4">شحنة #{index + 1}</Heading>
                    <div>
                      <Badge className="bg-green-600">{state.step}</Badge>
                    </div>
                  </div>
                  <div className="border border-y-0 px-4 py-4">
                    {fulfillment.items?.map((fi) => (
                      <OrderItem
                        currencyCode={order.currency_code}
                        key={fi.id}
                        item={fi.line_item}
                      />
                    ))}
                  </div>
                  <div className="bg-accent rounded-b-md border px-4 py-4">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 lg:grid-cols-2">
                      <div>
                        <Body className="font-medium" mobileSize="sm" as="dt">
                          شركة الشحن
                        </Body>
                        <Body className="mt-2" mobileSize="sm" as="dd">
                          {shippingOption.name}
                        </Body>
                      </div>
                      <div>
                        <Body className="font-medium" mobileSize="sm" as="dt">
                          رقم التتبع
                        </Body>
                        <Body className="mt-2" mobileSize="sm" as="dd">
                          {labels?.map((label) => (
                            <Link href={label.tracking_url} key={label.id}>
                              {label.tracking_number}
                            </Link>
                          ))}
                        </Body>
                      </div>
                    </dl>
                  </div>
                </div>
              );
            })}
          </>
        )}

        <h3 className="sr-only">المنتجات</h3>

        {unfulfilledItems && !!unfulfilledItems.length && (
          <div className="pb-4">
            <div className="flex justify-between rounded-t-md border px-4 py-4">
              <Heading tag="h4">المنتجات</Heading>
              <div>
                <Badge variant="secondary">
                  {getOrderStatusLabel(order.status)}
                </Badge>
              </div>
            </div>
            <div className="rounded-b-md border border-t-0 px-4 py-4">
              {unfulfilledItems?.map((item) => (
                <OrderItem
                  currencyCode={order.currency_code}
                  key={item.id}
                  item={item}
                />
              ))}
            </div>
          </div>
        )}

        <div>
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
      </div>
    </div>
  );
}
