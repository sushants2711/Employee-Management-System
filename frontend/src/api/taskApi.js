import { apiClient } from "./apiClient";

export const createTask = async (taskData) => {
  return await apiClient("/task/create-task", {
    method: "POST",
    body: JSON.stringify(taskData),
  });
};

export const getAllTasks = async (status, search) => {
  let queryParts = [];
  if (status) queryParts.push(`status=${status}`);
  if (search) queryParts.push(`search=${search}`);
  const query = queryParts.length ? `?${queryParts.join("&")}` : "";
  return await apiClient(`/task/get-tasks${query}`, {
    method: "GET",
  });
};

export const getSingleTask = async (id) => {
  return await apiClient(`/task/get-task/${id}`, {
    method: "GET",
  });
};

export const updateTask = async (id, taskData) => {
  return await apiClient(`/task/update-task/${id}`, {
    method: "PUT",
    body: JSON.stringify(taskData),
  });
};

export const updateTaskStatus = async (id, statusData) => {
  return await apiClient(`/task/update-task-status/${id}`, {
    method: "PUT",
    body: JSON.stringify(statusData),
  });
};

export const deleteTask = async (id) => {
  return await apiClient(`/task/delete-task/${id}`, {
    method: "DELETE",
  });
};
