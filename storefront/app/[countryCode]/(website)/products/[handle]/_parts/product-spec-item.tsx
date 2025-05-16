"use client";

import type { ReactNode} from "react";

import Heading from "@/components/shared/typography/heading";
import {cn} from "@merchify/ui";
import {ChevronDown} from "lucide-react";
import {createContext, useContext, useState} from "react";

interface ProductSpecItemProps {
  children: ReactNode;
  defaultOpen?: boolean;
}

interface ProductSpecItemContextType {
  isOpen: boolean;
  toggle: () => void;
}

const ProductSpecItemContext = createContext<
  ProductSpecItemContextType | undefined
>(undefined);

export const useProductSpecItem = () => {
  const context = useContext(ProductSpecItemContext);
  if (!context) {
    throw new Error(
      "ProductSpecItem.* components must be used within <ProductSpecItem />",
    );
  }
  return context;
};

export const ProductSpecItem = ({
  children,
  defaultOpen = false,
}: ProductSpecItemProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <ProductSpecItemContext.Provider value={{isOpen, toggle}}>
      <div className="border-b py-4 lg:border-none">
        <div className="flex flex-col lg:flex-row">{children}</div>
      </div>
    </ProductSpecItemContext.Provider>
  );
};

export const ProductSpecItemTitle = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {isOpen, toggle} = useProductSpecItem();

  return (
    <div className="lg:w-1/4">
      <button
        className={cn(
          "flex w-full items-center justify-between text-left",
          "lg:pointer-events-none lg:cursor-default lg:select-text",
        )}
        onClick={toggle}
      >
        <Heading
          className="flex flex-col gap-4 lg:flex-row"
          desktopSize="2xl"
          mobileSize="lg"
          tag="h2"
        >
          {children}
        </Heading>
        <ChevronDown
          className={cn(
            "transition-transform lg:hidden",
            isOpen && "rotate-180",
          )}
          size={18}
        />
      </button>
    </div>
  );
};

export const ProductSpecItemContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {isOpen} = useProductSpecItem();

  return (
    <div
      className={cn(
        "overflow-hidden transition-all lg:w-3/4",
        isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0",
        "lg:block lg:max-h-full lg:opacity-100",
      )}
    >
      <div className="mt-4 lg:mt-0">{children}</div>
    </div>
  );
};
