"use server";

import {listAssetTypes} from "@/data/medusa/assets";
import medusa from "@/data/medusa/client";
import {getAuthHeaders} from "@/data/medusa/cookies";
import {isArray} from "lodash";

export const createCustomerAssets = async (input: any) => {
  const formData = new FormData();

  input.files.forEach((file: File) => {
    formData.append("files", file, file.name); // Add files to the form
  });

  const {count, types} = await listAssetTypes({value: input.type});
  if (count) {
    formData.append("type_id", types[0].id); // Add corresponding type_id
  }

  // Fetch auth headers
  const headers = await getAuthHeaders();

  // Perform the upload
  //todo. this needs type response
  return medusa.client
    .fetch(`/store/customer-assets`, {
      body: formData,
      headers: {
        ...headers,
        // Let the browser handle multipart boundaries
        "Content-Type": null,
      },
      method: "POST",
    })
    .then((response) => response)
    .catch((error) => error);
};

export const deleteCustomerAssets = async (id: string | string[]) => {
  // Fetch auth headers
  const headers = await getAuthHeaders();

  // Perform the upload
  if (isArray(id)) {
    console.log("not implemented");
  } else {
    const response = await medusa.client.fetch(`/store/customer-assets/${id}`, {
      headers: {
        ...headers,
      },
      method: "DELETE",
    });
  }
};
