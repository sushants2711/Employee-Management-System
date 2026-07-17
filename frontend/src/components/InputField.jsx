import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const InputField = ({
  label,
  icon: Icon,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div>
      <label className="block text-sm font-medium text-ems-text-light dark:text-ems-text-dark mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {Icon && <Icon className="h-5 w-5 text-slate-400" />}
        </div>
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`block w-full ${Icon ? "pl-10" : "pl-4"} ${isPassword ? "pr-10" : "pr-4"} py-3 border rounded-xl bg-slate-50 dark:bg-slate-900/50 text-ems-text-light dark:text-ems-text-dark focus:outline-none focus:ring-2 transition-colors disabled:opacity-50 ${
            error
              ? "border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500"
              : "border-slate-200 dark:border-slate-700 focus:ring-ems-primary dark:focus:ring-ems-primary-dark"
          }`}
          placeholder={placeholder}
        />
        {isPassword && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-ems-primary cursor-pointer transition-colors disabled:opacity-50"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default InputField;
