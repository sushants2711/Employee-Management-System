import { useState } from "react";
import { Mail, Lock, Users, User } from "lucide-react";
import AuthCard from "../components/AuthCard";
import InputField from "../components/InputField";
import SubmitButton from "../components/SubmitButton";

function EmployeeLogin() {
  const [loginMethod, setLoginMethod] = useState("email");
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
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
        <InputField
          label={loginMethod === "email" ? "Company Email" : "Employee ID"}
          icon={loginMethod === "email" ? Mail : User}
          type={loginMethod === "email" ? "email" : "text"}
          name="identifier"
          value={formData.identifier}
          onChange={handleInputChange}
          placeholder={loginMethod === "email" ? "you@company.com" : "EMP12345"}
        />

        <InputField
          label="Password"
          icon={Lock}
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
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

        <SubmitButton>Login</SubmitButton>
      </form>
    </AuthCard>
  );
}
export default EmployeeLogin;
