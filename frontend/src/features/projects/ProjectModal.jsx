import {
  X,
  Calendar,
  User,
  Users,
  CheckCircle,
  Clock,
  PauseCircle,
  Activity,
  AlignLeft,
  UserCog,
} from "lucide-react";
import InputField from "../../components/InputField";
import SelectField from "../../components/SelectField";
import SubmitButton from "../../components/SubmitButton";

function ProjectModal({
  modalConfig,
  setModalConfig,
  selectedItem,
  formData,
  errors,
  isSubmitting,
  teams,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto pt-24 pb-10">
      <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {modalConfig.mode === "CREATE"
              ? "Create Project"
              : modalConfig.mode === "UPDATE"
                ? "Edit Project"
                : "Project Details"}
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
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {selectedItem.projectName}
                </h3>
                {selectedItem.status === "COMPLETED" && (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full text-xs font-semibold uppercase tracking-wider">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Completed
                  </span>
                )}
                {selectedItem.status === "IN_PROGRESS" && (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-semibold uppercase tracking-wider">
                    <Activity className="w-3.5 h-3.5" />
                    In Progress
                  </span>
                )}
                {selectedItem.status === "ON_HOLD" && (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-100/80 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full text-xs font-semibold uppercase tracking-wider">
                    <PauseCircle className="w-3.5 h-3.5" />
                    On Hold
                  </span>
                )}
                {selectedItem.status === "PLANNED" && (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 rounded-full text-xs font-semibold uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5" />
                    Planned
                  </span>
                )}
              </div>
              <div className="flex items-start gap-3 mt-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <AlignLeft className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed text-sm">
                  {selectedItem.description ||
                    "No description provided for this project."}
                </p>
              </div>
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
                      Target End
                    </span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {formatDate(selectedItem.endDate)}
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

              {/* Team & Ownership Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                  <Users className="w-4 h-4 text-ems-primary" />
                  Team & Ownership
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Assigned Team
                      </p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {selectedItem.teamName?.teamName || "Unassigned"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                      <UserCog className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Project Manager
                      </p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {selectedItem.teamName?.manager?.name ||
                          "None assigned"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Team Lead
                      </p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {selectedItem.teamName?.teamLead?.name ||
                          "None assigned"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Assigned By (Creator)
                      </p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {selectedItem.assignBy?.name || "System"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                    Team Members ({selectedItem.teamName?.members?.length || 0})
                  </p>
                  {selectedItem.teamName?.members?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.teamName.members.map((member) => (
                        <span
                          key={member._id}
                          className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700/50 dark:text-slate-300"
                        >
                          {member.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                      No members assigned to this team.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <span className="text-xs text-slate-400">
                Created: {formatDate(selectedItem.createdAt)}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <span
                  className={`w-2 h-2 rounded-full ${selectedItem.isActive ? "bg-emerald-500" : "bg-red-500"}`}
                ></span>
                {selectedItem.isActive ? "Active Record" : "Archived Record"}
              </span>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="p-5 space-y-6 max-h-[70vh] overflow-y-auto"
          >
            <InputField
              label="Project Name"
              name="projectName"
              value={formData.projectName}
              onChange={handleInputChange}
              error={errors.projectName}
              disabled={isSubmitting}
              placeholder="e.g. Website Redesign"
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
                } bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none h-32`}
                placeholder="Briefly describe the project's goals..."
              />
              {errors.description && (
                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 font-medium">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <SelectField
                label="Assigned Team"
                name="teamName"
                value={formData.teamName}
                onChange={handleInputChange}
                error={errors.teamName}
                disabled={isSubmitting || modalConfig.mode === "UPDATE"}
                placeholder="Select a team"
                options={teams.map((team) => ({
                  label: team.teamName,
                  value: team._id,
                }))}
              />

              {modalConfig.mode === "UPDATE" && (
                <SelectField
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  options={[
                    { label: "Planned", value: "PLANNED" },
                    { label: "In Progress", value: "IN_PROGRESS" },
                    { label: "On Hold", value: "ON_HOLD" },
                    { label: "Completed", value: "COMPLETED" },
                  ]}
                />
              )}

              <InputField
                label="Start Date"
                name="startDate"
                type="date"
                value={formData.startDate?.split("T")[0]} // Just YYYY-MM-DD
                onChange={handleInputChange}
                error={errors.startDate}
                disabled={isSubmitting}
              />

              <InputField
                label="End Date"
                name="endDate"
                type="date"
                value={formData.endDate?.split("T")[0]}
                onChange={handleInputChange}
                error={errors.endDate}
                disabled={isSubmitting}
              />
            </div>

            <div className="pt-4">
              <SubmitButton isSubmitting={isSubmitting}>
                {modalConfig.mode === "CREATE"
                  ? "Create Project"
                  : "Save Changes"}
              </SubmitButton>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ProjectModal;
