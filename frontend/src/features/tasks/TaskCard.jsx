import { Eye, Edit2, Trash2, Calendar, Flag } from "lucide-react";

function TaskCard({
  task,
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
      case "TESTING":
      case "IN_REVIEW":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "BLOCKED":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "TODO":
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "URGENT":
      case "HIGH":
        return "text-red-600 dark:text-red-400";
      case "MEDIUM":
        return "text-yellow-600 dark:text-yellow-400";
      case "LOW":
        return "text-blue-600 dark:text-blue-400";
      default:
        return "text-slate-500 dark:text-slate-400";
    }
  };

  // Only allow Managers, Management, or the assigned user to edit/update
  const canEdit =
    user?.role === "Management" ||
    user?.role === "Manager" ||
    user?._id === task.assignedTo?._id;
  const canDelete = user?.role === "Management" || user?.role === "Manager";

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex-1 pr-2">
          {task.taskName}
        </h3>
        <span
          className={`px-2.5 py-1 text-xs font-medium rounded-full shrink-0 ${getStatusColor(
            task.status
          )}`}
        >
          {task.status?.replace("_", " ")}
        </span>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 min-h-[40px] flex-1">
        {task.description || "No description provided."}
      </p>

      <div className="mb-4 text-sm text-slate-500 dark:text-slate-400 space-y-1.5 shrink-0">
        <div className="flex items-center gap-2">
          <Flag className={`w-4 h-4 ${getPriorityColor(task.priority)}`} />
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {task.priority || "Normal"} Priority
          </span>
        </div>
        <div className="truncate">
          Assigned To:{" "}
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {task.assignedTo?.name || "Unassigned"}
          </span>
        </div>
        <div className="truncate">
          Project:{" "}
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {task.project?.projectName || "N/A"}
          </span>
        </div>

        <div className="flex items-center gap-4 mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/50">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(task.startDate)}</span>
          </div>
          <span className="text-slate-300 dark:text-slate-600">→</span>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end text-sm text-slate-500 dark:text-slate-400 mt-2 border-t border-slate-100 dark:border-slate-700 pt-3 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => openViewModal(task)}
            className="p-1.5 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/30 dark:hover:text-green-400 rounded-lg transition-colors cursor-pointer"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          {canEdit && (
            <button
              onClick={() => openUpdateModal(task)}
              className="p-1.5 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 rounded-lg transition-colors cursor-pointer"
              title="Edit Task"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => setDeleteConfirmId(task._id)}
              className="p-1.5 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 rounded-lg transition-colors cursor-pointer"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
