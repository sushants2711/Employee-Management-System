import { Link } from "react-router-dom";
import { Users, ShieldCheck } from "lucide-react";
import PortalCard from "../components/PortalCard";

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
