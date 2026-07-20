import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut } from "lucide-react";
import { apiClient } from "../api/apiClient";

function Sidebar() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await apiClient("/user/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      logout();
    }
  };

  const navItems = [{ name: "Dashboard", path: "/home" }];

  navItems.push({
    name: "Departments",
    path: "/home/departments",
  });
  navItems.push({
    name: "Designations",
    path: "/home/designations",
  });
  navItems.push({
    name: "Teams",
    path: "/home/teams",
  });
  navItems.push({
    name: "Users",
    path: "/home/users",
  });

  // Placeholder for future routes
  // navItems.push({ name: "Employees", path: "/home/employees", icon: Users });
  // navItems.push({ name: "Settings", path: "/home/settings", icon: Settings });

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full transition-colors duration-300">
      <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-ems-primary to-purple-500 dark:from-ems-primary-dark dark:to-purple-400">
          EMS Portal
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/home"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${
                  isActive
                    ? "bg-ems-primary/10 text-ems-primary dark:bg-ems-primary-dark/20 dark:text-ems-primary-dark"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-white"
                }`
              }
            >
              {Icon && <Icon className="w-5 h-5" />}
              {item.name}
            </NavLink>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <Link
          to="/home/profile"
          className="flex items-center gap-3 px-3 py-2 mb-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors cursor-pointer"
        >
          {user?.profilePicUrl ? (
            <img
              src={user.profilePicUrl}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 font-bold text-sm ring-2 ring-green-50 dark:ring-green-900/20">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
              {user?.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {user?.role}
            </p>
          </div>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
