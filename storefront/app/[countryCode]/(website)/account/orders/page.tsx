import type {Metadata} from "next";

import Heading from "@/components/shared/typography/heading";
import {listOrders} from "@/data/medusa/order";
import {Separator} from "@merchify/ui";
import {notFound} from "next/navigation";

import {columns} from "./_parts/order-data-table/columns";
import DataTable from "./_parts/order-data-table/data-table";

export const metadata: Metadata = {
  description: "Overview of your previous orders.",
  title: "Orders",
};

export default async function Orders() {
  const orders = await listOrders();

  if (!orders) {
    notFound();
  }
  return (
    <div className="space-y-6">
      <div>
        <Heading mobileSize="lg" tag="h3">
          الطلبات
        </Heading>
        <p className="text-muted-foreground text-sm">عرض سجل الطلبات</p>
      </div>
      <Separator />
      <DataTable columns={columns} data={orders} />
    </div>
  );
}
