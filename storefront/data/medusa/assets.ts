"use server";

import medusa from "./client";
import {getAuthHeaders} from "./cookies";

export const listAssetCategories = async (
  queryParams: Record<string, string> = {},
): Promise<{categories: any[]; count: number}> => {
  queryParams.limit = queryParams.limit || "100";
  queryParams.offset = queryParams.offset || "0";

  return medusa.client
    .fetch<{categories: any; count: number}>("/store/asset-categories", {
      next: {tags: ["asset_categories"]},
      // todo typing
      query: queryParams,
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
      next: {tags: ["asset_collections"]},
      // todo typing
      query: queryParams,
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
      next: {tags: ["assets"]},
      //todo typing
      query: queryParams,
    })
    .then(({assets}) => ({assets, count: assets.length}));
};

export const listAssetTags = async (
  queryParams: Record<string, string> = {},
): Promise<{count: number; tags: any[]}> => {
  queryParams.limit = queryParams.limit || "100";
  queryParams.offset = queryParams.offset || "0";

  return medusa.client
    .fetch<{count: number; tags: any}>("/store/asset-tags", {
      next: {tags: ["asset_tags"]},
      //todo typing
      query: queryParams,
    })
    .then(({tags}) => ({count: tags.length, tags}));
};

export const listAssetTypes = async (
  queryParams: Record<string, string> = {},
): Promise<{count: number; types: any[]}> => {
  queryParams.limit = queryParams.limit || "100";
  queryParams.offset = queryParams.offset || "0";

  return medusa.client
    .fetch<{count: number; types: any}>("/store/asset-types", {
      next: {tags: ["asset_types"]},
      //todo typing
      query: queryParams,
    })
    .then(({types}) => ({count: types.length, types}));
};

export const listCustomerAssets = async (
  queryParams: Record<string, string> = {},
): Promise<{assets: any[]; count: number}> => {
  queryParams.limit = queryParams.limit || "100";
  queryParams.offset = queryParams.offset || "0";

  const headers = await getAuthHeaders();
  return medusa.client
    .fetch<{assets: any; count: number}>("/store/customer-assets", {
      headers,
      next: {tags: ["customer_assets"]},
      query: queryParams,
    })
    .then(({assets}) => ({assets, count: assets.length}));
};
