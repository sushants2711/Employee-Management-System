import { X } from "lucide-react";
import InputField from "../../components/InputField";
import SelectField from "../../components/SelectField";
import MultiSelectField from "../../components/MultiSelectField";
import SubmitButton from "../../components/SubmitButton";

function TeamModal({
  modalConfig,
  setModalConfig,
  selectedItem,
  formData,
  errors,
  isSubmitting,
  departments,
  availableManagers,
  availableTeamLeaders,
  availableUsers,
  handleInputChange,
  handleSubmit,
}) {
  if (!modalConfig.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto pt-24 pb-10">
      <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {modalConfig.mode === "CREATE"
              ? "Create Team"
              : modalConfig.mode === "UPDATE"
                ? "Edit Team"
                : "Team Details"}
          </h2>
          <button
            onClick={() => setModalConfig({ ...modalConfig, isOpen: false })}
            className="p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {modalConfig.mode === "VIEW" && selectedItem ? (
          <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Team Name
                </label>
                <p className="text-slate-900 dark:text-white font-semibold text-lg">
                  {selectedItem.teamName}
                </p>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Description
                </label>
                <p className="text-slate-900 dark:text-white whitespace-pre-wrap">
                  {selectedItem.teamDescription || "No description"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Department
                </label>
                <p className="text-slate-900 dark:text-white">
                  {selectedItem.department?.departmentName || "Unknown"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Status
                </label>
                <span
                  className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${
                    selectedItem.status === "ACTIVE"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {selectedItem.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Manager
                </label>
                <p className="text-slate-900 dark:text-white">
                  {selectedItem.manager?.name || "None assigned"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Team Lead
                </label>
                <p className="text-slate-900 dark:text-white">
                  {selectedItem.teamLead?.name || "None assigned"}
                </p>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Team Members
                </label>
                <p className="text-slate-900 dark:text-white">
                  {selectedItem.members?.length > 0
                    ? selectedItem.members.map((m) => (
                        <div key={m._id} className="mb-1">
                          • {m.name} ({m.employeeId}) -{" "}
                          {m.designation?.designationName || "N/A"} |{" "}
                          {m.department?.departmentName || "N/A"}
                        </div>
                      ))
                    : "No members assigned"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="p-5 space-y-6 max-h-[70vh] overflow-y-auto"
          >
            <InputField
              label="Team Name"
              name="teamName"
              value={formData.teamName}
              onChange={handleInputChange}
              error={errors.teamName}
              disabled={isSubmitting}
              placeholder="e.g. Frontend Development"
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Description <span className="text-slate-400">(Optional)</span>
              </label>
              <textarea
                name="teamDescription"
                value={formData.teamDescription}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className={`w-full px-4 py-2.5 rounded-xl border ${
                  errors.teamDescription
                    ? "border-red-300 focus:ring-red-500 dark:border-red-500/50"
                    : "border-slate-300 dark:border-slate-700 focus:ring-ems-primary"
                } bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none h-24`}
                placeholder="Briefly describe the team's purpose..."
              />
              {errors.teamDescription && (
                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 font-medium">
                  {errors.teamDescription}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <SelectField
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                error={errors.department}
                disabled={isSubmitting}
                placeholder="Select a department"
                options={departments.map((dept) => ({
                  label: dept.departmentName,
                  value: dept._id,
                }))}
              />

              <SelectField
                label="Manager"
                name="manager"
                value={formData.manager}
                onChange={handleInputChange}
                error={errors.manager}
                disabled={isSubmitting}
                placeholder="Select a manager"
                options={availableManagers.map((user) => ({
                  label: `${user.name} (${user.role})`,
                  value: user._id,
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
                    { label: "Active", value: "ACTIVE" },
                    { label: "Inactive", value: "INACTIVE" },
                  ]}
                />
              )}

              <SelectField
                label="Team Lead"
                name="teamLead"
                value={formData.teamLead}
                onChange={handleInputChange}
                error={errors.teamLead}
                disabled={isSubmitting}
                placeholder="Select a team lead"
                options={availableTeamLeaders.map((user) => ({
                  label: user.name,
                  value: user._id,
                }))}
              />
            </div>

            <MultiSelectField
              label="Team Members"
              name="members"
              value={formData.members}
              onChange={handleInputChange}
              error={errors.members}
              disabled={isSubmitting}
              placeholder="Select team members"
              options={availableUsers.map((user) => ({
                label: `${user.name} (${user.employeeId}) - ${user.designation?.designationName || "N/A"} | ${user.department?.departmentName || "N/A"}`,
                chipLabel: user.name,
                value: user._id,
              }))}
            />

            <div className="pt-4">
              <SubmitButton isSubmitting={isSubmitting}>
                {modalConfig.mode === "CREATE" ? "Create Team" : "Save Changes"}
              </SubmitButton>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default TeamModal;
