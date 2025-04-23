import type {HttpTypes} from "@medusajs/types";

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & object;

export type UnionToIntersection<T> = Prettify<
  (T extends any ? (x: T) => any : never) extends (x: infer R) => any
    ? R
    : never
>;

export interface PageProps<
  TParams extends string = never,
  TSearchParams extends string = never,
> {
  params: Promise<
    UnionToIntersection<
      {
        [K in TParams]: {
          [F in K extends `...${infer U}` ? U : K]: K extends `...${string}`
            ? string[]
            : string;
        };
      }[TParams]
    >
  >;
  searchParams: Promise<{[K in TSearchParams]?: string | string[]}>;
}

export type SearchParams<T extends string> = {
  [K in T]?: string | string[];
};

export interface MerchifyProduct extends HttpTypes.StoreProduct {
  care_instructions?: MerchifyProductCareInstruction[] | null;
  feature_entries?: MerchifyProductFeature[] | null;
  metadata?:
    | ({
        details: string[];
        size_chart: MerchifyProductSizeChart;
      } & Record<string, unknown>)
    | null;
}

export interface MerchifyProductOption
  extends Omit<HttpTypes.StoreProductOption, "values"> {
  metadata?:
    | ({
        type: string;
      } & Record<string, unknown>)
    | null;
  values: MerchifyProductOptionValue[];
}

export interface MerchifyProductOptionValue
  extends HttpTypes.StoreProductOptionValue {
  metadata?:
    | ({
        color: {hex: string};
      } & Record<string, unknown>)
    | null;
}

export interface MerchifyProductSizeChart {
  columns: string[]; // Array of column headers
  rows: {[key: string]: string}[]; // Array of rows with dynamic keys
}

export interface MerchifyProductCareInstruction {
  code: string;
  symbol_url: string;
  title: string;
}

export interface MerchifyProductFeature {
  content: string;
  template: {
    name: string;
    symbol_url: string;
  };
}

export interface MerchifyPrintfile {
  filename: string;
  metadata?: Record<string, unknown> | null;
  objects: Record<string, unknown>[];
  version?: number;
}

export interface MerchifyPrintfileLineItem {
  filename: string;
  id: string;
  is_rendered_source: boolean;
  metadata?: Record<string, unknown> | null;
  printfile?: {
    preview_url: string;
  };
  rendition?: {
    preview_url: string;
  };
  title: string;
  unit_price: number;
}

export interface MerchifyCartLineItem extends HttpTypes.StoreCartLineItem {
  printfile_line_items: MerchifyPrintfileLineItem[];
}

export type GeolocationAddress = {
  address_1: string;
  address_2: string;
  city: string;
  province?: string;
  postal_code?: string;
  country_code: string;
};
