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
import Departments from "./pages/Departments";
import Designations from "./pages/Designations";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./layouts/DashboardLayout";
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
            className="fixed bottom-6 right-6 p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all z-50 text-slate-700 dark:text-yellow-500 cursor-pointer"
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
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardHome />} />
                <Route path="departments" element={<Departments />} />
                <Route path="designations" element={<Designations />} />
                <Route path="users" element={<Users />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
