import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check local storage for existing session
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");

    if (role && name && email) {
      setUser({ role, name, email });
    }
  }, []);

  const login = (userData, role) => {
    localStorage.setItem("role", role);
    localStorage.setItem("name", userData.name);
    localStorage.setItem("email", userData.email);
    setUser({ ...userData, role });
  };

  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
