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

export const verifyOtp = async (otpData) => {
  return await apiClient("/user/otp", {
    method: "POST",
    body: JSON.stringify(otpData),
  });
};

export const getAllUsers = async () => {
  return await apiClient("/user/all-users", {
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
