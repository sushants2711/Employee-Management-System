/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    const isAvailable = localStorage.getItem("isAvailable") || "Available";
    const profilePicUrl = localStorage.getItem("profilePicUrl") || "";
    const isChangedPasswordCount = localStorage.getItem(
      "isChangedPasswordCount"
    )
      ? parseInt(localStorage.getItem("isChangedPasswordCount"), 10)
      : null;

    return role && name && email
      ? {
          role,
          name,
          email,
          isAvailable,
          profilePicUrl,
          isChangedPasswordCount,
        }
      : null;
  });

  const login = (userData, role) => {
    localStorage.setItem("role", role);
    localStorage.setItem("name", userData.name);
    localStorage.setItem("email", userData.email);
    localStorage.setItem("isAvailable", userData.isAvailable || "Available");
    if (userData.profilePicUrl)
      localStorage.setItem("profilePicUrl", userData.profilePicUrl);
    if (userData.isChangedPasswordCount !== undefined) {
      localStorage.setItem(
        "isChangedPasswordCount",
        userData.isChangedPasswordCount
      );
    }
    setUser({ ...userData, role });
  };

  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("isAvailable");
    localStorage.removeItem("profilePicUrl");
    localStorage.removeItem("isChangedPasswordCount");
    setUser(null);
  };

  const updateUser = (updates) => {
    if (updates.isAvailable !== undefined)
      localStorage.setItem("isAvailable", updates.isAvailable);
    if (updates.profilePicUrl !== undefined)
      localStorage.setItem("profilePicUrl", updates.profilePicUrl);
    if (updates.isChangedPasswordCount !== undefined)
      localStorage.setItem(
        "isChangedPasswordCount",
        updates.isChangedPasswordCount
      );

    setUser((prev) => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
