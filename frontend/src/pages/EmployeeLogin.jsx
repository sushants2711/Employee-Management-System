import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Users, User } from "lucide-react";
import { employeeLoginEmail, employeeLoginEmpId } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { showSuccess, showError } from "../toastMessage/toastDeliver";
import {
  validateLoginField,
  validateLoginForm,
} from "../validators/userAuthValidators";
import AuthCard from "../components/AuthCard";
import InputField from "../components/InputField";
import SubmitButton from "../components/SubmitButton";

function EmployeeLogin() {
  const [loginMethod, setLoginMethod] = useState("email");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const error = validateLoginField(name, value, loginMethod);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const { isValid, errors: formErrors } = validateLoginForm(
      formData,
      loginMethod
    );

    if (!isValid) {
      setErrors(formErrors);
      showError("Please fix the errors in the form before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      let response;
      if (loginMethod === "email") {
        response = await employeeLoginEmail({
          email: formData.identifier,
          password: formData.password,
        });
      } else {
        response = await employeeLoginEmpId({
          employeeId: formData.identifier,
          password: formData.password,
        });
      }

      showSuccess(response.message || "Login successful!");

      const userData = response.data || {
        email: loginMethod === "email" ? formData.identifier : "",
        name: response.data?.name || "Employee User",
      };
      const userRole = response.data?.role || "Employee";

      login(userData, userRole);
      navigate("/home");
    } catch (error) {
      showError(error.message || "An error occurred during login");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard
      icon={Users}
      title="Employee Login"
      subtitle="Enter your credentials to access the portal."
    >
      <div className="flex bg-slate-100 dark:bg-slate-900 rounded-xl p-1 mb-6">
        <button
          onClick={() => {
            setLoginMethod("email");
            setFormData({ identifier: "", password: "" });
            setErrors({});
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
            setErrors({});
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
        <InputField
          label={loginMethod === "email" ? "Company Email" : "Employee ID"}
          icon={loginMethod === "email" ? Mail : User}
          type={loginMethod === "email" ? "email" : "text"}
          name="identifier"
          value={formData.identifier}
          onChange={handleInputChange}
          disabled={isSubmitting}
          error={errors.identifier}
          placeholder={loginMethod === "email" ? "you@company.com" : "EMP12345"}
        />

        <InputField
          label="Password"
          icon={Lock}
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          disabled={isSubmitting}
          error={errors.password}
          placeholder="••••••••"
        />

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-ems-primary focus:ring-ems-primary border-slate-300 rounded cursor-pointer"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-slate-600 dark:text-slate-400 cursor-pointer"
            >
              Remember me
            </label>
          </div>
        </div>

        <SubmitButton isSubmitting={isSubmitting}>Login</SubmitButton>
      </form>
    </AuthCard>
  );
}
export default EmployeeLogin;
