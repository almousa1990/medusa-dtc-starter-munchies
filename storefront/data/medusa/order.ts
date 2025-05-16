"use server";

import type {MerchifyOrder} from "@/types";
import type {HttpTypes} from "@medusajs/types";

import medusaError from "@/utils/medusa/error";

import medusa from "./client";
import {getAuthHeaders, getCacheHeaders} from "./cookies";

export const getOrder = async function (id: string) {
  return medusa.store.order
    .retrieve(
      id,
      {
        fields:
          "*payment_collections.payments, *fulfillments.labels, *fulfillments.items, *fulfillments.shipping_option, +items.*, +items.printfile_line_items.*,+items.printfile_line_items.rendition.preview_url,+items.printfile_line_items.printfile.preview_url",
      },
      {...(await getCacheHeaders("orders")), ...(await getAuthHeaders())},
    )
    .then(({order}) => order as MerchifyOrder)
    .catch((err) => medusaError(err));
};

export const listOrders = async function (
  limit: number = 10,
  offset: number = 0,
  filters?: Record<string, any>,
) {
  const headers = {
    ...(await getAuthHeaders()),
  };

  return medusa.client
    .fetch<HttpTypes.StoreOrderListResponse>(`/store/orders`, {
      headers,
      method: "GET",
      query: {
        fields:
          "*items,+items.metadata,*items.variant,*items.product,*customer",
        limit,
        offset,
        order: "-created_at",
        ...filters,
      },
    })
    .then(({orders}) => orders)
    .catch((err) => medusaError(err));
};
