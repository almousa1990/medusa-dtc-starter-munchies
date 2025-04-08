import type {HttpTypes} from "@medusajs/types";
import type {Metadata} from "next";

import {retrieveOrder} from "@/actions/medusa/order";
import {TotalsBreakdown} from "@/components/shared/totals-breakdown";
import {repeat} from "@/utils/repeat";
import {Separator} from "@merchify/ui";
import {notFound} from "next/navigation";

import LineItem, {LineItemSkeleton} from "../_parts/line-item";

type Props = {
  params: Promise<{id: string}>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const order = await retrieveOrder(params.id).catch(() => null);

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
  const order = await retrieveOrder(params.id).catch(() => null);

  if (!order) {
    notFound();
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">الطلبات</h3>
          <p className="text-muted-foreground text-sm">عرض سجل الطلبات</p>
        </div>
        <Separator />
        <OrderDetails order={order} />
      </div>
    </>
  );
}

export function OrderDetails({order}: {order: HttpTypes.StoreOrder}) {
  return (
    <>
      <dl className="my-16 grid grid-cols-1 gap-x-4 gap-y-6 text-gray-600 lg:grid-cols-4">
        <div>
          <dt className="font-medium text-gray-900">تاريخ الطلب</dt>
          <dd className="mt-2">
            <time dateTime={new Date(order.created_at).toDateString()}>
              {new Date(order.created_at).toDateString()}
            </time>
          </dd>
        </div>
        <div>
          <dt className="font-medium text-gray-900">رقم الطلب</dt>
          <dd className="mt-2">
            <dd className="font-medium text-gray-900">{order.display_id}</dd>
          </dd>
        </div>
        <div>
          <dt className="font-medium text-gray-900">حالة الطلب</dt>
          <dd className="mt-2">
            <dd className="font-medium text-gray-900">
              {order.fulfillment_status}
            </dd>
          </dd>
        </div>
        <div>
          <dt className="font-medium text-gray-900">رقم التتبع</dt>
          <dd className="mt-2">
            <dd className="font-medium text-gray-900">todo</dd>
          </dd>
        </div>
      </dl>
      <div className="mt-2 flex flex-col gap-4">
        {order.items?.length
          ? order.items
              .sort((a, b) => {
                return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1;
              })
              .map((item) => {
                return <LineItem key={item.id} {...item} />;
              })
          : repeat(5).map((i) => {
              return <LineItemSkeleton key={i} />;
            })}
      </div>
      <dl className="space-y-6 pt-6">
        <TotalsBreakdown data={order} />
      </dl>
      <dl className="mt-16 grid grid-cols-1 gap-x-4 gap-y-6 text-gray-600 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <dt className="font-medium text-gray-900">التوصيل</dt>
          <dd className="mt-2">
            <p>{order.shipping_methods?.[0].name}</p>
            <p>{order.shipping_methods?.[0].description}</p>
          </dd>
        </div>
        <div>
          <dt className="font-medium text-gray-900">العنوان</dt>
          <dd className="mt-2">
            <address className="not-italic">
              <span className="block">
                {order.shipping_address?.first_name}{" "}
                {order.shipping_address?.last_name}
              </span>
              <span className="block">
                {order.shipping_address?.address_1}{" "}
                {order.shipping_address?.address_2}
              </span>
              <span className="block">
                {order.shipping_address?.postal_code},{" "}
                {order.shipping_address?.city}
              </span>
            </address>
          </dd>
        </div>
        {
          /** todo**/ true && (
            <div>
              <dt className="font-medium text-gray-900">الدفع</dt>
              <dd className="mt-2 space-y-2 sm:flex sm:space-y-0 sm:space-x-4">
                todo
              </dd>
            </div>
          )
        }
      </dl>
    </>
  );
}
