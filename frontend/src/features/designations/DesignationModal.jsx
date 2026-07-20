import { X } from "lucide-react";
import InputField from "../../components/InputField";
import SelectField from "../../components/SelectField";
import SubmitButton from "../../components/SubmitButton";

function DesignationModal({
  modalConfig,
  setModalConfig,
  selectedItem,
  formData,
  errors,
  isSubmitting,
  departments,
  handleInputChange,
  handleSubmit,
}) {
  if (!modalConfig.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {modalConfig.mode === "CREATE"
              ? "Create Designation"
              : modalConfig.mode === "UPDATE"
                ? "Edit Designation"
                : "Designation Details"}
          </h2>
          <button
            onClick={() => setModalConfig({ ...modalConfig, isOpen: false })}
            className="p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {modalConfig.mode === "VIEW" && selectedItem ? (
          <div className="p-5 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                Designation Name
              </label>
              <p className="text-slate-900 dark:text-white font-medium">
                {selectedItem.designationName}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                Designation Code
              </label>
              <p className="font-mono text-slate-900 dark:text-white">
                {selectedItem.designationCode}
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
                Description
              </label>
              <p className="text-slate-900 dark:text-white">
                {selectedItem.description || "No description provided."}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                Status
              </label>
              <span
                className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                  selectedItem.status === "ACTIVE"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {selectedItem.status}
              </span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-5">
            <InputField
              label="Designation Name"
              name="designationName"
              value={formData.designationName}
              onChange={handleInputChange}
              error={errors.designationName}
              disabled={isSubmitting}
              placeholder="e.g. Software Engineer"
            />
            <InputField
              label="Designation Code"
              name="designationCode"
              value={formData.designationCode}
              onChange={handleInputChange}
              error={errors.designationCode}
              disabled={isSubmitting}
              placeholder="e.g. SWE-001"
            />

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

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Description <span className="text-slate-400">(Optional)</span>
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
                placeholder="Briefly describe the designation's role..."
              />
              {errors.description && (
                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 font-medium">
                  {errors.description}
                </p>
              )}
            </div>

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

            <div className="pt-2">
              <SubmitButton isSubmitting={isSubmitting}>
                {modalConfig.mode === "CREATE"
                  ? "Create Designation"
                  : "Save Changes"}
              </SubmitButton>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default DesignationModal;
