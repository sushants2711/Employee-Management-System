import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { Circle } from "lucide-react";
import { updateIsAvailable, getSingleUser } from "../api/authApi";
import { showSuccess, showError } from "../toastMessage/toastDeliver";

const STATUS_OPTIONS = [
  { value: "Available", color: "text-green-500" },
  { value: "Busy", color: "text-blue-500" },
  { value: "Do not distrub", color: "text-red-600" },
  { value: "Appear offline", color: "text-slate-400" },
  { value: "Break Taken", color: "text-yellow-500" },
  { value: "Meeting", color: "text-orange-500" },
];

function DashboardLayout() {
  const { user, updateUser } = useAuth();
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const syncUser = async () => {
      // Only fetch from backend if local storage does not have it saved yet
      if (!localStorage.getItem("isAvailable")) {
        try {
          const res = await getSingleUser();
          if (res?.data) {
            updateUser({
              isAvailable: res.data.isAvailable || "Available",
              name: res.data.name,
              role: res.data.role,
            });
          }
        } catch (error) {
          console.error("Failed to sync user data:", error);
        }
      }
    };
    syncUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatusChange = async (newStatus) => {
    setIsDropdownOpen(false);
    try {
      setIsUpdatingStatus(true);
      await updateIsAvailable(newStatus);
      updateUser({ isAvailable: newStatus });
      showSuccess(`Status updated to ${newStatus}`);
    } catch (error) {
      showError(error.message || "Failed to update status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 flex items-center justify-end px-6 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm z-10">
          <div className="relative w-auto min-w-[140px]">
            <button
              onClick={() =>
                !isUpdatingStatus && setIsDropdownOpen(!isDropdownOpen)
              }
              disabled={isUpdatingStatus}
              className={`w-full flex items-center justify-between gap-2 bg-transparent border-none text-sm font-medium py-2 pl-2 pr-2 focus:outline-none cursor-pointer disabled:opacity-50 transition-colors ${
                STATUS_OPTIONS.find(
                  (opt) => opt.value === (user?.isAvailable || "Available")
                )?.color || "text-slate-500"
              }`}
            >
              <div className="flex items-center gap-2">
                <Circle
                  className={`w-3.5 h-3.5 fill-current ${
                    STATUS_OPTIONS.find(
                      (opt) => opt.value === (user?.isAvailable || "Available")
                    )?.color || "text-slate-500"
                  }`}
                />
                <span>{user?.isAvailable || "Available"}</span>
              </div>
              {isUpdatingStatus ? (
                <div className="w-4 h-4 border-2 border-slate-300 border-t-ems-primary rounded-full animate-spin"></div>
              ) : (
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              )}
            </button>

            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsDropdownOpen(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="py-1">
                    {STATUS_OPTIONS.map((status) => (
                      <button
                        key={status.value}
                        onClick={() => handleStatusChange(status.value)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left"
                      >
                        <Circle
                          className={`w-3 h-3 fill-current ${status.color}`}
                        />
                        {status.value}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
