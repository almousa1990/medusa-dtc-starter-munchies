import type {PageProps} from "@/types";

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
    <div className="gap-2xl px-sm py-2xl md:py-8xl mx-auto flex max-w-[1200px] flex-col">
      <div className="gap-xs flex flex-col">
        <Heading
          className="mb-lg"
          desktopSize="2xl"
          font="serif"
          mobileSize="lg"
          tag="h1"
        >
          Thank you! Your order was placed successfully
        </Heading>

        <Body className="font-medium" desktopSize="xl" font="sans">
          We have sent the order confirmation details to {order.email}
        </Body>

        <Body desktopSize="base" font="sans">
          Order date:{" "}
          {new Date(order.created_at).toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </Body>
        <Body desktopSize="base" font="sans">
          Order number: {order.display_id}
        </Body>
      </div>
      <div className="gap-s flex flex-col">
        <Heading desktopSize="xl" font="serif" mobileSize="lg" tag="h2">
          Summary
        </Heading>
        <div className="gap-s flex flex-col">
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
          <SubLineItem
            title="Subtotal"
            value={convertMoney(order.item_subtotal)}
          />
          <SubLineItem title="Taxes" value={convertMoney(order.tax_total)} />
          <SubLineItem
            title="Shipping"
            value={convertMoney(order.shipping_total)}
          />
          <Separator />
          <div className="flex justify-between">
            <Heading desktopSize="base" font="sans" mobileSize="sm" tag="h4">
              Total
            </Heading>
            <Heading desktopSize="base" font="sans" mobileSize="sm" tag="h4">
              {convertMoney(order.total)}
            </Heading>
          </div>
          <Separator />
        </div>
      </div>
      <div className="gap-s flex flex-col">
        <Heading desktopSize="xl" font="serif" mobileSize="lg" tag="h2">
          Delivery
        </Heading>
        <div className="gap-xl lg:gap-s flex flex-col lg:flex-row">
          <div className="flex flex-1 flex-col gap-[6px]">
            <Body
              className="mb-[6px] font-semibold"
              desktopSize="base"
              font="sans"
            >
              Shipping Address
            </Body>
            <Body className="font-medium" desktopSize="base" font="sans">
              {order.shipping_address?.first_name}{" "}
              {order.shipping_address?.last_name}
            </Body>
            <Body className="font-medium" desktopSize="base" font="sans">
              {order.shipping_address?.address_1}
            </Body>
            <Body className="font-medium" desktopSize="base" font="sans">
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
              Contact
            </Body>
            <Body className="font-medium" desktopSize="base" font="sans">
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
                Method
              </Body>
              <Body className="font-medium" desktopSize="base" font="sans">
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
    <div className="gap-xl flex items-center justify-between">
      <Body className="mb-[6px] font-semibold" desktopSize="base" font="sans">
        {title}
      </Body>
      <Body className="mb-[6px] font-semibold" desktopSize="base" font="sans">
        {value}
      </Body>
    </div>
  );
}
