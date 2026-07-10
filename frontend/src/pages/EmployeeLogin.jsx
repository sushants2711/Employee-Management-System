import { Link } from "react-router-dom";
import { Mail, Lock, Users, ArrowLeft } from "lucide-react";

function EmployeeLogin() {
  const handleLogin = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden w-full">
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-blue-500 opacity-10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 mb-8 font-medium transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Portal
        </Link>

        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 border border-slate-100 dark:border-slate-700/50">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-ems-primary dark:text-ems-primary-dark" />
            </div>
            <h1 className="text-2xl font-bold text-ems-text-light dark:text-ems-text-dark mb-2">Employee Sign In</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Enter your company email and password.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-ems-text-light dark:text-ems-text-dark mb-2">
                  Company Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-ems-text-light dark:text-ems-text-dark focus:outline-none focus:ring-2 focus:ring-ems-primary dark:focus:ring-ems-primary-dark transition-colors"
                    placeholder="you@company.com"
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
                    type="password"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-ems-text-light dark:text-ems-text-dark focus:outline-none focus:ring-2 focus:ring-ems-primary dark:focus:ring-ems-primary-dark transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-ems-primary focus:ring-ems-primary border-slate-300 rounded cursor-pointer"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-sm font-medium text-ems-primary dark:text-ems-primary-dark hover:underline">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 rounded-xl shadow-md text-base font-semibold text-white bg-ems-primary hover:bg-blue-700 dark:bg-ems-primary-dark dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ems-primary transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                Sign In
              </button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default EmployeeLogin;
