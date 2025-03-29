import {HttpTypes} from "@medusajs/types";

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
    | (Record<string, unknown> & {
        size_chart: MerchifyProductSizeChart;
        details: string[];
      })
    | null;
}

export interface MerchifyProductOption
  extends Omit<HttpTypes.StoreProductOption, "values"> {
  values: MerchifyProductOptionValue[];
  metadata?:
    | (Record<string, unknown> & {
        type: string;
      })
    | null;
}

export interface MerchifyProductOptionValue
  extends HttpTypes.StoreProductOptionValue {
  metadata?:
    | (Record<string, unknown> & {
        color: {hex: string};
      })
    | null;
}

export interface MerchifyProductSizeChart {
  rows: {[key: string]: string}[]; // Array of rows with dynamic keys
  columns: string[]; // Array of column headers
}

export interface MerchifyProductCareInstruction {
  code: string;
  title: string;
  symbol_url: string;
}

export interface MerchifyProductFeature {
  content: string;
  template: {
    name: string;
    symbol_url: string;
  };
}
