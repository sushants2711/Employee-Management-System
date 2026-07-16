import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import ToastConfig from "./toastMessage/ToastConfig";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import EmployeeLogin from "./pages/EmployeeLogin";
import ManagementLogin from "./pages/ManagementLogin";
import ManagementSignup from "./pages/ManagementSignup";
import OTP from "./pages/OTP";
import ChangePassword from "./pages/ChangePassword";
import DashboardHome from "./pages/DashboardHome";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

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
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-ems-bg-light dark:bg-ems-bg-dark transition-colors duration-300 relative">
          <ToastConfig />
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
          <main className="flex-grow flex flex-col w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/employee-login"
                element={
                  <PublicRoute>
                    <EmployeeLogin />
                  </PublicRoute>
                }
              />
              <Route
                path="/management-login"
                element={
                  <PublicRoute>
                    <ManagementLogin />
                  </PublicRoute>
                }
              />
              <Route
                path="/management-signup"
                element={
                  <PublicRoute>
                    <ManagementSignup />
                  </PublicRoute>
                }
              />
              <Route
                path="/otp"
                element={
                  <PublicRoute>
                    <OTP />
                  </PublicRoute>
                }
              />
              <Route
                path="/change-password"
                element={
                  <ProtectedRoute>
                    <ChangePassword />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <DashboardHome />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
