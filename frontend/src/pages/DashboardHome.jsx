import { useEffect, useState, useMemo } from "react";
import { fetchDashboardDetails } from "../api/dashboardApi";
import { showError } from "../toastMessage/toastDeliver";
import HierarchyTree from "../components/HierarchyTree";
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
} from "lucide-react";

function DashboardHome() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

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
      {/* Header Section */}
      <div className="relative overflow-hidden bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 p-8 rounded-3xl shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">
            Dashboard Overview
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Welcome back! Here's a snapshot of your organization's performance.
          </p>
        </div>
      </div>

      {/* Organization Structure Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="group relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl">
              <Building2 size={24} />
            </div>
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Departments
            </h3>
          </div>
          <p className="text-4xl font-extrabold text-slate-800 dark:text-white">
            {data.organization?.departments?.count || 0}
          </p>
        </div>

        <div className="group relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-2xl">
              <Network size={24} />
            </div>
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Teams
            </h3>
          </div>
          <p className="text-4xl font-extrabold text-slate-800 dark:text-white">
            {data.organization?.teams?.count || 0}
          </p>
        </div>

        <div className="group relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-2xl">
              <Briefcase size={24} />
            </div>
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Designations
            </h3>
          </div>
          <p className="text-4xl font-extrabold text-slate-800 dark:text-white">
            {data.organization?.designations?.count || 0}
          </p>
        </div>

        <div className="group relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-2xl">
              <FolderDot size={24} />
            </div>
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Total Projects
            </h3>
          </div>
          <p className="text-4xl font-extrabold text-slate-800 dark:text-white">
            {data.projectStats?.total || 0}
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
          {[
            {
              label: "Management",
              count: data.hierarchy?.management?.count,
              color: "from-fuchsia-500 to-purple-600",
            },
            {
              label: "Managers",
              count: data.hierarchy?.managers?.count,
              color: "from-blue-500 to-cyan-500",
            },
            {
              label: "Team Leaders",
              count: data.hierarchy?.teamLeaders?.count,
              color: "from-emerald-400 to-teal-500",
            },
            {
              label: "Employees",
              count: data.hierarchy?.employees?.count,
              color: "from-orange-400 to-rose-400",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="relative p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-all duration-300 group overflow-hidden"
            >
              <div
                className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${item.color}`}
              ></div>
              <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                {item.label}
              </h4>
              <p className="text-3xl font-black text-slate-800 dark:text-white mt-2 group-hover:scale-110 transition-transform origin-left">
                {item.count || 0}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Project Status Overview */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 relative overflow-hidden">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-8 flex items-center">
          <FolderDot className="mr-3 text-emerald-500" />
          Project Status Overview
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
          {[
            {
              label: "Planned",
              count: data.projectStats?.planned,
              color: "from-slate-400 to-slate-500",
              icon: <Clock size={20} className="text-slate-500 mb-2" />,
            },
            {
              label: "In Progress",
              count: data.projectStats?.inProgress,
              color: "from-blue-400 to-indigo-500",
              icon: <Activity size={20} className="text-blue-500 mb-2" />,
            },
            {
              label: "On Hold",
              count: data.projectStats?.onHold,
              color: "from-amber-400 to-orange-500",
              icon: <PauseCircle size={20} className="text-amber-500 mb-2" />,
            },
            {
              label: "Completed",
              count: data.projectStats?.completed,
              color: "from-emerald-400 to-green-500",
              icon: <CheckCircle size={20} className="text-emerald-500 mb-2" />,
            },
          ].map((item, index) => (
            <div
              key={index}
              className="relative p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-all duration-300 group overflow-hidden"
            >
              <div
                className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${item.color}`}
              ></div>
              {item.icon}
              <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                {item.label}
              </h4>
              <p className="text-3xl font-black text-slate-800 dark:text-white mt-2 group-hover:scale-110 transition-transform origin-left">
                {item.count || 0}
              </p>
            </div>
          ))}
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
                  className="group p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-emerald-500/50 hover:shadow-md transition-all duration-300"
                >
                  <h3 className="font-bold text-slate-800 dark:text-white group-hover:text-emerald-500 transition-colors">
                    {project.projectName}
                  </h3>
                  <div className="flex text-sm text-slate-500 dark:text-slate-400 mt-3 space-x-6">
                    <span className="flex items-center">
                      <Users size={14} className="mr-1.5 opacity-70" />{" "}
                      {project.teamName?.teamName || "N/A"}
                    </span>
                    <span className="flex items-center">
                      <Award size={14} className="mr-1.5 opacity-70" />{" "}
                      {project.manager?.name || "N/A"}
                    </span>
                  </div>
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
                  className="group p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-purple-500/50 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-white group-hover:text-purple-500 transition-colors">
                        {feedback.employee?.name}
                      </h3>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
                        {feedback.project?.projectName}
                      </p>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full border border-purple-500/20">
                      {feedback.status}
                    </span>
                  </div>
                  {feedback.remarks && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 italic border-l-2 border-purple-200 dark:border-purple-900/50 pl-3">
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
