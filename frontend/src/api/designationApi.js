import { apiClient } from "./apiClient";

export const createDesignation = async (designationData) => {
  return await apiClient("/designation/add-designation", {
    method: "POST",
    body: JSON.stringify(designationData),
  });
};

export const getAllDesignations = async (status, search) => {
  let queryParts = [];
  if (status) queryParts.push(`status=${status}`);
  if (search) queryParts.push(`search=${search}`);
  const query = queryParts.length ? `?${queryParts.join("&")}` : "";
  return await apiClient(`/designation/all${query}`, {
    method: "GET",
  });
};

export const getSingleDesignation = async (id) => {
  return await apiClient(`/designation/single/${id}`, {
    method: "GET",
  });
};

export const updateDesignation = async (id, designationData) => {
  return await apiClient(`/designation/update-designation/${id}`, {
    method: "PUT",
    body: JSON.stringify(designationData),
  });
};

export const deleteDesignation = async (id) => {
  return await apiClient(`/designation/delete-designation/${id}`, {
    method: "DELETE",
  });
};

export const getAllActiveDesignations = async () => {
  return await apiClient("/designation/all-active", {
    method: "GET",
  });
};
