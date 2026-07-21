import { apiClient } from "./apiClient";

export const checkManagementLimit = async () => {
  return await apiClient("/user/manager-count", {
    method: "GET",
  });
};

export const updateManagementProfile = async (profileData) => {
  return await apiClient("/user/update-profile-manager", {
    method: "PUT",
    body: JSON.stringify(profileData),
  });
};

export const changePassword = async (passwordData) => {
  return await apiClient("/user/change-password", {
    method: "PUT",
    body: JSON.stringify(passwordData),
  });
};

export const managementSignup = async (userData) => {
  return await apiClient("/user/manager-signup", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const managementLoginEmail = async (loginData) => {
  return await apiClient("/user/management-email-login", {
    method: "POST",
    body: JSON.stringify(loginData),
  });
};

export const managementLoginEmpId = async (loginData) => {
  return await apiClient("/user/management-empid-login", {
    method: "POST",
    body: JSON.stringify(loginData),
  });
};

export const employeeLoginEmail = async (loginData) => {
  return await apiClient("/user/login-email", {
    method: "POST",
    body: JSON.stringify(loginData),
  });
};

export const employeeLoginEmpId = async (loginData) => {
  return await apiClient("/user/login-empid", {
    method: "POST",
    body: JSON.stringify(loginData),
  });
};

export const verifyOtp = async (otpData) => {
  return await apiClient("/user/otp", {
    method: "POST",
    body: JSON.stringify(otpData),
  });
};

export const getAllUsers = async (status, search) => {
  let queryParts = [];
  if (status) queryParts.push(`status=${status}`);
  if (search) queryParts.push(`search=${search}`);
  const query = queryParts.length ? `?${queryParts.join("&")}` : "";
  return await apiClient(`/user/all-users${query}`, {
    method: "GET",
  });
};

export const getAllActiveManagers = async () => {
  return await apiClient("/user/get-manager", {
    method: "GET",
  });
};

export const getAllActiveTeamLeaders = async () => {
  return await apiClient("/user/get-team-leader", {
    method: "GET",
  });
};

export const updateUserDetails = async (id, userData) => {
  return await apiClient(`/user/update-user/${id}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  });
};

export const getAllEmployees = async () => {
  return await apiClient("/user/get-employee", {
    method: "GET",
  });
};

export const createUserAccount = async (userData) => {
  return await apiClient("/user/create-account", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const getSingleUser = async () => {
  return await apiClient("/user/single-user", {
    method: "GET",
  });
};

export const updateProfileImage = async (formData) => {
  return await apiClient("/user/update-profile-image", {
    method: "PUT",
    body: formData,
  });
};

export const updateIsAvailable = async (isAvailable) => {
  return await apiClient("/user/is-available", {
    method: "PUT",
    body: JSON.stringify({ isAvailable }),
  });
};

export const getEmployeesByStatus = async (status, search) => {
  let queryParts = [];
  if (status) queryParts.push(`status=${status}`);
  if (search) queryParts.push(`search=${search}`);
  const query = queryParts.length ? `?${queryParts.join("&")}` : "";
  return await apiClient(`/user/get-employee${query}`, { method: "GET" });
};

export const getManagementByStatus = async (status, search) => {
  let queryParts = [];
  if (status) queryParts.push(`status=${status}`);
  if (search) queryParts.push(`search=${search}`);
  const query = queryParts.length ? `?${queryParts.join("&")}` : "";
  return await apiClient(`/user/get-management${query}`, { method: "GET" });
};

export const getManagersByStatus = async (status, search) => {
  let queryParts = [];
  if (status) queryParts.push(`status=${status}`);
  if (search) queryParts.push(`search=${search}`);
  const query = queryParts.length ? `?${queryParts.join("&")}` : "";
  return await apiClient(`/user/get-manager${query}`, { method: "GET" });
};

export const getTeamLeadersByStatus = async (status, search) => {
  let queryParts = [];
  if (status) queryParts.push(`status=${status}`);
  if (search) queryParts.push(`search=${search}`);
  const query = queryParts.length ? `?${queryParts.join("&")}` : "";
  return await apiClient(`/user/get-team-leader${query}`, { method: "GET" });
};
