"use client";

import type {StoreOrder} from "@medusajs/types";
import type {ColumnDef} from "@tanstack/react-table";

import {convertToLocale} from "@/utils/medusa/money";
import {getOrderStatusLabel} from "@/utils/medusa/order";
import {Button} from "@merchify/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@merchify/ui";
import {MoreHorizontal} from "lucide-react";
import Link from "next/link";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<StoreOrder>[] = [
  {
    accessorKey: "display_id",
    header: "#",
  },
  {
    accessorKey: "customer",
    cell: ({row}) => {
      const order = row.original;

      return (
        <div className="text-right font-medium">
          {order.customer?.first_name} {order.customer?.last_name}
        </div>
      );
    },
    header: "العميل",
  },
  {
    accessorKey: "total",
    cell: ({row}) => {
      const order = row.original;
      return convertToLocale({
        amount: order.total,
        currency_code: order.currency_code,
      });
    },
    header: "الإجمالي",
  },
  {
    accessorKey: "status",
    cell: ({row}) => {
      const order = row.original;
      return getOrderStatusLabel(order.status);
    },
    header: "الحالة",
  },
  {
    accessorKey: "created_at",
    cell: ({row}) => {
      const order = row.original;
      return new Date(order.created_at ?? "").toLocaleDateString(
        "ar-SA-u-ca-gregory",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        },
      );
    },
    header: "التاريخ",
  },
  {
    cell: ({row}) => {
      const order = row.original;

      return (
        <DropdownMenu dir="rtl">
          <DropdownMenuTrigger asChild>
            <Button className="h-8 w-8 p-0" variant="ghost">
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
    id: "actions",
  },
];
