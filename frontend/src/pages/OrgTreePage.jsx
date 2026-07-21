import { useEffect, useState, useMemo } from "react";
import { fetchOrgTreeDetails } from "../api/dashboardApi";
import { showError } from "../toastMessage/toastDeliver";
import HierarchyTree from "../components/HierarchyTree";
import { Layers, Network, Building2, Users, Briefcase } from "lucide-react";
import AnimatedCounter from "../components/AnimatedCounter";

function OrgTreePage() {
  const [loading, setLoading] = useState(true);
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    const loadOrgTree = async () => {
      try {
        const response = await fetchOrgTreeDetails();
        setTreeData(response.data || []);
      } catch {
        showError("Failed to load organization tree");
      } finally {
        setLoading(false);
      }
    };
    loadOrgTree();
  }, []);

  const stats = useMemo(() => {
    let deptCount = 0;
    let desigCount = 0;
    let totalEmployees = 0;

    if (treeData && treeData.length > 0 && treeData[0].children) {
      deptCount = treeData[0].children.length;
      treeData[0].children.forEach((dept) => {
        if (dept.children) {
          desigCount += dept.children.length;
          // Recursively count users inside designations
          const countUsers = (nodes) => {
            let count = 0;
            nodes.forEach((node) => {
              if (node.role !== "Level" && node.role !== "Root") {
                count++;
              }
              if (node.children) {
                count += countUsers(node.children);
              }
            });
            return count;
          };
          dept.children.forEach((desig) => {
            if (desig.children) totalEmployees += countUsers(desig.children);
          });
        }
      });
    }

    return { deptCount, desigCount, totalEmployees };
  }, [treeData]);

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

  return (
    <div className="space-y-8 pb-10 animate-fade-in">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 p-8 rounded-3xl shadow-sm flex flex-col justify-center">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2 tracking-tight flex items-center gap-3">
              Organization Chart
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              A complete visual hierarchy of the company's structure.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2 bg-white/50 dark:bg-slate-800/50 px-4 py-2.5 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50">
              <Building2 className="text-blue-500 w-5 h-5" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Departments
                </span>
                <span className="text-sm font-black text-slate-800 dark:text-white leading-none">
                  <AnimatedCounter value={stats.deptCount} />
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-white/50 dark:bg-slate-800/50 px-4 py-2.5 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50">
              <Briefcase className="text-purple-500 w-5 h-5" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Designations
                </span>
                <span className="text-sm font-black text-slate-800 dark:text-white leading-none">
                  <AnimatedCounter value={stats.desigCount} />
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-white/50 dark:bg-slate-800/50 px-4 py-2.5 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50">
              <Users className="text-emerald-500 w-5 h-5" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Employees
                </span>
                <span className="text-sm font-black text-slate-800 dark:text-white leading-none">
                  <AnimatedCounter value={stats.totalEmployees} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tree Section */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 w-full overflow-hidden min-h-[600px] relative">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center relative z-10">
          <Layers className="mr-3 text-blue-500" />
          Company Hierarchy Map
        </h2>

        <div className="w-full overflow-x-auto pb-4 custom-scrollbar relative z-10">
          {treeData && treeData.length > 0 ? (
            <HierarchyTree data={treeData} />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Network size={64} className="mb-4 opacity-30" />
              <p className="text-sm font-medium">
                The organization tree is currently empty.
              </p>
              <p className="text-xs mt-1 opacity-70">
                Add users to departments to populate the chart.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrgTreePage;
