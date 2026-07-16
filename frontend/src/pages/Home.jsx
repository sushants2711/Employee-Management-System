import { Link } from "react-router-dom";
import { Users, ShieldCheck, Sparkles, LayoutDashboard } from "lucide-react";
import PortalCard from "../components/PortalCard";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { user } = useAuth();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative overflow-hidden bg-transparent">
      <div className="text-center mb-16 relative z-10 max-w-4xl px-4 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 mb-8 shadow-sm">
          <Sparkles className="w-4 h-4 text-ems-primary dark:text-ems-primary-dark" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Welcome to the future of work
          </span>
        </div>

        <h1 className="text-[3.5rem] lg:text-[5rem] font-extrabold text-slate-900 dark:text-white leading-[1.1] mb-6 tracking-tight">
          Enterprise <br className="md:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-ems-primary via-purple-500 to-pink-500 dark:from-ems-primary-dark dark:via-purple-400 dark:to-pink-400">
            Workforce
          </span>{" "}
          Hub
        </h1>
        <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
          The central nervous system for your organization. Seamlessly manage
          employees, analyze performance, and track operational metrics with
          unparalleled clarity.
        </p>
      </div>

      {user ? (
        <div className="w-full max-w-md relative z-10 px-4 opacity-0 [animation:fade-in-up_0.8s_cubic-bezier(0.16,1,0.3,1)_0.2s_forwards]">
          <Link
            to="/home"
            className="group flex flex-col items-center justify-center gap-4 p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md hover:border-ems-primary/50 dark:hover:border-ems-primary-dark/50 transition-all duration-300"
          >
            <div className="w-16 h-16 rounded-full bg-ems-primary/10 dark:bg-ems-primary-dark/10 flex items-center justify-center text-ems-primary dark:text-ems-primary-dark group-hover:scale-110 transition-transform duration-300">
              <LayoutDashboard className="w-8 h-8" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Continue to Dashboard
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                You are currently logged in as {user.name}
              </p>
            </div>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl relative z-10 px-4">
          <div className="opacity-0 [animation:fade-in-up_0.8s_cubic-bezier(0.16,1,0.3,1)_0.2s_forwards]">
            <PortalCard
              to="/employee-login"
              icon={Users}
              title="Employee Portal"
              description="Access your personalized dashboard. View schedules, manage leave requests, and track your growth seamlessly."
              gradient="from-blue-500/10 to-cyan-500/10"
            />
          </div>
          <div className="opacity-0 [animation:fade-in-up_0.8s_cubic-bezier(0.16,1,0.3,1)_0.4s_forwards]">
            <PortalCard
              to="/management-login"
              icon={ShieldCheck}
              title="Management Portal"
              description="Exclusive access for the leadership team. Oversee operations, approve workflows, and empower your personnel."
              gradient="from-purple-500/10 to-pink-500/10"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
