"use client";
import type {HttpTypes} from "@medusajs/types";

import {Cta} from "@/components/shared/button";
import PromotionForm from "@/components/shared/promotion-form";
import {TotalsBreakdown} from "@/components/shared/totals-breakdown";
import Heading from "@/components/shared/typography/heading";
import {Label, cn} from "@merchify/ui";
import {ChevronDown, ChevronUp, TicketPercent} from "lucide-react";
import {useState} from "react";

import LineItem from "./line-item";
import {MerchifyCart} from "@/types";

export default function CartDetails({cart}: {cart: MerchifyCart}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="mx-auto max-w-lg lg:max-w-none">
      <div
        className="flex items-center justify-between lg:block"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <Heading desktopSize="xl" font="serif" mobileSize="xl" tag="h3">
          تفاصيل الطلب
        </Heading>
        <Cta className="lg:hidden" size="sm" variant="ghost">
          {expanded ? <ChevronUp /> : <ChevronDown />}
        </Cta>
      </div>

      <div
        className={cn(
          "overflow-y-clip transition-all duration-300 ease-in-out",
          "data-[mobile-state=closed]:max-h-0 data-[mobile-state=open]:max-h-[1000px]",
          "lg:max-h-fit lg:overflow-visible",
        )}
        data-mobile-state={expanded ? "open" : "closed"}
      >
        <div className="flex flex-col gap-4 py-2">
          <div className="divide-border mt-2 flex flex-col gap-4 divide-y">
            {cart.items?.map((item) => <LineItem key={item.id} {...item} />)}
          </div>
          <div className="flex flex-col gap-2 border-t py-4">
            <Label>
              <TicketPercent className="me-1 inline-block size-5" />
              هل لديك كود خصم؟
            </Label>
            <PromotionForm cart={cart} />
          </div>
          <TotalsBreakdown className="border-t py-4" data={cart} />
        </div>
      </div>
    </div>
  );
}
