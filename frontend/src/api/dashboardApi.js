import { apiClient } from "./apiClient";

export const fetchDashboardDetails = async () => {
  return apiClient("/dashboard/details", {
    method: "GET",
  });
};

export const fetchOrgTreeDetails = async () => {
  return apiClient("/dashboard/org-tree", {
    method: "GET",
  });
};
