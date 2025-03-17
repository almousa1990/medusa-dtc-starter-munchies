"use server";

import medusa from "@/data/medusa/client";
import {getAuthHeaders, getCacheTag} from "@/data/medusa/cookies";
import medusaError from "@/utils/medusa/error";
import {HttpTypes} from "@medusajs/types";
import {revalidateTag} from "next/cache";

export const updateCustomer = async (body: HttpTypes.StoreUpdateCustomer) => {
  const headers = {
    ...(await getAuthHeaders()),
  };

  const updateRes = await medusa.store.customer
    .update(body, {}, headers)
    .then(({customer}) => customer)
    .catch(medusaError);

  const cacheTag = await getCacheTag("customers");
  revalidateTag(cacheTag);

  return updateRes;
};

export const addCustomerAddress = async (
  address: HttpTypes.StoreCreateCustomerAddress,
): Promise<any> => {
  const headers = {
    ...(await getAuthHeaders()),
  };

  return medusa.store.customer
    .createAddress(address, {}, headers)
    .then(async ({customer}) => {
      const customerCacheTag = await getCacheTag("customers");
      revalidateTag(customerCacheTag);
      return {success: true, error: null, customer};
    })
    .catch((err) => {
      return {success: false, error: err.toString()};
    });
};

export const deleteCustomerAddress = async (
  addressId: string,
): Promise<void> => {
  const headers = {
    ...(await getAuthHeaders()),
  };

  await medusa.store.customer
    .deleteAddress(addressId, headers)
    .then(async () => {
      const customerCacheTag = await getCacheTag("customers");
      revalidateTag(customerCacheTag);
      return {success: true, error: null};
    })
    .catch((err) => {
      return {success: false, error: err.toString()};
    });
};

export const updateCustomerAddress = async (
  id: string,
  address: HttpTypes.StoreCreateCustomerAddress,
): Promise<any> => {
  if (!id) {
    return {success: false, error: "Address ID is required"};
  }

  const headers = {
    ...(await getAuthHeaders()),
  };

  return medusa.store.customer
    .updateAddress(id, address, {}, headers)
    .then(async () => {
      const customerCacheTag = await getCacheTag("customers");
      revalidateTag(customerCacheTag);
      return {success: true, error: null};
    })
    .catch((err) => {
      return {success: false, error: err.toString()};
    });
};
