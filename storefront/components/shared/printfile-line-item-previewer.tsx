import type {MerchifyPrintfileLineItem} from "@/types";

import {convertToLocale} from "@/utils/medusa/money";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@merchify/ui";
import {AlertCircle, Fullscreen} from "lucide-react";
import Image from "next/image";

export default function PrintfileLineItemPreviewer({
  currencyCode,
  item,
}: {
  currencyCode?: string;
  item?: MerchifyPrintfileLineItem;
}) {
  if (!item) return null;

  const unit_price = convertToLocale({
    amount: item?.unit_price || 0,
    currency_code: (currencyCode || null)!,
  });

  return (
    <Dialog>
      <DialogTrigger className="flex items-center gap-2 rounded-md border px-4 py-1 text-sm">
        <Fullscreen className="h-4 w-4" />
        {item.title}
        <span className="ms-auto">{unit_price}</span>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{item.title}</DialogTitle>

        <Alert className="[&>svg]:right-4 [&>svg+div]:translate-y-[3px] [&>svg~*]:pr-7">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>معاينة</AlertTitle>
          <AlertDescription>
            الصورة لغرض المعاينة ولا توضح الأبعاد الفعلية لملف الطباعة.
          </AlertDescription>
        </Alert>
        <div className="flex items-center justify-center">
          <Image
            alt={item.title}
            className="h-[200px] w-[200px] object-cover"
            height={200}
            src={item?.preview_url || ""}
            width={200}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
