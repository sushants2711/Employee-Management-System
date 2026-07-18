import { apiClient } from "./apiClient";

export const fetchDashboardDetails = async () => {
  return apiClient("/dashboard/details", {
    method: "GET",
  });
};
