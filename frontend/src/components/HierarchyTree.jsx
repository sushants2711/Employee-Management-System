import { UserCircle, Shield, Star, Briefcase } from "lucide-react";
import "./HierarchyTree.css";

const getRoleIcon = (role) => {
  switch (role) {
    case "Management":
      return <Shield size={16} className="text-fuchsia-500" />;
    case "Manager":
      return <Briefcase size={16} className="text-blue-500" />;
    case "Team Leader":
      return <Star size={16} className="text-emerald-500" />;
    case "Department":
      return <Shield size={16} className="text-indigo-500" />;
    case "Designation":
      return <Briefcase size={16} className="text-cyan-500" />;
    case "Root":
      return <UserCircle size={16} className="text-orange-500" />;
    default:
      return <UserCircle size={16} className="text-orange-500" />;
  }
};

const getRoleBadgeStyle = (role) => {
  switch (role) {
    case "Management":
      return "bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/20";
    case "Manager":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
    case "Team Leader":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    case "Department":
      return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
    case "Designation":
      return "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20";
    case "Root":
      return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20";
    default:
      return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20";
  }
};

const TreeNode = ({ node }) => {
  return (
    <li>
      <div className="org-tree-node group">
        <div className="flex items-center justify-center mb-2">
          <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-full group-hover:scale-110 transition-transform shadow-inner border border-slate-100 dark:border-slate-700">
            {getRoleIcon(node.role)}
          </div>
        </div>
        <div className="font-bold text-slate-800 dark:text-white text-sm mb-1">
          {node.name}
        </div>
        {node.empId && (
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-mono">
            {node.empId}
          </div>
        )}
        <div
          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getRoleBadgeStyle(node.role)} uppercase tracking-wider`}
        >
          {node.role}
        </div>
      </div>
      {node.children && node.children.length > 0 && (
        <ul>
          {node.children.map((child, idx) => (
            <TreeNode key={idx} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
};

const HierarchyTree = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="org-tree">
      <ul>
        {data.map((rootNode, idx) => (
          <TreeNode key={idx} node={rootNode} />
        ))}
      </ul>
    </div>
  );
};

export default HierarchyTree;
