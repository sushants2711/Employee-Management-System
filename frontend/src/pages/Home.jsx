import { Link } from "react-router-dom";
import { Users, ShieldCheck, ArrowRight } from "lucide-react";

// Reusable component for the portal cards
const PortalCard = ({ to, icon: Icon, title, description }) => {
  return (
    <Link
      to={to}
      className="group relative flex flex-col p-8 lg:p-12 bg-white dark:bg-slate-800 rounded-3xl shadow-xl hover:shadow-2xl border border-slate-100 dark:border-slate-700/50 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
    >
      <div className="mb-8 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-12 h-12 text-ems-primary dark:text-ems-primary-dark" />
      </div>
      <h2 className="text-2xl font-bold text-ems-text-light dark:text-ems-text-dark mb-4">
        {title}
      </h2>
      <p className="text-slate-500 dark:text-slate-400 mb-8 flex-grow leading-relaxed">
        {description}
      </p>
      <div className="flex items-center text-ems-primary dark:text-ems-primary-dark font-semibold group-hover:gap-3 gap-2 transition-all">
        Continue to Login <ArrowRight className="w-5 h-5" />
      </div>
    </Link>
  );
};

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative overflow-hidden">
      <div className="text-center mb-12 relative z-10 max-w-3xl">
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
        <PortalCard
          to="/employee-login"
          icon={Users}
          title="Employee Portal"
          description="Access your personal dashboard to view schedules, submit leave requests, and track your performance metrics securely."
        />
        <PortalCard
          to="/management-login"
          icon={ShieldCheck}
          title="Management Portal"
          description="Management login is strictly for the company management team to oversee operations, approve requests, and manage personnel."
        />
      </div>
    </div>
  );
}

export default Home;
