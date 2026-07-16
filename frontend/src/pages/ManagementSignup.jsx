import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, Lock, ShieldCheck, User, Phone } from "lucide-react";
import { checkManagementLimit, managementSignup } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import AuthCard from "../components/AuthCard";
import InputField from "../components/InputField";
import SubmitButton from "../components/SubmitButton";

function ManagementSignup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLimitReached, setIsLimitReached] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const fetchLimit = async () => {
      try {
        const response = await checkManagementLimit();
        if (response.data?.isFull) {
          setIsLimitReached(true);
        }
      } catch {
        toast.error("Failed to check management limit");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLimit();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await managementSignup(formData);
      toast.success(
        response.message ||
          "Signup successful! Please check your email for OTP."
      );

      // Store in auth context and local storage as requested
      const userData = response.data || formData;
      login(userData, "mg0");

      // Route to OTP page
      navigate("/otp");
    } catch (error) {
      toast.error(error.message || "An error occurred during signup");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard
      icon={ShieldCheck}
      title="Management Sign Up"
      subtitle="Create your management account."
      maxWidth="max-w-2xl"
    >
      {!isLoading && isLimitReached && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium text-center dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
          Management accounts limit reached. No more signups allowed.
        </div>
      )}

      <form onSubmit={handleSignup} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InputField
            label="Full Name"
            icon={User}
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            disabled={isLimitReached || isLoading || isSubmitting}
            placeholder="John Doe"
          />

          <InputField
            label="Email"
            icon={Mail}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled={isLimitReached || isLoading || isSubmitting}
            placeholder="admin@company.com"
          />

          <InputField
            label="Phone Number"
            icon={Phone}
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
            disabled={isLimitReached || isLoading || isSubmitting}
            placeholder="+1 (555) 000-0000"
          />

          <InputField
            label="Password"
            icon={Lock}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            disabled={isLimitReached || isLoading || isSubmitting}
            placeholder="••••••••"
          />

          <div className="sm:col-span-2">
            <InputField
              label="Confirm Password"
              icon={Lock}
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              disabled={isLimitReached || isLoading || isSubmitting}
              placeholder="••••••••"
            />
          </div>
        </div>

        <SubmitButton
          isSubmitting={isSubmitting}
          disabled={isLimitReached || isLoading}
        >
          Sign Up
        </SubmitButton>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            to="/management-login"
            className="font-medium text-ems-primary dark:text-ems-primary-dark hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}

export default ManagementSignup;
