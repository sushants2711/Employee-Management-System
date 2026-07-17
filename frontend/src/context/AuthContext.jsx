/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    const isAvailable = localStorage.getItem("isAvailable") || "Available";
    return role && name && email ? { role, name, email, isAvailable } : null;
  });

  const login = (userData, role) => {
    localStorage.setItem("role", role);
    localStorage.setItem("name", userData.name);
    localStorage.setItem("email", userData.email);
    localStorage.setItem("isAvailable", userData.isAvailable || "Available");
    setUser({ ...userData, role });
  };

  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("isAvailable");
    setUser(null);
  };

  const updateUser = (updates) => {
    if (updates.isAvailable)
      localStorage.setItem("isAvailable", updates.isAvailable);
    setUser((prev) => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
