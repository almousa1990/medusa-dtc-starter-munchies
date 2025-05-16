"use client";

import type {
  MerchifyPrintfileRenderInput,
  MerchifyPrintfileTemplate,
  MerchifyProduct,
} from "@/types";
import type {StoreRegion} from "@medusajs/types";

import {
  createCustomerAssets,
  deleteCustomerAssets,
} from "@/actions/medusa/assets";
import {createMockupRenditions} from "@/actions/medusa/mockups";
import {updatePrintfileEditorSessions} from "@/actions/medusa/printfile";
import {useCart} from "@/components/context/cart-context";
import {
  listAssetCategories,
  listAssetCollections,
  listAssetTags,
  listAssetTypes,
  listAssets,
  listCustomerAssets,
} from "@/data/medusa/assets";
import {listMockupRenditions} from "@/data/medusa/mockups";
import {addToCartEventBus} from "@/utils/event-bus";
import {Editor} from "@merchify/editor";
import {useRouter} from "next/navigation";

interface EditorWrapperProps {
  countryCode: string;
  lineItem?: string;
  onVariantSelectionChange?: (id: string) => void;
  printfiles: MerchifyPrintfileTemplate[];
  product: MerchifyProduct;
  region: StoreRegion;
  selectedVariant?: string;
  sessions: any[] | null;
}

export function EditorWrapper(props: EditorWrapperProps) {
  const {lineItem, printfiles, product, region, selectedVariant, sessions} =
    props;
  const router = useRouter();
  const {handleUpdateItem} = useCart();

  const handleSubmit = async (data: {
    printfiles: MerchifyPrintfileRenderInput[];
    selected_variant: string;
  }) => {
    const {printfiles, selected_variant} = data;
    const productVariant = product.variants?.find(
      (v) => v.id == selected_variant,
    );

    if (!productVariant) {
      return;
    }

    if (!lineItem) {
      addToCartEventBus.emitCartAdd({
        printfiles,
        productVariant,
        regionId: region.id,
      });
    } else {
      await handleUpdateItem(lineItem, {
        printfiles: printfiles,
      });
    }

    router.push(`/products/${product.handle}`);
  };

  return (
    <Editor
      currencyCode={region.currency_code}
      lockedVariant={!!lineItem}
      onAssetCategoryList={listAssetCategories}
      onAssetCollectionList={listAssetCollections}
      onAssetList={listAssets}
      onAssetTagList={listAssetTags}
      onAssetTypeList={listAssetTypes}
      onBack={() => router.push(`/products/${product.handle}`)}
      onCustomerAssetCreate={createCustomerAssets}
      onCustomerAssetDelete={deleteCustomerAssets}
      onCustomerAssetList={listCustomerAssets}
      onMockupRenditionsCreate={createMockupRenditions}
      onMockupRenditionsList={listMockupRenditions}
      onSave={updatePrintfileEditorSessions}
      onSubmit={handleSubmit}
      printfiles={printfiles}
      product={product}
      selectedVariant={selectedVariant}
      sessions={sessions}
    />
  );
}
