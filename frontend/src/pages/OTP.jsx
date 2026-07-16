import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound } from "lucide-react";
import { verifyOtp } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from "../toastMessage/toastDeliver";
import AuthCard from "../components/AuthCard";

function OTP() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return; // Only allow digits

    const newOtp = [...otp];
    // Take the last character if multiple characters are pasted
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input if current field is filled
    if (value && index < 3 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current field is empty
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 4) {
      showError("Please enter a 4-digit OTP.");
      return;
    }

    setIsSubmitting(true);
    const loadingToastId = showLoading("Verifying your OTP...");

    try {
      const response = await verifyOtp({ otp: otpValue });
      dismissToast(loadingToastId);
      showSuccess(response.message || "OTP Verified Successfully!");

      // Log the user in and save to local storage now that they are verified
      const userData = response.data;
      login(userData, "mg0"); // Using mg0 as default manager role marker

      // Redirect to home dashboard
      navigate("/home");
    } catch (error) {
      dismissToast(loadingToastId);
      showError(error.message || "Failed to verify OTP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard
      icon={KeyRound}
      title="Verification Code"
      subtitle="Please enter the 4-digit code sent to your email."
    >
      <form onSubmit={handleVerify} className="space-y-8">
        <div className="flex justify-center gap-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-14 h-14 text-center text-2xl font-bold border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-ems-text-light dark:text-ems-text-dark focus:outline-none focus:ring-2 focus:ring-ems-primary dark:focus:ring-ems-primary-dark transition-colors"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-3 px-4 rounded-xl shadow-md text-base font-semibold text-white bg-ems-primary hover:bg-blue-700 dark:bg-ems-primary-dark dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ems-primary transition-all cursor-pointer transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Verifying..." : "Verify OTP"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Didn't receive a code?{" "}
          <button
            type="button"
            className="font-medium text-ems-primary dark:text-ems-primary-dark hover:underline cursor-pointer"
          >
            Resend OTP
          </button>
        </p>
      </div>
    </AuthCard>
  );
}

export default OTP;
