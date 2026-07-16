import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

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

export default PortalCard;
