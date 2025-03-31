"use client";

import {PrintfileEditor} from "@merchify/editor";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {
  listAssetCollections,
  listAssets,
  listAssetTags,
  listAssetTypes,
  listAssetCategories,
  createCustomerAssets,
  listCustomerAssets,
  deleteCustomerAssets,
} from "@/data/medusa/assets";
import {
  createMockupRenditions,
  listMockupRenditions,
} from "@/data/medusa/mockups";
import medusa from "@/data/medusa/client";

interface EditorWrapperProps {
  product: any;
  selectedVariant?: string;
  onVariantSelectionChange?: (id: string) => void;
}

export function EditorWrapper(props: EditorWrapperProps) {
  const {product, selectedVariant} = props;
  const router = useRouter();

  const handleSave = async (data: {
    selected_variant: string;
    printfiles: any[];
  }) => {
    const {selected_variant, printfiles} = data;
    const result = await medusa.client
      .fetch(`/store/printfiles`, {
        method: "POST",
        body: {printfiles},
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(async (data: any) => {
        const {printfiles} = data;
        /*
        await addToCartWithPrinfiles({
          variantId: selectedVariant,
          countryCode: "sa",
          quantity: 1,
          printfiles: printfiles.map((p: any) => ({ ...p, display_name: p.template.display_name, filename: p.template.filename })),
        })*/
        router.push(`/products/${product.handle}`);
      })
      .catch(() => {
        return null;
      });
  };

  /*

  const handleUpload = async (files: File[]) => {
    console.log('should upload')

    if (files.length === 0) return;

    try {
      const result = await uploadFiles(files); // Call the server action
      setUplaods(result.files)
      console.log("Upload successful:", result);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  }*/

  console.log(product);

  return (
    <PrintfileEditor
      product={product}
      selectedVariant={selectedVariant}
      onSave={handleSave}
      onBack={() => router.push(`/products/${product.handle}`)}
      onAssetCollectionList={listAssetCollections}
      onAssetCategoryList={listAssetCategories}
      onAssetList={listAssets}
      onAssetTagList={listAssetTags}
      onAssetTypeList={listAssetTypes}
      onMockupRenditionsCreate={createMockupRenditions}
      onMockupRenditionsList={listMockupRenditions}
      onCustomerAssetCreate={createCustomerAssets}
      onCustomerAssetDelete={deleteCustomerAssets}
      onCustomerAssetList={listCustomerAssets}
    />
  );
}
