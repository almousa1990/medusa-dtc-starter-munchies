import {Metadata} from "next";

import {notFound} from "next/navigation";
import {listOrders} from "@/data/medusa/order";
import {Separator} from "@merchify/ui";
import {HttpTypes} from "@medusajs/types";
import {Cta} from "@/components/shared/button";
import LocalizedLink from "@/components/shared/localized-link";
import {convertToLocale} from "@/utils/medusa/money";
import {useMemo} from "react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Orders",
  description: "Overview of your previous orders.",
};

export default async function Orders() {
  const orders = await listOrders();
  console.log(orders);

  if (!orders) {
    notFound();
  }
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">الطلبات</h3>
        <p className="text-sm text-muted-foreground">عرض سجل الطلبات</p>
      </div>
      <Separator />
      <OrderList orders={orders} />
    </div>
  );
}

const OrderList = ({orders}: {orders: HttpTypes.StoreOrder[]}) => {
  if (orders?.length) {
    return (
      <div className="flex w-full flex-col gap-y-8">
        {orders.map((o) => (
          <div
            key={o.id}
            className="border-b border-gray-200 pb-6 last:border-none last:pb-0"
          >
            <OrderCard order={o} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="flex w-full flex-col items-center gap-y-4"
      data-testid="no-orders-container"
    >
      <h2 className="text-large-semi">Nothing to see here</h2>
      <p className="text-base-regular">
        You don&apos;t have any orders yet, let us change that {":)"}
      </p>
      <div className="mt-4">
        <LocalizedLink href="/" passHref>
          <Cta data-testid="continue-shopping-button">Continue shopping</Cta>
        </LocalizedLink>
      </div>
    </div>
  );
};

const OrderCard = ({order}: {order: HttpTypes.StoreOrder}) => {
  const numberOfLines = useMemo(() => {
    return (
      order.items?.reduce((acc, item) => {
        return acc + item.quantity;
      }, 0) ?? 0
    );
  }, [order]);

  const numberOfProducts = useMemo(() => {
    return order.items?.length ?? 0;
  }, [order]);

  return (
    <div className="flex flex-col bg-white" data-testid="order-card">
      <div className="text-large-semi mb-1 uppercase">
        #<span data-testid="order-display-id">{order.display_id}</span>
      </div>
      <div className="text-small-regular text-ui-fg-base flex items-center divide-x divide-gray-200">
        <span className="pr-2" data-testid="order-created-at">
          {new Date(order.created_at).toDateString()}
        </span>
        <span className="px-2" data-testid="order-amount">
          {convertToLocale({
            amount: order.total,
            currency_code: order.currency_code,
          })}
        </span>
        <span className="pl-2">{`${numberOfLines} ${
          numberOfLines > 1 ? "items" : "item"
        }`}</span>
      </div>
      <div className="small:grid-cols-4 my-4 grid grid-cols-2 gap-4">
        {order.items?.slice(0, 3).map((i) => {
          return (
            <div
              key={i.id}
              className="flex flex-col gap-y-2"
              data-testid="order-item"
            >
              <Image
                src={i.thumbnail || ""}
                width={100}
                height={100}
                alt={i.title}
              />
              <div className="text-small-regular text-ui-fg-base flex items-center">
                <span
                  className="text-ui-fg-base font-semibold"
                  data-testid="item-title"
                >
                  {i.title}
                </span>
                <span className="ml-2">x</span>
                <span data-testid="item-quantity">{i.quantity}</span>
              </div>
            </div>
          );
        })}
        {numberOfProducts > 4 && (
          <div className="flex h-full w-full flex-col items-center justify-center">
            <span className="text-small-regular text-ui-fg-base">
              + {numberOfLines - 4}
            </span>
            <span className="text-small-regular text-ui-fg-base">more</span>
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <LocalizedLink href={`/account/orders/details/${order.id}`}>
          <Cta data-testid="order-details-link" variant="outline">
            See details
          </Cta>
        </LocalizedLink>
      </div>
    </div>
  );
};
