import type {HttpTypes} from "@medusajs/types";
import type {Metadata} from "next";

import {getCustomer} from "@/data/medusa/customer";
import {listOrders} from "@/data/medusa/order";
import {convertToLocale} from "@/utils/medusa/money";
import Link from "next/link";
import {notFound} from "next/navigation";

export const metadata: Metadata = {
  description: "Overview of your account activity.",
  title: "Account",
};

export default async function AccountPage() {
  const customer = await getCustomer();
  const orders = await listOrders();

  if (!customer) {
    notFound();
  }

  return (
    <div data-testid="overview-page-wrapper">
      <div className="">
        <div className="text-xl-semi mb-4 flex items-center justify-between">
          <span data-testid="welcome-message" data-value={customer?.first_name}>
            Hello {customer?.first_name}
          </span>
          <span className="text-small-regular text-ui-fg-base">
            Signed in as:{" "}
            <span
              className="font-semibold"
              data-testid="customer-email"
              data-value={customer?.email}
            >
              {customer?.email}
            </span>
          </span>
        </div>
        <div className="flex flex-col border-t border-gray-200 py-8">
          <div className="col-span-1 row-span-2 flex h-full flex-1 flex-col gap-y-4">
            <div className="mb-6 flex items-start gap-x-16">
              <div className="flex flex-col gap-y-4">
                <h3 className="text-large-semi">Profile</h3>
                <div className="flex items-end gap-x-2">
                  <span
                    className="text-3xl-semi leading-none"
                    data-testid="customer-profile-completion"
                    data-value={getProfileCompletion(customer)}
                  >
                    {getProfileCompletion(customer)}%
                  </span>
                  <span className="text-base-regular text-ui-fg-subtle uppercase">
                    Completed
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-y-4">
                <h3 className="text-large-semi">Addresses</h3>
                <div className="flex items-end gap-x-2">
                  <span
                    className="text-3xl-semi leading-none"
                    data-testid="addresses-count"
                    data-value={customer?.addresses?.length || 0}
                  >
                    {customer?.addresses?.length || 0}
                  </span>
                  <span className="text-base-regular text-ui-fg-subtle uppercase">
                    Saved
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-y-4">
              <div className="flex items-center gap-x-2">
                <h3 className="text-large-semi">Recent orders</h3>
              </div>
              <ul
                className="flex flex-col gap-y-4"
                data-testid="orders-wrapper"
              >
                {orders && orders.length > 0 ? (
                  orders.slice(0, 5).map((order) => {
                    return (
                      <li
                        data-testid="order-wrapper"
                        data-value={order.id}
                        key={order.id}
                      >
                        <Link href={`/account/orders/details/${order.id}`}>
                          <div className="text-small-regular grid flex-1 grid-cols-3 grid-rows-2 gap-x-4">
                            <span className="font-semibold">Date placed</span>
                            <span className="font-semibold">Order number</span>
                            <span className="font-semibold">Total amount</span>
                            <span data-testid="order-created-date">
                              {new Date(order.created_at).toDateString()}
                            </span>
                            <span
                              data-testid="order-id"
                              data-value={order.display_id}
                            >
                              #{order.display_id}
                            </span>
                            <span data-testid="order-amount">
                              {convertToLocale({
                                amount: order.total,
                                currency_code: order.currency_code,
                              })}
                            </span>
                          </div>
                          <button
                            className="flex items-center justify-between"
                            data-testid="open-order-button"
                          >
                            <span className="sr-only">
                              Go to order #{order.display_id}
                            </span>
                            --chvron down icon---
                          </button>
                        </Link>
                      </li>
                    );
                  })
                ) : (
                  <span data-testid="no-orders-message">No recent orders</span>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const getProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
  let count = 0;

  if (!customer) {
    return 0;
  }

  if (customer.email) {
    count++;
  }

  if (customer.first_name && customer.last_name) {
    count++;
  }

  if (customer.phone) {
    count++;
  }

  const billingAddress = customer.addresses?.find(
    (addr) => addr.is_default_billing,
  );

  if (billingAddress) {
    count++;
  }

  return (count / 4) * 100;
};
