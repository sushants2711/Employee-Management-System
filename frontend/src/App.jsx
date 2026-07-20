import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ToastConfig from "./toastMessage/ToastConfig";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import EmployeeLogin from "./pages/EmployeeLogin";
import ManagementLogin from "./pages/ManagementLogin";
import ManagementSignup from "./pages/ManagementSignup";
import OTP from "./pages/OTP";
import ChangePassword from "./pages/ChangePassword";
import DashboardHome from "./pages/DashboardHome";
import Departments from "./pages/Departments";
import Designations from "./pages/Designations";
import Teams from "./pages/Teams";
import Users from "./pages/Users";
import Projects from "./pages/Projects";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./layouts/DashboardLayout";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import {
  HelpCenter,
  Documentation,
  Community,
  SystemStatus,
  Privacy,
  Terms,
} from "./pages/StaticPages";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-ems-bg-light dark:bg-ems-bg-dark transition-colors duration-300 relative">
            <ToastConfig />
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
                  <Route path="teams" element={<Teams />} />
                  <Route path="users" element={<Users />} />
                  <Route path="projects" element={<Projects />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="help-center" element={<HelpCenter />} />
                  <Route path="documentation" element={<Documentation />} />
                  <Route path="community" element={<Community />} />
                  <Route path="system-status" element={<SystemStatus />} />
                  <Route path="privacy" element={<Privacy />} />
                  <Route path="terms" element={<Terms />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
