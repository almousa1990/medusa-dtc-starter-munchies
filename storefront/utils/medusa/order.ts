import {
  FulfillmentItemDTO,
  OrderStatus,
  StoreOrderFulfillment,
  StoreOrderLineItem,
} from "@medusajs/types";

const orderStatusLabels: Record<OrderStatus, string> = {
  pending: "قيد المعالجة",
  completed: "مكتمل",
  draft: "مسودة",
  archived: "مؤرشف",
  canceled: "ملغي",
  requires_action: "يتطلب إجراء",
};
export function getOrderStatusLabel(status: OrderStatus | string): string {
  return orderStatusLabels[status as OrderStatus] || "Unknown Status";
}

type EnrichedFulfillmentItem = FulfillmentItemDTO & {
  line_item: StoreOrderLineItem | undefined;
};

type EnrichedFulfillment = Omit<StoreOrderFulfillment, "items"> & {
  items: EnrichedFulfillmentItem[];
};

export function enrichFulfillmentsWithOrderItems(
  fulfillments?: StoreOrderFulfillment[] | null,
  items?: StoreOrderLineItem[] | null,
): EnrichedFulfillment[] {
  if (!fulfillments || !items) return [];

  const itemMap = new Map(items.map((item) => [item.id, item]));

  return fulfillments.map((fulfillment) => ({
    ...fulfillment,
    items: fulfillment.items?.map((fi) => ({
      ...fi,
      line_item: itemMap.get(fi.line_item_id),
    })),
  }));
}

export enum FulfillmentStep {
  Pending = "pending",
  Packed = "تم التجهيز",
  Shipped = "تم الشحن",
  Delivered = "تم التسليم",
}
type FulfillmentState = {
  step: FulfillmentStep;
  date: Date | null;
  progress: number; // 0 to 1
};

export function getFulfillmentState(
  fulfillment: StoreOrderFulfillment,
): FulfillmentState {
  if (fulfillment.delivered_at) {
    return {
      step: FulfillmentStep.Delivered,
      date: fulfillment.delivered_at,
      progress: 1,
    };
  }

  if (fulfillment.shipped_at) {
    return {
      step: FulfillmentStep.Shipped,
      date: fulfillment.shipped_at,
      progress: 2 / 3,
    };
  }

  if (fulfillment.packed_at) {
    return {
      step: FulfillmentStep.Packed,
      date: fulfillment.packed_at,
      progress: 1 / 3,
    };
  }

  return {step: FulfillmentStep.Pending, date: null, progress: 0};
}
