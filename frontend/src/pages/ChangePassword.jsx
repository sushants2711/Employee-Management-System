import { useState } from "react";
import { Link } from "react-router-dom";
import { Lock, LockKeyhole, ArrowLeft, Eye, EyeOff, ShieldCheck } from "lucide-react";

function ChangePassword() {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    console.log("Changing password...", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden w-full">
      <div className="w-full max-w-md relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 mb-8 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Portal
        </Link>

        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 border border-slate-100 dark:border-slate-700/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-ems-primary dark:bg-ems-primary-dark"></div>

          <div className="mb-8 text-center mt-2">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-8 h-8 text-ems-primary dark:text-ems-primary-dark" />
            </div>
            <h1 className="text-2xl font-bold text-ems-text-light dark:text-ems-text-dark mb-2">
              Change Password
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Securely update your account password.
            </p>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-5">
            {/* Old Password */}
            <div>
              <label className="block text-sm font-medium text-ems-text-light dark:text-ems-text-dark mb-2">
                Old Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showOldPassword ? "text" : "password"}
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleInputChange}
                  required
                  className="block w-full pl-10 pr-10 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-ems-text-light dark:text-ems-text-dark focus:outline-none focus:ring-2 focus:ring-ems-primary dark:focus:ring-ems-primary-dark transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-ems-primary cursor-pointer transition-colors"
                >
                  {showOldPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-ems-text-light dark:text-ems-text-dark mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockKeyhole className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  required
                  className="block w-full pl-10 pr-10 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-ems-text-light dark:text-ems-text-dark focus:outline-none focus:ring-2 focus:ring-ems-primary dark:focus:ring-ems-primary-dark transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-ems-primary cursor-pointer transition-colors"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-sm font-medium text-ems-text-light dark:text-ems-text-dark mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockKeyhole className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="block w-full pl-10 pr-10 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-ems-text-light dark:text-ems-text-dark focus:outline-none focus:ring-2 focus:ring-ems-primary dark:focus:ring-ems-primary-dark transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-ems-primary cursor-pointer transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 rounded-xl shadow-md text-base font-semibold text-white bg-ems-primary hover:bg-blue-700 dark:bg-ems-primary-dark dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ems-primary transition-all cursor-pointer transform hover:-translate-y-0.5 mt-4"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
