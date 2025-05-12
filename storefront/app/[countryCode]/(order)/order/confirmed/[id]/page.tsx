import type {PageProps} from "@/types";

import {TotalsBreakdown} from "@/components/shared/totals-breakdown";
import Body from "@/components/shared/typography/body";
import Heading from "@/components/shared/typography/heading";
import {enrichLineItems} from "@/data/medusa/line-items";
import {getOrder} from "@/data/medusa/order";
import {convertToLocale} from "@/utils/medusa/money";
import {notFound} from "next/navigation";

import OrderItem from "./_parts/order-item";
import {getFormattedPaymentData} from "@/utils/moyasar/payment";

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

  function convertMoney(amount: number) {
    return convertToLocale({
      amount,
      currency_code: order.currency_code,
    });
  }

  const shippingMethod = order.shipping_methods?.[0];
  const paymentData = getFormattedPaymentData(
    order.payment_collections?.[0].payments?.[0].data,
  );

  return (
    <main className="bg-white px-4 pt-16 pb-24 sm:px-6 sm:pt-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-3xl">
        <div className="max-w-xl">
          <Heading font="serif" mobileSize="4xl" tag="h1">
            شكراً لطلبكم!
          </Heading>

          <Body className="text-muted-foreground mt-2" font="sans">
            تم إرسال تفاصيل الطلب إلى البريد الإلكتروني.
          </Body>
        </div>
        <section className="mt-10 border-t">
          <h2 className="sr-only">ملخص الطلب</h2>
          <h3 className="sr-only">المنتجات</h3>

          {order.items.map((item) => {
            return (
              <OrderItem
                currency_code={order.currency_code}
                key={item.id}
                {...item}
              />
            );
          })}
          <div className="sm:mr-40 sm:pr-6">
            <h3 className="sr-only">معلوماتك</h3>

            <h4 className="sr-only">العناوين</h4>
            <dl className="grid grid-cols-2 gap-x-6 py-10">
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
                    <span className="block">
                      {order.shipping_address?.address_1}
                    </span>
                    <span className="block">
                      {order.shipping_address?.postal_code},{" "}
                      {order.shipping_address?.city}
                    </span>
                  </address>
                </Body>
              </div>
              <div>
                <Body as="dt" className="font-medium" mobileSize="sm">
                  بيانات التواصل
                </Body>

                <Body as="dd" className="mt-2" mobileSize="sm">
                  <span className="block">{order.email}</span>
                  <span className="block">{order.shipping_address?.phone}</span>
                </Body>
              </div>
            </dl>

            <h4 className="sr-only">الدفع</h4>
            <dl className="grid grid-cols-2 gap-x-6 border-t border-gray-200 py-10 text-sm">
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

              {shippingMethod && (
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
              )}
            </dl>

            <h3 className="sr-only">Summary</h3>

            <TotalsBreakdown data={order} variant="small" />
          </div>
        </section>
      </div>
    </main>
  );
}
