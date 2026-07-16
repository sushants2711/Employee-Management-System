import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import EmployeeLogin from "./pages/EmployeeLogin";
import ManagementLogin from "./pages/ManagementLogin";
import ManagementSignup from "./pages/ManagementSignup";
import OTP from "./pages/OTP";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return true;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-ems-bg-light dark:bg-ems-bg-dark transition-colors duration-300">
          <Toaster position="top-right" />
          <button
            onClick={toggleDarkMode}
            className="absolute top-4 right-4 p-2 rounded-full bg-ems-surface-light dark:bg-ems-surface-dark shadow-md hover:shadow-lg transition-all z-50 text-slate-700 dark:text-yellow-500 cursor-pointer"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? (
              <Sun className="w-6 h-6" />
            ) : (
              <Moon className="w-6 h-6" />
            )}
          </button>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/employee-login" element={<EmployeeLogin />} />
            <Route path="/management-login" element={<ManagementLogin />} />
            <Route path="/management-signup" element={<ManagementSignup />} />
            <Route path="/otp" element={<OTP />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
