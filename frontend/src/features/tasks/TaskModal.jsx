import {
  X,
  Calendar,
  User,
  Users,
  Activity,
  AlignLeft,
  Flag,
  Briefcase,
} from "lucide-react";
import InputField from "../../components/InputField";
import SelectField from "../../components/SelectField";
import SubmitButton from "../../components/SubmitButton";

function TaskModal({
  modalConfig,
  setModalConfig,
  selectedItem,
  formData,
  errors,
  isSubmitting,
  projects,
  teams,
  users,
  user,
  handleInputChange,
  handleSubmit,
}) {
  if (!modalConfig.isOpen) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isAssignedUser =
    selectedItem?.assignedTo?._id === user?._id ||
    selectedItem?.assignedTo === user?._id;
  const isManagementOrManager =
    user?.role === "Management" || user?.role === "Manager";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto pt-24 pb-10">
      <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {modalConfig.mode === "CREATE"
              ? "Create Task"
              : modalConfig.mode === "UPDATE"
                ? "Edit Task"
                : "Task Details"}
          </h2>
          <button
            onClick={() => setModalConfig({ ...modalConfig, isOpen: false })}
            className="p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {modalConfig.mode === "VIEW" && selectedItem ? (
          <div className="p-6 max-h-[75vh] overflow-y-auto">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {selectedItem.taskName}
                </h3>
                <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 rounded-full text-xs font-semibold uppercase tracking-wider">
                  <Activity className="w-3.5 h-3.5" />
                  {selectedItem.status?.replace("_", " ")}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-semibold uppercase tracking-wider">
                  <Flag className="w-3.5 h-3.5" />
                  {selectedItem.priority} Priority
                </span>
              </div>
              <div className="flex items-start gap-3 mt-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <AlignLeft className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                    Description
                  </p>
                  <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed text-sm">
                    {selectedItem.description ||
                      "No description provided for this task."}
                  </p>
                </div>
              </div>

              {selectedItem.remarks && (
                <div className="flex items-start gap-3 mt-4 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/20">
                  <AlignLeft className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
                      Remarks
                    </p>
                    <p className="text-blue-800 dark:text-blue-200 whitespace-pre-wrap leading-relaxed text-sm">
                      {selectedItem.remarks}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Timeline Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                  <Calendar className="w-4 h-4 text-ems-primary" />
                  Timeline
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Start Date
                    </span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {formatDate(selectedItem.startDate)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Due Date
                    </span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {formatDate(selectedItem.dueDate)}
                    </span>
                  </div>
                  {selectedItem.completedAt && (
                    <div className="flex justify-between items-center bg-emerald-50 dark:bg-emerald-900/10 p-3 rounded-lg border border-emerald-100 dark:border-emerald-900/20 shadow-sm">
                      <span className="text-sm text-emerald-700 dark:text-emerald-400">
                        Completed On
                      </span>
                      <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                        {formatDate(selectedItem.completedAt)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Associations Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                  <Users className="w-4 h-4 text-ems-primary" />
                  Associations
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                      <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Project
                      </p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {selectedItem.project?.projectName || "No Project"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Team
                      </p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {selectedItem.team?.teamName || "No Team"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Assigned To
                      </p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {selectedItem.assignedTo?.name || "Unassigned"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <span className="text-xs text-slate-400">
                Created: {formatDate(selectedItem.createdAt)}
              </span>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="p-5 space-y-6 max-h-[70vh] overflow-y-auto"
          >
            <InputField
              label="Task Name"
              name="taskName"
              value={formData.taskName}
              onChange={handleInputChange}
              error={errors.taskName}
              disabled={isSubmitting}
              placeholder="e.g. Design Login Page"
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className={`w-full px-4 py-2.5 rounded-xl border ${
                  errors.description
                    ? "border-red-300 focus:ring-red-500 dark:border-red-500/50"
                    : "border-slate-300 dark:border-slate-700 focus:ring-ems-primary"
                } bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none h-24`}
                placeholder="Briefly describe the task..."
              />
              {errors.description && (
                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 font-medium">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <SelectField
                label="Project"
                name="project"
                value={formData.project}
                onChange={handleInputChange}
                error={errors.project}
                disabled={isSubmitting}
                placeholder="Select a project"
                options={projects.map((p) => ({
                  label: p.projectName,
                  value: p._id,
                }))}
              />

              <SelectField
                label="Team"
                name="team"
                value={formData.team}
                onChange={handleInputChange}
                error={errors.team}
                disabled={isSubmitting}
                placeholder="Select a team"
                options={teams.map((t) => ({
                  label: t.teamName,
                  value: t._id,
                }))}
              />

              <SelectField
                label="Assign To"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleInputChange}
                error={errors.assignedTo}
                disabled={isSubmitting}
                placeholder="Select a user"
                options={users.map((u) => ({
                  label: u.name,
                  value: u._id,
                }))}
              />

              <SelectField
                label="Priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                error={errors.priority}
                disabled={isSubmitting}
                options={[
                  { label: "Low", value: "LOW" },
                  { label: "Medium", value: "MEDIUM" },
                  { label: "High", value: "HIGH" },
                  { label: "Urgent", value: "URGENT" },
                ]}
              />

              {modalConfig.mode === "UPDATE" && (
                <SelectField
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  disabled={isSubmitting || !isAssignedUser} // only assigned user can update status
                  options={[
                    { label: "To Do", value: "TODO" },
                    { label: "In Progress", value: "IN_PROGRESS" },
                    { label: "In Review", value: "IN_REVIEW" },
                    { label: "Testing", value: "TESTING" },
                    { label: "Completed", value: "COMPLETED" },
                    { label: "Blocked", value: "BLOCKED" },
                  ]}
                />
              )}

              <InputField
                label="Start Date"
                name="startDate"
                type="date"
                value={formData.startDate?.split("T")[0] || ""}
                onChange={handleInputChange}
                error={errors.startDate}
                disabled={isSubmitting}
              />

              <InputField
                label="Due Date"
                name="dueDate"
                type="date"
                value={formData.dueDate?.split("T")[0] || ""}
                onChange={handleInputChange}
                error={errors.dueDate}
                disabled={isSubmitting}
              />

              {modalConfig.mode === "UPDATE" && (
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Remarks
                  </label>
                  <textarea
                    name="remarks"
                    value={formData.remarks || ""}
                    onChange={handleInputChange}
                    disabled={
                      isSubmitting ||
                      (!isManagementOrManager && !isAssignedUser)
                    }
                    className={`w-full px-4 py-2.5 rounded-xl border ${
                      errors.remarks
                        ? "border-red-300 focus:ring-red-500 dark:border-red-500/50"
                        : "border-slate-300 dark:border-slate-700 focus:ring-ems-primary"
                    } bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none h-24`}
                    placeholder="Add any remarks or notes about the task status..."
                  />
                  {errors.remarks && (
                    <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 font-medium">
                      {errors.remarks}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="pt-4">
              <SubmitButton isSubmitting={isSubmitting}>
                {modalConfig.mode === "CREATE" ? "Create Task" : "Save Changes"}
              </SubmitButton>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default TaskModal;
