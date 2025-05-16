import type {MerchifyOrderLineItem} from "@/types";
import type {
  FulfillmentItemDTO,
  OrderStatus,
  StoreOrderFulfillment,
  StoreOrderLineItem,
  StoreShippingOption,
} from "@medusajs/types";

const orderStatusLabels: Record<OrderStatus, string> = {
  archived: "مؤرشف",
  canceled: "ملغي",
  completed: "مكتمل",
  draft: "مسودة",
  pending: "قيد المعالجة",
  requires_action: "يتطلب إجراء",
};
export function getOrderStatusLabel(status: OrderStatus | string): string {
  return orderStatusLabels[status as OrderStatus] || "Unknown Status";
}

type EnrichedFulfillmentItem = {
  line_item: MerchifyOrderLineItem;
} & FulfillmentItemDTO;

type EnrichedFulfillment = {
  items: EnrichedFulfillmentItem[];
  labels?: {
    id: string;
    /**
     * The label's URL.
     */
    label_url: string;
    /**
     * The label's tracking number.
     */
    tracking_number: string;
    /**
     * The label's tracking URL.
     */
    tracking_url: string;
  }[];
  shipping_option?: StoreShippingOption;
} & Omit<StoreOrderFulfillment, "items" | "labels" | "shipping_option">;

export function enrichFulfillmentsWithOrderItems(
  fulfillments?: StoreOrderFulfillment[] | null,
  items?: StoreOrderLineItem[] | null,
): EnrichedFulfillment[] {
  if (!fulfillments || !items) return [];

  const itemMap = new Map(items.map((item) => [item.id, item]));

  return fulfillments.map((fulfillment) => ({
    ...fulfillment,
    items: (
      fulfillment as {items: FulfillmentItemDTO[]} & StoreOrderFulfillment
    ).items?.map((fi) => ({
      ...fi,
      line_item: itemMap.get(
        fi.line_item_id as string,
      ) as MerchifyOrderLineItem,
    })),
  }));
}

export enum FulfillmentStep {
  Delivered = "تم التسليم",
  Packed = "تم التجهيز",
  Pending = "pending",
  Shipped = "تم الشحن",
}
type FulfillmentState = {
  date: Date | null;
  progress: number; // 0 to 1
  step: FulfillmentStep;
};

export function getFulfillmentState(
  fulfillment: StoreOrderFulfillment,
): FulfillmentState {
  if (fulfillment.delivered_at) {
    return {
      date: fulfillment.delivered_at,
      progress: 1,
      step: FulfillmentStep.Delivered,
    };
  }

  if (fulfillment.shipped_at) {
    return {
      date: fulfillment.shipped_at,
      progress: 2 / 3,
      step: FulfillmentStep.Shipped,
    };
  }

  if (fulfillment.packed_at) {
    return {
      date: fulfillment.packed_at,
      progress: 1 / 3,
      step: FulfillmentStep.Packed,
    };
  }

  return {date: null, progress: 0, step: FulfillmentStep.Pending};
}
