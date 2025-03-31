"use server";

import {isArray} from "lodash";
import medusa from "./client";
import {getAuthHeaders, getCacheTag} from "./cookies";

export const listAssetCategories = async (
  queryParams: Record<string, string> = {},
): Promise<{categories: any[]; count: number}> => {
  queryParams.limit = queryParams.limit || "100";
  queryParams.offset = queryParams.offset || "0";

  return medusa.client
    .fetch<{categories: any; count: number}>("/store/asset-categories", {
      // todo typing
      query: queryParams,
      next: {tags: ["asset_categories"]},
    })
    .then(({categories}) => ({categories, count: categories.length}));
};

export const listAssetCollections = async (
  queryParams: Record<string, string> = {},
): Promise<{collections: any[]; count: number}> => {
  queryParams.limit = queryParams.limit || "100";
  queryParams.offset = queryParams.offset || "0";

  return medusa.client
    .fetch<{collections: any; count: number}>("/store/asset-collections", {
      // todo typing
      query: queryParams,
      next: {tags: ["asset_collections"]},
    })
    .then(({collections}) => ({collections, count: collections.length}));
};

export const listAssets = async (
  queryParams: Record<string, string | string[]> = {},
): Promise<{assets: any[]; count: number}> => {
  queryParams.limit = queryParams.limit || "100";
  queryParams.offset = queryParams.offset || "0";

  return medusa.client
    .fetch<{assets: any; count: number}>("/store/assets", {
      //todo typing
      query: queryParams,
      next: {tags: ["assets"]},
    })
    .then(({assets}) => ({assets, count: assets.length}));
};

export const listAssetTags = async (
  queryParams: Record<string, string> = {},
): Promise<{tags: any[]; count: number}> => {
  queryParams.limit = queryParams.limit || "100";
  queryParams.offset = queryParams.offset || "0";

  return medusa.client
    .fetch<{tags: any; count: number}>("/store/asset-tags", {
      //todo typing
      query: queryParams,
      next: {tags: ["asset_tags"]},
    })
    .then(({tags}) => ({tags, count: tags.length}));
};

export const listAssetTypes = async (
  queryParams: Record<string, string> = {},
): Promise<{types: any[]; count: number}> => {
  queryParams.limit = queryParams.limit || "100";
  queryParams.offset = queryParams.offset || "0";

  return medusa.client
    .fetch<{types: any; count: number}>("/store/asset-types", {
      //todo typing
      query: queryParams,
      next: {tags: ["asset_types"]},
    })
    .then(({types}) => ({types, count: types.length}));
};

export const listCustomerAssets = async (
  queryParams: Record<string, string> = {},
): Promise<{assets: any[]; count: number}> => {
  queryParams.limit = queryParams.limit || "100";
  queryParams.offset = queryParams.offset || "0";

  return medusa.client
    .fetch<{assets: any; count: number}>("/store/customer-assets", {
      //todo typing
      query: queryParams,
      next: {tags: ["customer_assets"]},
    })
    .then(({assets}) => ({assets, count: assets.length}));
};

export const createCustomerAssets = async (input: any) => {
  const formData = new FormData();

  input.files.forEach((file: File) => {
    formData.append("files", file, file.name); // Add files to the form
  });

  const {types, count} = await listAssetTypes({value: input.type});
  if (count) {
    formData.append("type_id", types[0].id); // Add corresponding type_id
  }

  // Fetch auth headers
  const headers = await getAuthHeaders();

  // Perform the upload
  const response = await medusa.client.fetch<{
    files: {id: string; url: string}[];
  }>(`/store/customer-assets`, {
    method: "POST",
    headers: {
      ...headers,
      // Let the browser handle multipart boundaries
      "Content-Type": null,
    },
    body: formData,
  });
};

export const deleteCustomerAssets = async (id: string | string[]) => {
  // Fetch auth headers
  const headers = await getAuthHeaders();

  // Perform the upload
  if (isArray(id)) {
    console.log("not implemented");
  } else {
    const response = await medusa.client.fetch(`/store/customer-assets/${id}`, {
      method: "DELETE",
      headers: {
        ...headers,
      },
    });
  }
};
