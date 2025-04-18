import type {PageProps} from "@/types";
import type {Metadata} from "next";

import {CartProvider} from "@/components/context/cart-context";
import {Link} from "@/components/shared/button";
import {TotalsBreakdown} from "@/components/shared/totals-breakdown";
import Heading from "@/components/shared/typography/heading";
import {getCart} from "@/data/medusa/cart";
import {notFound} from "next/navigation";

import PromotionForm from "../../../../components/shared/promotion-form";
import EmptyCartMessage from "./_parts/empty-card-message";
import LineItem from "./_parts/line-item";

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
      <Heading desktopSize="3xl" mobileSize="3xl" tag="h3">
        سلة المشتريات
      </Heading>
      <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
        <section aria-labelledby="cart-content" className="lg:col-span-7">
          {/* Left column: Cart items */}
          <div className="divide-border border-border divide-y border-t border-b">
            {cart.items?.map((item) => <LineItem key={item.id} {...item} />)}
          </div>
        </section>
        {/* Right column: Order Summary */}
        <section
          aria-labelledby="cart-summary"
          className="mt-16 lg:col-span-5 lg:mt-0"
        >
          <div className="grid gap-4">
            <div className="bg-secondary rounded-md p-4">
              <PromotionForm cart={cart} />
            </div>
            <div className="bg-secondary grid gap-4 rounded-md p-4">
              <Heading desktopSize="xl" mobileSize="2xl" tag="h5">
                ملخص الطلب
              </Heading>
              <TotalsBreakdown data={cart} />
              <Link
                className="w-full"
                href="/checkout"
                size="lg"
                variant="default"
              >
                إتمام الطلب
              </Link>
            </div>
          </div>
        </section>
      </div>
    </CartProvider>
  ) : (
    <EmptyCartMessage />
  );
}
