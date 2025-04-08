"use client";

import type {MerchifyPrintfile, MerchifyProduct} from "@/types";

import {
  createCustomerAssets,
  deleteCustomerAssets,
} from "@/actions/medusa/assets";
import {createMockupRenditions} from "@/actions/medusa/mockups";
import {updatePrintfileEditorSessions} from "@/actions/medusa/printfile";
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
import {PrintfileEditor} from "@merchify/editor";
import {track} from "@vercel/analytics";
import {useRouter} from "next/navigation";

interface EditorWrapperProps {
  onVariantSelectionChange?: (id: string) => void;
  product: MerchifyProduct;
  regionId: string;
  selectedVariant?: string;
  sessions?: any[] | null;
}

export function EditorWrapper(props: EditorWrapperProps) {
  const {product, regionId, selectedVariant, sessions} = props;
  const router = useRouter();
  if (!sessions?.length) {
    return <>loading</>;
  }

  const handleSubmit = async (data: {
    printfiles: MerchifyPrintfile[];
    selected_variant: string;
  }) => {
    const {printfiles, selected_variant} = data;
    const productVariant = product.variants?.find(
      (v) => v.id == selected_variant,
    );

    if (!productVariant) {
      return;
    }

    addToCartEventBus.emitCartAdd({
      printfiles,
      productVariant,
      regionId,
    });

    track("add-to-cart", {
      quantity: 1,
      region_id: regionId,
      variantId: productVariant.id,
    });
    router.push(`/products/${product.handle}`);
  };

  const handleSave = async (data: {sessions: any[]}) => {
    const {sessions} = data;
    await updatePrintfileEditorSessions(product.id, sessions);
  };

  return (
    <PrintfileEditor
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
      onSave={handleSave}
      onSubmit={handleSubmit}
      product={product}
      selectedVariant={selectedVariant}
      sessions={sessions}
    />
  );
}
