import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { KeyRound, ArrowLeft } from "lucide-react";

function OTP() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);

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
    if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 4) {
      alert("Please enter a 4-digit OTP.");
      return;
    }
    console.log("Verifying OTP:", otpValue);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden w-full">
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 border border-slate-100 dark:border-slate-700/50 relative overflow-hidden">

          <div className="mb-8 text-center mt-2">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <KeyRound className="w-8 h-8 text-ems-primary dark:text-ems-primary-dark" />
            </div>
            <h1 className="text-2xl font-bold text-ems-text-light dark:text-ems-text-dark mb-2">
              Verification Code
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Please enter the 4-digit code sent to your email.
            </p>
          </div>

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
              className="w-full flex justify-center py-3 px-4 rounded-xl shadow-md text-base font-semibold text-white bg-ems-primary hover:bg-blue-700 dark:bg-ems-primary-dark dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ems-primary transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              Verify OTP
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
        </div>
      </div>
    </div>
  );
}

export default OTP;
