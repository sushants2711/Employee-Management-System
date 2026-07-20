import { apiClient } from "./apiClient";

export const createProject = async (projectData) => {
  return await apiClient("/project/create-project", {
    method: "POST",
    body: JSON.stringify(projectData),
  });
};

export const getAvailableTeams = async (currentProjectId) => {
  const query = currentProjectId ? `?currentProjectId=${currentProjectId}` : "";
  return await apiClient(`/project/available-teams${query}`, {
    method: "GET",
  });
};

export const getAllProjects = async (status, search) => {
  let queryParts = [];
  if (status) queryParts.push(`status=${status}`);
  if (search) queryParts.push(`search=${search}`);
  const query = queryParts.length ? `?${queryParts.join("&")}` : "";
  return await apiClient(`/project/all-project${query}`, {
    method: "GET",
  });
};

export const getSingleProject = async (id) => {
  return await apiClient(`/project/single/${id}`, {
    method: "GET",
  });
};

export const updateProject = async (id, projectData) => {
  return await apiClient(`/project/update-project/${id}`, {
    method: "PUT",
    body: JSON.stringify(projectData),
  });
};

export const deleteProject = async (id) => {
  return await apiClient(`/project/delete-project/${id}`, {
    method: "DELETE",
  });
};
