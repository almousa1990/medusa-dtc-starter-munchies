"use client";
import type {HttpTypes} from "@medusajs/types";

import {Cta} from "@/components/shared/button";
import PromotionForm from "@/components/shared/promotion-form";
import {TotalsBreakdown} from "@/components/shared/totals-breakdown";
import Heading from "@/components/shared/typography/heading";
import {Label, cn} from "@merchify/ui";
import {ChevronDown, ChevronUp} from "lucide-react";
import {useState} from "react";

import LineItem from "./line-item";

export default function CartDetails({cart}: {cart: HttpTypes.StoreCart}) {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <>
      <div className="flex items-center justify-between lg:block">
        <Heading
          className="lg:sr-only"
          desktopSize="xl"
          font="serif"
          mobileSize="lg"
          tag="h3"
        >
          تفاصيل الطلب
        </Heading>
        <Cta
          className="lg:hidden"
          onClick={() => setShowDetails((prev) => !prev)}
          size="sm"
          variant="ghost"
        >
          {showDetails ? <ChevronUp /> : <ChevronDown />}
        </Cta>
      </div>

      <div
        className={cn(
          "overflow-y-clip transition-all duration-300 ease-in-out",
          "data-[state=closed]:max-h-0 data-[state=open]:max-h-[1000px]",
          "lg:max-h-fit lg:overflow-visible",
        )}
        data-state={showDetails ? "open" : "closed"}
      >
        <div className="flex flex-col gap-8">
          <div className="mt-2 flex flex-col gap-4">
            {cart.items?.map((item) => <LineItem key={item.id} {...item} />)}
          </div>
          <div className="flex flex-col gap-2">
            <Label>هل لديك كود خصم؟</Label>
            <PromotionForm cart={cart} />
          </div>
          <TotalsBreakdown data={cart} />
        </div>
      </div>
    </>
  );
}
