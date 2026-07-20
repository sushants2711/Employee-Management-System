import { apiClient } from "./apiClient";

export const createTeam = async (teamData) => {
  return await apiClient("/team/create-team", {
    method: "POST",
    body: JSON.stringify(teamData),
  });
};

export const getAllTeams = async (status, search) => {
  let queryParts = [];
  if (status) queryParts.push(`status=${status}`);
  if (search) queryParts.push(`search=${search}`);
  const query = queryParts.length ? `?${queryParts.join("&")}` : "";
  return await apiClient(`/team/all-team${query}`, {
    method: "GET",
  });
};

export const getSingleTeam = async (id) => {
  return await apiClient(`/team/single/${id}`, {
    method: "GET",
  });
};

export const updateTeam = async (id, teamData) => {
  return await apiClient(`/team/update-team/${id}`, {
    method: "PUT",
    body: JSON.stringify(teamData),
  });
};

export const deleteTeam = async (id) => {
  return await apiClient(`/team/delete-team/${id}`, {
    method: "DELETE",
  });
};

export const getAllActiveTeams = async () => {
  return await apiClient("/team/all-active-team", {
    method: "GET",
  });
};
