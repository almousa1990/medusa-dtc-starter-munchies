import type {PageProps} from "@/types";
import type {Metadata} from "next";

import {CartProvider} from "@/components/context/cart-context";
import {Link} from "@/components/shared/button";
import {TotalsBreakdown} from "@/components/shared/totals-breakdown";
import Heading from "@/components/shared/typography/heading";
import {getCart} from "@/data/medusa/cart";
import {Label} from "@merchify/ui";
import {TicketPercent} from "lucide-react";

import EmptyCartMessage from "./_parts/empty-card-message";
import LineItem from "./_parts/line-item";
import PromotionForm from "@/components/shared/promotion-form";

export const metadata: Metadata = {
  description: "View your cart",
  title: "Cart",
};

type CartPageProps = PageProps<"countryCode">;

export default async function CartPage(props: CartPageProps) {
  const cart = await getCart();
  const params = await props.params;

  return cart?.items?.length ? (
    <CartProvider cart={cart} countryCode={params.countryCode}>
      <main className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <Heading desktopSize="4xl" font="serif" mobileSize="2xl" tag="h1">
          سلة المشتريات
        </Heading>
        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-content" className="lg:col-span-7">
            <div className="divide-border border-border divide-y border-t border-b">
              {cart.items?.map((item) => <LineItem key={item.id} {...item} />)}
            </div>
          </section>
          <section
            aria-labelledby="cart-summary"
            className="mt-16 lg:col-span-5 lg:mt-0"
          >
            <div className="grid gap-4">
              <div className="bg-background grid gap-4 rounded-md border px-4 py-6 sm:p-6 lg:py-8">
                <Heading desktopSize="lg" mobileSize="xl" tag="h3">
                  ملخص الطلب
                </Heading>
                <TotalsBreakdown variant="small" data={cart} />
                <div className="bg-accent -mx-4 flex flex-col gap-2 px-4 py-4 sm:-mx-6 sm:px-6">
                  <Label>
                    <TicketPercent className="me-1 inline-block size-5" /> هل
                    لديك كود خصم؟
                  </Label>
                  <PromotionForm cart={cart} />
                </div>
                <Link className="w-full" href="/checkout" variant="default">
                  إتمام الطلب
                </Link>
                <Link className="w-full" href="/products" variant="secondary">
                  العودة للتسوق
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </CartProvider>
  ) : (
    <EmptyCartMessage />
  );
}
