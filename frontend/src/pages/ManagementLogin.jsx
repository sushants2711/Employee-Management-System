import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, Lock, ShieldCheck, User, Eye, EyeOff } from "lucide-react";
import { managementLoginEmail, managementLoginEmpId } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

function ManagementLogin() {
  const [loginMethod, setLoginMethod] = useState("email");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    identifier: "", // This will hold either email or empId
    password: "",
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let response;
      if (loginMethod === "email") {
        response = await managementLoginEmail({
          email: formData.identifier,
          password: formData.password,
        });
      } else {
        response = await managementLoginEmpId({
          employeeId: formData.identifier,
          password: formData.password,
        });
      }

      toast.success(response.message || "Login successful!");

      const userData = response.data || {
        email: loginMethod === "email" ? formData.identifier : "",
        name: response.data?.name || "Management User",
      };

      login(userData, "mg0");
      navigate("/"); // Navigate to dashboard
    } catch (error) {
      toast.error(error.message || "An error occurred during login");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden w-full">
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 border border-slate-100 dark:border-slate-700/50 relative overflow-hidden">
          <div className="mb-8 text-center mt-2">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-8 h-8 text-ems-primary dark:text-ems-primary-dark" />
            </div>
            <h1 className="text-2xl font-bold text-ems-text-light dark:text-ems-text-dark mb-2">
              Management Login
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Restricted access: Only for company management team.
            </p>
          </div>

          <div className="flex bg-slate-100 dark:bg-slate-900 rounded-xl p-1 mb-6">
            <button
              onClick={() => {
                setLoginMethod("email");
                setFormData({ identifier: "", password: "" });
              }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                loginMethod === "email"
                  ? "bg-white dark:bg-slate-800 text-ems-primary dark:text-ems-primary-dark shadow"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              Email
            </button>
            <button
              onClick={() => {
                setLoginMethod("empid");
                setFormData({ identifier: "", password: "" });
              }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                loginMethod === "empid"
                  ? "bg-white dark:bg-slate-800 text-ems-primary dark:text-ems-primary-dark shadow"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              Employee ID
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-ems-text-light dark:text-ems-text-dark mb-2">
                {loginMethod === "email" ? "Admin Email" : "Employee ID"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {loginMethod === "email" ? (
                    <Mail className="h-5 w-5 text-slate-400" />
                  ) : (
                    <User className="h-5 w-5 text-slate-400" />
                  )}
                </div>
                <input
                  type={loginMethod === "email" ? "email" : "text"}
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-ems-text-light dark:text-ems-text-dark focus:outline-none focus:ring-2 focus:ring-ems-primary dark:focus:ring-ems-primary-dark transition-colors disabled:opacity-50"
                  placeholder={
                    loginMethod === "email" ? "admin@company.com" : "EMP12345"
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ems-text-light dark:text-ems-text-dark mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  className="block w-full pl-10 pr-10 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-ems-text-light dark:text-ems-text-dark focus:outline-none focus:ring-2 focus:ring-ems-primary dark:focus:ring-ems-primary-dark transition-colors disabled:opacity-50"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-ems-primary cursor-pointer transition-colors disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center">
                <input
                  id="remember-me-admin"
                  type="checkbox"
                  className="h-4 w-4 text-ems-primary focus:ring-ems-primary border-slate-300 rounded cursor-pointer"
                />
                <label
                  htmlFor="remember-me-admin"
                  className="ml-2 block text-sm text-slate-600 dark:text-slate-400 cursor-pointer"
                >
                  Remember me
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 rounded-xl shadow-md text-base font-semibold text-white bg-ems-primary hover:bg-blue-700 dark:bg-ems-primary-dark dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ems-primary transition-all cursor-pointer transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Don't have an account?{" "}
              <Link
                to="/management-signup"
                className="font-medium text-ems-primary dark:text-ems-primary-dark hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ManagementLogin;
