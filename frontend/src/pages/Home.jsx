import { Link } from "react-router-dom";
import { Users, ShieldCheck, ArrowRight } from "lucide-react";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-blue-500 opacity-10 dark:opacity-20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-indigo-500 opacity-10 dark:opacity-20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="text-center mb-16 relative z-10 max-w-3xl mt-12">
        <h1 className="text-[3rem] lg:text-[4rem] font-bold text-ems-text-light dark:text-ems-text-dark leading-tight mb-6 tracking-tight">
          Enterprise{" "}
          <span className="text-ems-primary dark:text-ems-primary-dark">
            Workforce
          </span>{" "}
          Hub
        </h1>
        <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-300 font-medium">
          Internal portal for employee management, analytics, and operational
          tracking. Please select your designated access level.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl relative z-10">
        {/* Employee Card */}
        <Link
          to="/employee-login"
          className="group relative flex flex-col p-8 lg:p-12 bg-white dark:bg-slate-800 rounded-3xl shadow-xl hover:shadow-2xl border border-slate-100 dark:border-slate-700/50 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-ems-primary"></div>
          <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
            <Users className="w-12 h-12 text-ems-primary dark:text-ems-primary-dark" />
          </div>
          <h2 className="text-2xl font-bold text-ems-text-light dark:text-ems-text-dark mb-4">
            Employee Portal
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 flex-grow leading-relaxed">
            Access your personal dashboard to view schedules, submit leave
            requests, and track your performance metrics securely.
          </p>
          <div className="flex items-center text-ems-primary dark:text-ems-primary-dark font-semibold group-hover:gap-3 gap-2 transition-all">
            Continue to Login <ArrowRight className="w-5 h-5" />
          </div>
        </Link>

        {/* Management Card */}
        <Link
          to="/management-login"
          className="group relative flex flex-col p-8 lg:p-12 bg-white dark:bg-slate-800 rounded-3xl shadow-xl hover:shadow-2xl border border-slate-100 dark:border-slate-700/50 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600 dark:bg-indigo-500"></div>
          <div className="mb-8 p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
            <ShieldCheck className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-ems-text-light dark:text-ems-text-dark mb-4">
            Management Portal
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 flex-grow leading-relaxed">
            Management login is strictly for the company management team to
            oversee operations, approve requests, and manage personnel.
          </p>
          <div className="flex items-center text-indigo-600 dark:text-indigo-400 font-semibold group-hover:gap-3 gap-2 transition-all">
            Continue to Login <ArrowRight className="w-5 h-5" />
          </div>
        </Link>
      </div>

      <div className="mt-16 text-center text-sm text-slate-400 dark:text-slate-500 font-medium tracking-wide">
        &copy; {new Date().getFullYear()} COMPANY INTERNAL PROJECT. SECURE
        CONNECTION ESTABLISHED.
      </div>
    </div>
  );
}

export default Home;
