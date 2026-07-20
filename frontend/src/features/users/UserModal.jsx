import { X } from "lucide-react";
import InputField from "../../components/InputField";
import SelectField from "../../components/SelectField";
import SubmitButton from "../../components/SubmitButton";

function UserModal({
  modalConfig,
  setModalConfig,
  selectedItem,
  formData,
  errors,
  isSubmitting,
  departments,
  designations,
  teams,
  handleSubmit,
  handleInputChange,
}) {
  if (!modalConfig.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto pt-24 pb-10">
      <div
        className={`bg-white dark:bg-slate-800 w-full rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto ${modalConfig.mode !== "CREATE" ? "max-w-4xl" : "max-w-2xl"}`}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {modalConfig.mode === "CREATE"
              ? "Create Account"
              : modalConfig.mode === "EDIT"
                ? "Edit User Account"
                : "User Details"}
          </h2>
          <button
            onClick={() => setModalConfig({ ...modalConfig, isOpen: false })}
            className="p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {modalConfig.mode !== "CREATE" && selectedItem ? (
          <form
            onSubmit={handleSubmit}
            className="p-0 overflow-y-auto max-h-[80vh] custom-scrollbar"
          >
            {/* Header Profile Section */}
            <div className="relative p-8 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 border-b border-slate-200 dark:border-slate-700 overflow-hidden">
              {/* Premium Background Elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-blue-50/50 dark:from-slate-800/80 dark:to-slate-900/80 z-0"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

              {/* Profile Image */}
              <div className="relative z-10 shrink-0">
                <div className="relative p-1 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg">
                  {selectedItem.profilePicUrl ? (
                    <img
                      src={selectedItem.profilePicUrl}
                      alt={selectedItem.name}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white dark:border-slate-900"
                    />
                  ) : (
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 text-4xl font-bold border-4 border-white dark:border-slate-900">
                      {selectedItem.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {/* Availability Dot */}
                  <div
                    className={`absolute bottom-2 right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-4 border-white dark:border-slate-900 shadow-sm ${
                      selectedItem.isAvailable === "Available"
                        ? "bg-emerald-500"
                        : selectedItem.isAvailable === "Busy"
                          ? "bg-red-500"
                          : selectedItem.isAvailable === "Do not distrub"
                            ? "bg-rose-600"
                            : selectedItem.isAvailable === "Appear offline"
                              ? "bg-slate-500"
                              : selectedItem.isAvailable === "Break Taken"
                                ? "bg-amber-500"
                                : selectedItem.isAvailable === "Meeting"
                                  ? "bg-orange-500"
                                  : "bg-emerald-500"
                    }`}
                    title={selectedItem.isAvailable || "Available"}
                  ></div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="relative z-10 flex flex-col justify-center text-center sm:text-left w-full pt-1 sm:pt-2">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
                  {selectedItem.name}
                </h3>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 mb-4">
                  {/* Employee ID Badge */}
                  <div className="flex items-center text-slate-500 dark:text-slate-400 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm px-3 py-1 rounded-lg border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                    <svg
                      className="w-4 h-4 mr-1.5 opacity-70"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                      />
                    </svg>
                    <span className="font-mono text-sm font-semibold tracking-wide">
                      ID: {selectedItem.employeeId || "N/A"}
                    </span>
                  </div>
                </div>

                {/* Status & Role Badges */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border shadow-sm ${
                      (modalConfig.mode === "EDIT"
                        ? formData.status
                        : selectedItem.status) === "ACTIVE"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                        : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-2 ${(modalConfig.mode === "EDIT" ? formData.status : selectedItem.status) === "ACTIVE" ? "bg-emerald-500" : "bg-rose-500"}`}
                    ></span>
                    {modalConfig.mode === "EDIT"
                      ? formData.status
                      : selectedItem.status || "ACTIVE"}
                  </span>

                  <span className="inline-flex items-center px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                    <svg
                      className="w-3.5 h-3.5 mr-1.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    {modalConfig.mode === "EDIT"
                      ? formData.role
                      : selectedItem.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Info */}
              <div
                className={`space-y-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm ${modalConfig.mode === "EDIT" ? "md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4 space-y-0" : ""}`}
              >
                {modalConfig.mode !== "EDIT" && (
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                    Contact Information
                  </h4>
                )}
                <div
                  className={
                    modalConfig.mode === "EDIT"
                      ? "break-words overflow-hidden"
                      : ""
                  }
                >
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                    Email
                  </label>
                  <p
                    className="text-slate-800 dark:text-slate-200 truncate"
                    title={selectedItem.email}
                  >
                    {selectedItem.email}
                  </p>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                    Phone Number
                  </label>
                  <p className="text-slate-800 dark:text-slate-200">
                    {selectedItem.phoneNumber || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                    Availability
                  </label>
                  <p className="text-slate-800 dark:text-slate-200 flex items-center mt-1">
                    <span
                      className={`w-2 h-2 rounded-full mr-2 ${
                        selectedItem.isAvailable === "Available"
                          ? "bg-green-500"
                          : selectedItem.isAvailable === "Busy"
                            ? "bg-red-500"
                            : selectedItem.isAvailable === "Do not distrub"
                              ? "bg-rose-600"
                              : selectedItem.isAvailable === "Appear offline"
                                ? "bg-slate-500"
                                : selectedItem.isAvailable === "Break Taken"
                                  ? "bg-amber-500"
                                  : selectedItem.isAvailable === "Meeting"
                                    ? "bg-orange-500"
                                    : "bg-green-500"
                      }`}
                    ></span>
                    {selectedItem.isAvailable || "Available"}
                  </p>
                </div>
              </div>

              {/* Organization Info */}
              <div
                className={`space-y-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm ${modalConfig.mode === "EDIT" ? "md:col-span-2" : ""}`}
              >
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Organization</span>
                  {modalConfig.mode === "EDIT" && (
                    <span className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold">
                      EDITING
                    </span>
                  )}
                </h4>

                {modalConfig.mode === "EDIT" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
                    <SelectField
                      label="Role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      error={errors.role}
                      disabled={isSubmitting}
                      options={[
                        { value: "Employee", label: "Employee" },
                        { value: "Manager", label: "Manager" },
                        { value: "Team Leader", label: "Team Leader" },
                      ]}
                    />
                    <SelectField
                      label="Status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      error={errors.status}
                      disabled={isSubmitting}
                      options={[
                        { value: "ACTIVE", label: "ACTIVE" },
                        { value: "INACTIVE", label: "INACTIVE" },
                        { value: "SUSPENDED", label: "SUSPENDED" },
                      ]}
                    />
                    <SelectField
                      label="Department"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      error={errors.department}
                      disabled={isSubmitting}
                      options={departments.map((d) => ({
                        value: d._id,
                        label: d.departmentName,
                      }))}
                    />
                    <SelectField
                      label="Designation"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      error={errors.designation}
                      disabled={isSubmitting}
                      options={designations.map((d) => ({
                        value: d._id,
                        label: d.designationName,
                      }))}
                    />
                    <SelectField
                      label="Team (Optional)"
                      name="teamName"
                      value={formData.teamName}
                      onChange={handleInputChange}
                      error={errors.teamName}
                      disabled={isSubmitting}
                      options={[
                        { value: "", label: "Select Team" },
                        ...teams.map((t) => ({
                          value: t._id,
                          label: t.teamName,
                        })),
                      ]}
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                        Department
                      </label>
                      <p className="text-slate-800 dark:text-slate-200">
                        {selectedItem.department?.departmentName || "Unknown"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                        Designation
                      </label>
                      <p className="text-slate-800 dark:text-slate-200">
                        {selectedItem.designation?.designationName || "Unknown"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                        Team Name
                      </label>
                      <p className="text-slate-800 dark:text-slate-200">
                        {typeof selectedItem.teamName === "object"
                          ? selectedItem.teamName?.teamName
                          : selectedItem.teamName || "N/A"}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* System Info */}
              <div className="col-span-1 md:col-span-2 bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
                    Created By
                  </label>
                  <p className="text-slate-800 dark:text-slate-200 flex items-center font-medium">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs mr-2">
                      {selectedItem.createdAccount?.name
                        ? selectedItem.createdAccount.name
                            .charAt(0)
                            .toUpperCase()
                        : "?"}
                    </span>
                    {selectedItem.createdAccount?.name || "System"}
                  </p>
                </div>
                <div className="md:text-right">
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
                    Created At
                  </label>
                  <p className="text-slate-800 dark:text-slate-200 font-mono text-sm bg-white dark:bg-slate-800 px-2 py-1 rounded shadow-sm border border-slate-100 dark:border-slate-700">
                    {selectedItem.createdAt
                      ? new Date(selectedItem.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )
                      : "N/A"}
                  </p>
                </div>
              </div>

              {modalConfig.mode === "EDIT" && (
                <div className="col-span-1 md:col-span-2 pt-4">
                  <SubmitButton isSubmitting={isSubmitting}>
                    Save Changes
                  </SubmitButton>
                </div>
              )}
            </div>
          </form>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="p-5 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InputField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={errors.name}
                disabled={isSubmitting}
                placeholder="e.g. John Doe"
              />
              <InputField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                disabled={isSubmitting}
                placeholder="john@example.com"
              />
              <InputField
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                error={errors.phoneNumber}
                disabled={isSubmitting}
                placeholder="e.g. +1234567890"
              />

              <SelectField
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                error={errors.role}
                disabled={isSubmitting}
                options={[
                  { value: "Employee", label: "Employee" },
                  { value: "Manager", label: "Manager" },
                  { value: "Team Leader", label: "Team Leader" },
                ]}
              />

              <InputField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
                disabled={isSubmitting}
                placeholder="Create a password"
              />
              <InputField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={errors.confirmPassword}
                disabled={isSubmitting}
                placeholder="Confirm password"
              />

              <SelectField
                label="Department (Optional)"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                error={errors.department}
                disabled={isSubmitting}
                options={departments.map((d) => ({
                  value: d._id,
                  label: d.departmentName,
                }))}
              />

              <SelectField
                label="Designation (Optional)"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                error={errors.designation}
                disabled={isSubmitting}
                placeholder="Select a designation"
                options={designations.map((desig) => ({
                  label: desig.designationName,
                  value: desig._id,
                }))}
              />
              <div className="sm:col-span-2">
                <SelectField
                  label="Team (Optional)"
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleInputChange}
                  error={errors.teamName}
                  disabled={isSubmitting}
                  placeholder="Select a team"
                  options={[
                    { value: "", label: "Select Team" },
                    ...teams.map((t) => ({
                      value: t._id,
                      label: t.teamName,
                    })),
                  ]}
                />
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <SubmitButton isSubmitting={isSubmitting}>
                Create Account
              </SubmitButton>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default UserModal;
