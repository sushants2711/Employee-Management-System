import { Eye, Edit2, Trash2, Calendar } from "lucide-react";

function ProjectCard({
  project,
  user,
  openViewModal,
  openUpdateModal,
  setDeleteConfirmId,
}) {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "ON_HOLD":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "PLANNED":
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          {project.projectName}
        </h3>
        <span
          className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(
            project.status
          )}`}
        >
          {project.status?.replace("_", " ")}
        </span>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 min-h-[40px]">
        {project.description || "No description provided."}
      </p>

      <div className="mb-4 text-sm text-slate-500 dark:text-slate-400 space-y-1.5">
        <div>
          Team:{" "}
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {project.teamName?.teamName || "Unknown"}
          </span>
        </div>
        <div>
          Manager:{" "}
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {project.teamName?.manager?.name || "Unknown"}
          </span>
        </div>
        <div>
          Lead:{" "}
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {project.teamName?.teamLead?.name || "Unknown"}
          </span>
        </div>

        <div className="flex items-center gap-4 mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/50">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(project.startDate)}</span>
          </div>
          <span className="text-slate-300 dark:text-slate-600">→</span>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(project.endDate)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end text-sm text-slate-500 dark:text-slate-400 mt-2 border-t border-slate-100 dark:border-slate-700 pt-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => openViewModal(project)}
            className="p-1.5 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/30 dark:hover:text-green-400 rounded-lg transition-colors cursor-pointer"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          {user?.role === "Management" && (
            <>
              <button
                onClick={() => openUpdateModal(project)}
                className="p-1.5 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 rounded-lg transition-colors cursor-pointer"
                title="Edit Project"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeleteConfirmId(project._id)}
                className="p-1.5 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                title="Delete Project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
