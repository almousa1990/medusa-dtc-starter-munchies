"use client";

import {Button} from "@merchify/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@merchify/ui";
import {StoreOrder} from "@medusajs/types";
import {ColumnDef} from "@tanstack/react-table";
import {MoreHorizontal} from "lucide-react";
import Link from "next/link";
import {convertToLocale} from "@/utils/medusa/money";
import {getOrderStatusLabel} from "@/utils/medusa/order";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<StoreOrder>[] = [
  {
    accessorKey: "display_id",
    header: "#",
  },
  {
    accessorKey: "customer",
    header: "العميل",
    cell: ({row}) => {
      const order = row.original;

      return (
        <div className="text-right font-medium">
          {order.customer?.first_name} {order.customer?.last_name}
        </div>
      );
    },
  },
  {
    accessorKey: "total",
    header: "الإجمالي",
    cell: ({row}) => {
      const order = row.original;
      return convertToLocale({
        amount: order.total,
        currency_code: order.currency_code,
      });
    },
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({row}) => {
      const order = row.original;
      return getOrderStatusLabel(order.status);
    },
  },
  {
    accessorKey: "created_at",
    header: "التاريخ",
    cell: ({row}) => {
      const order = row.original;
      return new Date(order.created_at ?? "").toLocaleDateString(
        "ar-SA-u-ca-gregory",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        },
      );
    },
  },
  {
    id: "actions",
    cell: ({row}) => {
      const order = row.original;

      return (
        <DropdownMenu dir="rtl">
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">فتح القائمة</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(order.id)}
            >
              نسخ رقم الطلب
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/account/orders/${order.id}`}>التفاصيل</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
