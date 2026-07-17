import { apiClient } from "./apiClient";

export const createDepartment = async (departmentData) => {
  return await apiClient("/department/create-department", {
    method: "POST",
    body: JSON.stringify(departmentData),
  });
};

export const getAllDepartments = async () => {
  return await apiClient("/department/all", {
    method: "GET",
  });
};

export const getSingleDepartment = async (id) => {
  return await apiClient(`/department/single/${id}`, {
    method: "GET",
  });
};

export const updateDepartment = async (id, departmentData) => {
  return await apiClient(`/department/update-department/${id}`, {
    method: "PUT",
    body: JSON.stringify(departmentData),
  });
};

export const deleteDepartment = async (id) => {
  return await apiClient(`/department/delete-department/${id}`, {
    method: "DELETE",
  });
};
