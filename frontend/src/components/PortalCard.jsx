import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const PortalCard = ({ to, icon: Icon, title, description }) => {
  return (
    <Link
      to={to}
      className={`group relative flex flex-col p-8 lg:p-10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_20px_40px_rgb(0,0,0,0.2)] border border-white/50 dark:border-slate-700/50 transition-all duration-500 transform hover:-translate-y-2 overflow-hidden h-full`}
    >
      {/* Content wrapper to keep it above the absolute background */}
      <div className="relative z-10 flex flex-col h-full">
        <div className="mb-8 p-4 bg-white dark:bg-slate-800 rounded-2xl w-fit shadow-sm border border-slate-100 dark:border-slate-700 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ease-out">
          <Icon className="w-10 h-10 text-ems-primary dark:text-ems-primary-dark" />
        </div>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight transition-all duration-300">
          {title}
        </h2>

        <p className="text-slate-600 dark:text-slate-300 mb-8 flex-grow leading-relaxed text-base">
          {description}
        </p>

        <div className="flex items-center text-ems-primary dark:text-ems-primary-dark font-semibold group-hover:gap-4 gap-2 transition-all duration-300 ease-out mt-auto">
          <span className="relative">
            Continue to Login
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-ems-primary dark:bg-ems-primary-dark group-hover:w-full transition-all duration-300 ease-out"></span>
          </span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
    </Link>
  );
};

export default PortalCard;
