import type {MerchifyPrintfileLineItem} from "@/types";

import {convertToLocale} from "@/utils/medusa/money";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@merchify/ui";
import {AlertCircle, ExternalLink, Fullscreen} from "lucide-react";
import Image from "next/image";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "./tabs";

export default function PrintfileLineItemPreviewer({
  currencyCode,
  items,
}: {
  currencyCode?: string | null;
  items?: MerchifyPrintfileLineItem[];
}) {
  if (!items) return null;

  const getPrice = (item: MerchifyPrintfileLineItem) =>
    convertToLocale({
      amount: item?.unit_price || 0,
      currency_code: (currencyCode || null)!,
    });

  return (
    <Dialog>
      <DialogTrigger className="flex w-fit items-center gap-2 rounded-md border border-dashed px-3 py-2 text-sm">
        <ExternalLink className="size-4" />
        <div className="flex gap-1">
          <span className="font-medium">{items.length}</span>{" "}
          <span className="font-xs">x</span> ملف طباعة
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle> ملفات الطباعة</DialogTitle>
        <DialogDescription className="sr-only">
          استعراض ملفات الطباعة
        </DialogDescription>

        <Tabs>
          <TabsList>
            {items.map((i) => (
              <TabsTrigger key={i.id} value={i.filename}>
                {i.title}
                <span className="text-sm font-normal">({getPrice(i)})</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <Alert className="[&>svg]:right-4 [&>svg+div]:translate-y-[3px] [&>svg~*]:pr-7">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>معاينة</AlertTitle>
            <AlertDescription>
              الصورة لغرض المعاينة ولا توضح الأبعاد الفعلية لملف الطباعة.
            </AlertDescription>
          </Alert>

          {items.map((i) => (
            <TabsContent key={i.filename} value={i.filename}>
              <div className="flex items-center justify-center">
                <div
                  style={{
                    background: `repeating-conic-gradient(#f2f2f2 0% 25%, transparent 0% 50%) 50% / 20px 20px`,
                  }}
                >
                  <Image
                    alt={i.title}
                    className="max-h-80 object-contain"
                    height={360}
                    src={
                      i.is_rendered_source
                        ? (i.rendition?.preview_url ?? "")
                        : (i.printfile?.preview_url ?? "")
                    }
                    width={360}
                  />
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
