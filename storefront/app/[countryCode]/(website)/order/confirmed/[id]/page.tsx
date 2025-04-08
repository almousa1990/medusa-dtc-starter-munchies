import type {PageProps} from "@/types";

import {TotalsBreakdown} from "@/components/shared/totals-breakdown";
import Body from "@/components/shared/typography/body";
import Heading from "@/components/shared/typography/heading";
import {enrichLineItems} from "@/data/medusa/line-items";
import {getOrder} from "@/data/medusa/order";
import {convertToLocale} from "@/utils/medusa/money";
import {notFound} from "next/navigation";

import OrderItem from "./_parts/order-item";

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

  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-4 py-10 md:py-20">
      <div className="flex flex-col gap-2">
        <Heading
          className="mb-6"
          desktopSize="2xl"
          font="serif"
          mobileSize="lg"
          tag="h1"
        >
          شكراً لطلبكم!
        </Heading>

        <Body className="font-medium" desktopSize="xl" font="sans">
          تم إرسال تفاصيل تأكيد الطلب إلى {order.email}
        </Body>

        <Body desktopSize="base" font="sans">
          تاريخ الطلب:{" "}
          {new Date(order.created_at).toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </Body>
        <Body desktopSize="base" font="sans">
          رقم الطلب: {order.display_id}
        </Body>
      </div>
      <div className="flex flex-col gap-4">
        <Heading desktopSize="xl" font="serif" mobileSize="lg" tag="h2">
          الملخص
        </Heading>
        <div className="flex flex-col gap-4">
          {order.items.map((item) => {
            return (
              <OrderItem
                currency_code={order.currency_code}
                key={item.id}
                {...item}
              />
            );
          })}
          <Separator />
          <TotalsBreakdown data={order} />
          <Separator />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Heading desktopSize="xl" font="serif" mobileSize="lg" tag="h2">
          التوصيل
        </Heading>
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-4">
          <div className="flex flex-1 flex-col gap-[6px]">
            <Body
              className="mb-[6px] font-semibold"
              desktopSize="base"
              font="sans"
            >
              عنوان الشحن
            </Body>
            <Body className="font-base" desktopSize="base" font="sans">
              {order.shipping_address?.first_name}{" "}
              {order.shipping_address?.last_name}
            </Body>
            <Body className="font-base" desktopSize="base" font="sans">
              {order.shipping_address?.address_1}
            </Body>
            <Body className="font-base" desktopSize="base" font="sans">
              {order.shipping_address?.postal_code},{" "}
              {order.shipping_address?.city}
            </Body>
          </div>
          <div className="flex flex-1 flex-col gap-[6px]">
            <Body
              className="mb-[6px] font-semibold"
              desktopSize="base"
              font="sans"
            >
              التواصل
            </Body>
            <Body className="font-base" desktopSize="base" font="sans">
              {order.email}
            </Body>
          </div>

          {shippingMethod && (
            <div className="flex flex-1 flex-col gap-[6px]">
              <Body
                className="mb-[6px] font-semibold"
                desktopSize="base"
                font="sans"
              >
                الشحن
              </Body>
              <Body className="font-base" desktopSize="base" font="sans">
                {shippingMethod?.name}
                {shippingMethod?.amount
                  ? ` (${convertMoney(shippingMethod?.amount)})`
                  : null}
              </Body>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Separator() {
  return <div className="bg-accent h-px w-full" />;
}

function SubLineItem({title, value}: {title: string; value: string}) {
  return (
    <div className="flex items-center justify-between gap-8">
      <Body className="mb-[6px] font-semibold" desktopSize="base" font="sans">
        {title}
      </Body>
      <Body className="mb-[6px] font-semibold" desktopSize="base" font="sans">
        {value}
      </Body>
    </div>
  );
}
