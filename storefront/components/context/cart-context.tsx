"use client";

import type {MerchifyCart, MerchifyCartLineItem} from "@/types";
import type {StorePromotion} from "@medusajs/types";
import type {Dispatch, PropsWithChildren, SetStateAction} from "react";

import {
  addDecoratedToCart,
  refreshCartDecoratedLineItem,
  updateCartDecoratedLineItem,
} from "@/actions/medusa/cart";
import {usePathname} from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useOptimistic,
  useState,
  useTransition,
} from "react";

import type {AddToCartEventPayload} from "../../utils/event-bus";

import {addToCartEventBus} from "../../utils/event-bus";

type Cart = {
  promotions?: StorePromotion[];
} & MerchifyCart;

const CartContext = createContext<
  | {
      cart: Cart | null;
      cartOpen: boolean;
      handleDeleteItem: (lineItem: string) => Promise<void>;
      handleRefreshItem: (lineItem: string) => Promise<void>;
      handleUpdateItem: (
        lineItem: string,
        update: {
          printfiles?: any[];
          quantity?: number;
        },
      ) => Promise<void>;
      isUpdating: boolean;
      setCartOpen: Dispatch<SetStateAction<boolean>>;
    }
  | undefined
>(undefined);

export function CartProvider({
  cart,
  children,
  countryCode,
}: PropsWithChildren<{
  cart: Cart | null;
  countryCode: string;
}>) {
  const [optimisticCart, setOptimisticCart] = useOptimistic<Cart | null>(cart);
  const [cartOpen, setCartOpen] = useState(false);

  const [, startTransition] = useTransition();
  const pathname = usePathname();

  const handleOptimisticAddToCart = useCallback(
    async (payload: AddToCartEventPayload) => {
      setCartOpen(true);

      startTransition(async () => {
        setOptimisticCart((prev) => {
          const items = [...(prev?.items || [])];

          const existingItemIndex = items.findIndex(
            ({variant}) => variant?.id === payload.productVariant.id,
          );

          if (existingItemIndex > -1) {
            const item = items[existingItemIndex];
            items[existingItemIndex] = {
              ...item,
              quantity: item.quantity + 1,
            };
            return {...prev, items} as Cart;
          }

          const priceAmount =
            payload.productVariant.calculated_price?.calculated_amount || 0;

          const newItem: MerchifyCartLineItem = {
            cart: prev || ({} as MerchifyCart),
            cart_id: prev?.id || "",
            discount_tax_total: 0,
            discount_total: 0,
            id: generateOptimisticItemId(payload.productVariant.id),
            is_discountable: false,
            is_tax_inclusive: false,
            item_subtotal: priceAmount,
            item_tax_total: 0,
            item_total: priceAmount,
            original_subtotal: priceAmount,
            original_tax_total: 0,
            original_total: priceAmount,
            printfile_line_items: [],
            product: payload.productVariant.product || undefined,
            quantity: 1,
            requires_shipping: true,
            subtotal: priceAmount,
            tax_total: 0,
            title: payload.productVariant.title || "",
            total: priceAmount,
            unit_price: priceAmount,
            variant: payload.productVariant || undefined,
          };

          const newItems = [...items, newItem];

          const newTotal = calculateCartTotal(newItems);

          return {...prev, item_total: newTotal, items: newItems} as Cart;
        });

        await addDecoratedToCart({
          printfiles: payload.printfiles,
          quantity: 1,
          region_id: payload.regionId,
          variantId: payload.productVariant.id,
        });
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setCartOpen, setOptimisticCart, cart],
  );

  useEffect(() => {
    addToCartEventBus.registerCartAddHandler(handleOptimisticAddToCart);
  }, [handleOptimisticAddToCart]);

  useEffect(() => {
    setCartOpen(false);
  }, [pathname]);

  const handleDeleteItem = async (lineItem: string) => {
    handleUpdateItem(lineItem, {quantity: 0});
  };

  const handleUpdateItem = async (
    lineItem: string,
    update: {printfiles?: any[]; quantity?: number},
  ) => {
    const item = optimisticCart?.items?.find(({id}) => id === lineItem);

    if (!item) return;

    startTransition(() => {
      setOptimisticCart((prev) => {
        if (!prev) return prev;

        const optimisticItems = prev.items?.reduce(
          (acc: MerchifyCartLineItem[], item) => {
            if (item.id === lineItem) {
              return update.quantity === 0
                ? acc
                : [
                    ...acc,
                    {...item, quantity: update.quantity ?? item.quantity},
                  ];
            }
            return [...acc, item];
          },
          [],
        );

        const optimisticTotal = optimisticItems?.reduce(
          (acc, item) => acc + item.unit_price * item.quantity,
          0,
        );

        return {
          ...prev,
          item_subtotal: optimisticTotal || 0,
          items: optimisticItems,
        };
      });
    });

    if (!isOptimisticItemId(lineItem)) {
      await updateCartDecoratedLineItem({
        countryCode,
        lineItem,
        printfiles: update.printfiles,
        quantity: update.quantity,
      });
    }
  };

  const handleRefreshItem = async (lineItem: string) => {
    await refreshCartDecoratedLineItem(lineItem);
  };

  return (
    <CartContext.Provider
      value={{
        cart: optimisticCart,
        cartOpen,
        handleDeleteItem,
        handleRefreshItem,
        handleUpdateItem,
        isUpdating: JSON.stringify(cart) !== JSON.stringify(optimisticCart),
        setCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

const OPTIMISTIC_ITEM_ID_PREFIX = "__optimistic__";

function generateOptimisticItemId(variantId: string) {
  return `${OPTIMISTIC_ITEM_ID_PREFIX}-${variantId}`;
}

export function isOptimisticItemId(id: string) {
  return id.startsWith(OPTIMISTIC_ITEM_ID_PREFIX);
}

function calculateCartTotal(cartItems: MerchifyCartLineItem[]) {
  return (
    cartItems.reduce((acc, item) => acc + item.unit_price * item.quantity, 0) ||
    0
  );
}
