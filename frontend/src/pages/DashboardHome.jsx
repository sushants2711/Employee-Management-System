import { useEffect, useState, useMemo } from "react";
import { fetchDashboardDetails } from "../api/dashboardApi";
import { showError } from "../toastMessage/toastDeliver";
import HierarchyTree from "../components/HierarchyTree";
import AnimatedCounter from "../components/AnimatedCounter";
import {
  Building2,
  Network,
  Layers,
  Users,
  Briefcase,
  CheckCircle,
  MessageSquare,
  Award,
  Clock,
  Activity,
  PauseCircle,
  FolderDot,
  UserPlus,
  PlusCircle,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

function DashboardHome() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  });
  
  const [currentDate] = useState(() => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date().toLocaleDateString(undefined, options);
  });
  
  const [firstName] = useState(() => {
    const storedName = localStorage.getItem("name");
    return storedName ? storedName.split(" ")[0] : "User";
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const response = await fetchDashboardDetails();
        setData(response.data);
      } catch {
        showError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const hierarchyData = useMemo(() => {
    if (!data || !data.hierarchy) return [];

    const allUsers = [
      ...(data.hierarchy.management?.data || []),
      ...(data.hierarchy.managers?.data || []),
      ...(data.hierarchy.teamLeaders?.data || []),
      ...(data.hierarchy.employees?.data || []),
    ];

    if (allUsers.length === 0) return [];

    const userNodesMap = new Map();
    allUsers.forEach((user) => {
      userNodesMap.set(user._id, {
        name: user.name,
        role: user.role,
        empId: user.employeeId,
        children: [],
      });
    });

    const roots = [];

    allUsers.forEach((user) => {
      const node = userNodesMap.get(user._id);
      if (user.createdAccount && userNodesMap.has(user.createdAccount)) {
        const parentNode = userNodesMap.get(user.createdAccount);
        parentNode.children.push(node);
      } else {
        roots.push(node);
      }
    });

    const roleWeight = {
      Root: 0,
      Management: 1,
      Manager: 2,
      "Team Leader": 3,
      Employee: 4,
    };

    const sortTree = (nodes) => {
      nodes.sort(
        (a, b) => (roleWeight[a.role] || 99) - (roleWeight[b.role] || 99)
      );
      nodes.forEach((node) => {
        if (node.children && node.children.length > 0) {
          sortTree(node.children);
        }
      });
    };

    sortTree(roots);

    if (roots.length > 1) {
      return [
        {
          name: "Organization",
          role: "Root",
          children: roots,
        },
      ];
    }

    return roots;
  }, [data]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[50vh]">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header Section with Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Welcome Card */}
        <div className="lg:col-span-2 relative overflow-hidden bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 p-8 rounded-3xl shadow-sm flex flex-col justify-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2 tracking-tight">
                {greeting}, {firstName}!
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Here's what's happening in your organization today.
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-2 bg-white/50 dark:bg-slate-800/50 px-4 py-2 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50">
              <Calendar className="text-indigo-500" size={20} />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {currentDate}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/home/users"
              className="flex flex-col items-center justify-center p-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors group border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800/50 cursor-pointer"
            >
              <UserPlus
                size={24}
                className="mb-2 group-hover:scale-110 transition-transform"
              />
              <span className="text-xs font-semibold">Add User</span>
            </Link>
            <Link
              to="/home/projects"
              className="flex flex-col items-center justify-center p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors group border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800/50 cursor-pointer"
            >
              <PlusCircle
                size={24}
                className="mb-2 group-hover:scale-110 transition-transform"
              />
              <span className="text-xs font-semibold">New Project</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Organization Structure Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="group relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl group-hover:scale-110 transition-transform">
              <Building2 size={24} />
            </div>
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Departments
            </h3>
          </div>
          <p className="text-4xl font-extrabold text-slate-800 dark:text-white">
            <AnimatedCounter
              value={data.organization?.departments?.count || 0}
            />
          </p>
        </div>

        <div className="group relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-2xl group-hover:scale-110 transition-transform">
              <Network size={24} />
            </div>
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Teams
            </h3>
          </div>
          <p className="text-4xl font-extrabold text-slate-800 dark:text-white">
            <AnimatedCounter value={data.organization?.teams?.count || 0} />
          </p>
        </div>

        <div className="group relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-2xl group-hover:scale-110 transition-transform">
              <Briefcase size={24} />
            </div>
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Designations
            </h3>
          </div>
          <p className="text-4xl font-extrabold text-slate-800 dark:text-white">
            <AnimatedCounter
              value={data.organization?.designations?.count || 0}
            />
          </p>
        </div>

        <div className="group relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-2xl group-hover:scale-110 transition-transform">
              <FolderDot size={24} />
            </div>
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Total Projects
            </h3>
          </div>
          <p className="text-4xl font-extrabold text-slate-800 dark:text-white">
            <AnimatedCounter value={data.projectStats?.total || 0} />
          </p>
        </div>
      </div>

      {/* Employee Distribution */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-8 flex items-center">
          <Users className="mr-3 text-indigo-500" />
          Employee Distribution
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {[
            {
              label: "Management",
              count: data.hierarchy?.management?.count,
              color: "from-fuchsia-500 to-purple-600",
              bgColor: "bg-fuchsia-100 dark:bg-fuchsia-900/30",
            },
            {
              label: "Managers",
              count: data.hierarchy?.managers?.count,
              color: "from-blue-500 to-cyan-500",
              bgColor: "bg-blue-100 dark:bg-blue-900/30",
            },
            {
              label: "Team Leaders",
              count: data.hierarchy?.teamLeaders?.count,
              color: "from-emerald-400 to-teal-500",
              bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
            },
            {
              label: "Employees",
              count: data.hierarchy?.employees?.count,
              color: "from-orange-400 to-rose-400",
              bgColor: "bg-orange-100 dark:bg-orange-900/30",
            },
          ].map((item, index) => {
            const total =
              (data.hierarchy?.management?.count || 0) +
              (data.hierarchy?.managers?.count || 0) +
              (data.hierarchy?.teamLeaders?.count || 0) +
              (data.hierarchy?.employees?.count || 0);
            const percentage =
              total > 0 ? Math.round(((item.count || 0) / total) * 100) : 0;
            return (
              <div
                key={index}
                className="relative p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-all duration-300 group overflow-hidden"
              >
                <div
                  className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${item.color}`}
                ></div>
                <div className="flex justify-between items-end mb-4">
                  <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    {item.label}
                  </h4>
                  <p className="text-3xl font-black text-slate-800 dark:text-white group-hover:scale-110 transition-transform origin-bottom-right">
                    <AnimatedCounter value={item.count || 0} />
                  </p>
                </div>

                <div
                  className={`w-full h-2 rounded-full ${item.bgColor} overflow-hidden`}
                >
                  <div
                    className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-right mt-2 text-slate-400 font-medium">
                  {percentage}% of total
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Project Status Overview with Donut Chart */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 relative overflow-hidden">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-8 flex items-center">
          <FolderDot className="mr-3 text-emerald-500" />
          Project Status Overview
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center relative z-10">
          {(() => {
            const projectTotal = data.projectStats?.total || 0;
            const planned = data.projectStats?.planned || 0;
            const inProgress = data.projectStats?.inProgress || 0;
            const onHold = data.projectStats?.onHold || 0;
            const completed = data.projectStats?.completed || 0;

            const plannedPct =
              projectTotal > 0 ? (planned / projectTotal) * 100 : 0;
            const inProgressPct =
              projectTotal > 0 ? (inProgress / projectTotal) * 100 : 0;
            const onHoldPct =
              projectTotal > 0 ? (onHold / projectTotal) * 100 : 0;

            const conicGradientStr =
              projectTotal > 0
                ? `conic-gradient(
                  #94a3b8 0% ${plannedPct}%,
                  #3b82f6 ${plannedPct}% ${plannedPct + inProgressPct}%,
                  #fbbf24 ${plannedPct + inProgressPct}% ${plannedPct + inProgressPct + onHoldPct}%,
                  #10b981 ${plannedPct + inProgressPct + onHoldPct}% 100%
                )`
                : `conic-gradient(#334155 0% 100%)`;

            return (
              <>
                <div className="flex justify-center lg:col-span-1">
                  <div
                    className="relative w-48 h-48 rounded-full shadow-inner flex items-center justify-center animate-fade-in"
                    style={{ background: conicGradientStr }}
                  >
                    <div className="absolute w-36 h-36 bg-white dark:bg-slate-800 rounded-full flex flex-col items-center justify-center shadow-lg">
                      <span className="text-3xl font-black text-slate-800 dark:text-white">
                        <AnimatedCounter value={projectTotal} />
                      </span>
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">
                        Total
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 lg:col-span-2">
                  {[
                    {
                      label: "Planned",
                      count: planned,
                      color: "from-slate-400 to-slate-500",
                      bgColor: "bg-slate-100 dark:bg-slate-700/50",
                      icon: <Clock size={20} className="text-slate-500" />,
                    },
                    {
                      label: "In Progress",
                      count: inProgress,
                      color: "from-blue-400 to-indigo-500",
                      bgColor: "bg-blue-100 dark:bg-blue-900/30",
                      icon: <Activity size={20} className="text-blue-500" />,
                    },
                    {
                      label: "On Hold",
                      count: onHold,
                      color: "from-amber-400 to-orange-500",
                      bgColor: "bg-amber-100 dark:bg-amber-900/30",
                      icon: (
                        <PauseCircle size={20} className="text-amber-500" />
                      ),
                    },
                    {
                      label: "Completed",
                      count: completed,
                      color: "from-emerald-400 to-green-500",
                      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
                      icon: (
                        <CheckCircle size={20} className="text-emerald-500" />
                      ),
                    },
                  ].map((item, index) => {
                    const percentage =
                      projectTotal > 0
                        ? Math.round(((item.count || 0) / projectTotal) * 100)
                        : 0;
                    return (
                      <div
                        key={index}
                        className="relative p-5 bg-white dark:bg-slate-800/80 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all duration-300 group overflow-hidden flex items-center justify-between"
                      >
                        <div
                          className={`absolute left-0 top-0 w-1 h-full bg-gradient-to-b ${item.color}`}
                        ></div>
                        <div className="flex items-center space-x-3 ml-2">
                          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 group-hover:scale-110 transition-transform">
                            {item.icon}
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                              {item.label}
                            </h4>
                            <p className="text-xs text-slate-400">
                              {percentage}%
                            </p>
                          </div>
                        </div>
                        <p className="text-2xl font-black text-slate-800 dark:text-white mr-2">
                          <AnimatedCounter value={item.count || 0} />
                        </p>
                      </div>
                    );
                  })}
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {/* Organizational Hierarchy Chart */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 w-full overflow-hidden">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center">
          <Layers className="mr-3 text-blue-500" />
          Organizational Chart
        </h2>
        <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
          {hierarchyData.length > 0 ? (
            <HierarchyTree data={hierarchyData} />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Network size={48} className="mb-4 opacity-50" />
              <p className="text-sm">
                Hierarchy tree is empty. Add users to populate the chart.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Completed Projects */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center">
              <CheckCircle className="mr-3 text-emerald-500" />
              Completed Projects
            </h2>
            <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-bold px-4 py-1.5 rounded-full border border-emerald-500/20">
              {data.completedProjects?.count || 0} Total
            </span>
          </div>

          <div className="space-y-4 flex-grow">
            {data.completedProjects?.data?.length > 0 ? (
              data.completedProjects.data.slice(0, 5).map((project) => (
                <div
                  key={project._id}
                  className="group flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-emerald-500/50 hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold group-hover:scale-110 transition-transform">
                      {project.projectName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-white group-hover:text-emerald-500 transition-colors">
                        {project.projectName}
                      </h3>
                      <div className="flex text-xs text-slate-500 dark:text-slate-400 mt-1 space-x-4">
                        <span className="flex items-center">
                          <Users size={12} className="mr-1 opacity-70" />{" "}
                          {project.teamName?.teamName || "N/A"}
                        </span>
                        <span className="flex items-center">
                          <Award size={12} className="mr-1 opacity-70" />{" "}
                          {project.manager?.name || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 transition-colors"
                  />
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-10">
                <CheckCircle size={40} className="mb-3 opacity-50" />
                <p className="text-sm">No completed projects yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Feedback */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center">
              <MessageSquare className="mr-3 text-purple-500" />
              Recent Feedback
            </h2>
          </div>

          <div className="space-y-4 flex-grow">
            {data.recentFeedback?.data?.length > 0 ? (
              data.recentFeedback.data.slice(0, 5).map((feedback) => (
                <div
                  key={feedback._id}
                  className="group p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-purple-500/50 hover:shadow-md transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute left-0 top-0 h-full w-1 bg-purple-500/0 group-hover:bg-purple-500 transition-colors"></div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-xs">
                        {feedback.employee?.name
                          ? feedback.employee.name.charAt(0).toUpperCase()
                          : "?"}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 dark:text-white group-hover:text-purple-500 transition-colors text-sm">
                          {feedback.employee?.name}
                        </h3>
                        <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 uppercase tracking-wider">
                          {feedback.project?.projectName}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full border border-purple-500/20">
                      {feedback.status}
                    </span>
                  </div>
                  {feedback.remarks && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 italic border-l-2 border-purple-200 dark:border-purple-900/50 pl-3">
                      "{feedback.remarks}"
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-10">
                <MessageSquare size={40} className="mb-3 opacity-50" />
                <p className="text-sm">No recent feedback available.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
