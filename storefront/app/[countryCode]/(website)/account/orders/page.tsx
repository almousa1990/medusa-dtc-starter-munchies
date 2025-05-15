import {Metadata} from "next";

import {notFound} from "next/navigation";
import {listOrders} from "@/data/medusa/order";
import {Separator} from "@merchify/ui";
import DataTable from "./_parts/order-data-table/data-table";
import {columns} from "./_parts/order-data-table/columns";
import Heading from "@/components/shared/typography/heading";

export const metadata: Metadata = {
  title: "Orders",
  description: "Overview of your previous orders.",
};

export default async function Orders() {
  const orders = await listOrders();

  if (!orders) {
    notFound();
  }
  return (
    <div className="space-y-6">
      <div>
        <Heading tag="h3" mobileSize="lg">
          الطلبات
        </Heading>
        <p className="text-muted-foreground text-sm">عرض سجل الطلبات</p>
      </div>
      <Separator />
      <DataTable columns={columns} data={orders} />
    </div>
  );
}
