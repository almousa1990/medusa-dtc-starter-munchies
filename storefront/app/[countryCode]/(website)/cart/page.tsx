import type {Metadata} from "next";

import {Link} from "@/components/shared/button";
import Heading from "@/components/shared/typography/heading";
import {getCart} from "@/data/medusa/cart";
import {notFound} from "next/navigation";

import PromotionForm from "../../../../components/shared/promotion-form";
import LineItem from "./_parts/line-item";
import {CartSummary} from "./_parts/summary";
import {CartProvider} from "@/components/context/cart-context";
import {PageProps} from "@/types";

export const metadata: Metadata = {
  description: "View your cart",
  title: "Cart",
};

type CartPageProps = PageProps<"countryCode">;

export default async function Cart(props: CartPageProps) {
  const cart = await getCart();
  const params = await props.params;

  if (!cart) {
    return notFound();
  }
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
              <CartSummary cart={cart} />
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
    <>empty cart</>
  );
}
