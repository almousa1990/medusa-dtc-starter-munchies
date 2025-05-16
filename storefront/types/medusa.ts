import type {HttpTypes} from "@medusajs/types";
import type {BaseCalculatedPriceSet} from "@medusajs/types/dist/http/pricing/common";

export interface MerchifyProduct
  extends Omit<HttpTypes.StoreProduct, "options"> {
  care_instructions?: MerchifyProductCareInstruction[] | null;
  feature_entries?: MerchifyProductFeature[] | null;
  metadata?:
    | ({
        details: string[];
        size_chart: MerchifyProductSizeChart;
      } & Record<string, unknown>)
    | null;
  options: MerchifyProductOption[] | null;
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

export interface MerchifyPrintfileRenderInput {
  editor_session_id: string;
  filename: string;
}

export interface MerchifyPrintfileTemplate {
  calculated_price?: BaseCalculatedPriceSet;
  decoration_method: MerchifyPrintfileDecorationMethod;
  display_name: string;
  dpi: number;
  editor: MerchifyPrintfileEditor;
  editor_id: string;
  filename: string;
  height: number;
  id: string;
  metadata?: Record<string, unknown> | null;
  minDpi: number;
  rank: number;
  width: number;
}

export interface MerchifyPrintfileEditor {
  configuations?: Record<string, unknown> | null;
  default_objects?: Record<string, Record<string, unknown>> | null;
  id: string;
  layout_file: string;
  metadata?: Record<string, unknown> | null;
}

export interface MerchifyPrintfileDecorationMethod {
  color_palette?: Record<string, string> | null;
  description: string;
  handle: number;
  id: string;
  metadata?: Record<string, unknown> | null;
  name: string;
  restrictions: Record<string, boolean> | null;
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
    all_objects?: Record<string, unknown> | null;
    configurations?: Record<string, unknown> | null;
    default_objects?: Record<string, unknown> | null;
    objects?: Record<string, unknown> | null;
    preview_url: string;
  };
  title: string;
  unit_price: number;
}

export interface MerchifyCart extends Omit<HttpTypes.StoreCart, "items"> {
  items?: MerchifyCartLineItem[];
}

export interface MerchifyCartLineItem extends HttpTypes.StoreCartLineItem {
  printfile_line_items: MerchifyPrintfileLineItem[];
}

export interface MerchifyOrderLineItem extends HttpTypes.StoreOrderLineItem {
  printfile_line_items: MerchifyPrintfileLineItem[];
}

export interface MerchifyOrder extends Omit<HttpTypes.StoreOrder, "items"> {
  items: MerchifyOrderLineItem[] | null;
}

export interface MerchifyRegionCountry
  extends Omit<HttpTypes.StoreRegionCountry, "metadata"> {
  metadata: {
    ar_name?: string;
  };
}

export type GeolocationAddress = {
  address_1: string;
  address_2: string;
  city: string;
  country_code: string;
  postal_code?: string;
  province?: string;
};
