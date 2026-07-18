import { useState, useEffect, useCallback } from "react";
import { Plus, X, Eye, Pencil } from "lucide-react";
import {
  getAllUsers,
  createUserAccount,
  updateUserDetails,
} from "../api/authApi";
import { getAllTeams } from "../api/teamApi";
import { getAllActiveDepartments } from "../api/departmentApi";
import { getAllActiveDesignations } from "../api/designationApi";
import { showSuccess, showError } from "../toastMessage/toastDeliver";
import {
  validateUserManagementField,
  validateUserManagementForm,
} from "../validators/userManagementValidators";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import SubmitButton from "../components/SubmitButton";

function Users() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    mode: "CREATE",
  });
  const [selectedItem, setSelectedItem] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Employee",
    status: "ACTIVE",
    phoneNumber: "",
    teamName: "",
    department: "",
    designation: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [usersRes, teamsRes, deptRes, desigRes] = await Promise.all([
        getAllUsers().catch(() => ({ data: [] })),
        getAllTeams().catch(() => ({ data: [] })),
        getAllActiveDepartments().catch(() => ({ data: [] })),
        getAllActiveDesignations().catch(() => ({ data: [] })),
      ]);
      setUsers(usersRes.data || []);
      setTeams(teamsRes.data || []);
      setDepartments(deptRes.data || []);
      setDesignations(desigRes.data || []);
    } catch (error) {
      showError(error.message || "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const error = validateUserManagementField(name, value, {
      ...formData,
      [name]: value,
    });
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const openCreateModal = () => {
    setModalConfig({ isOpen: true, mode: "CREATE" });
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "Employee",
      phoneNumber: "",
      teamName: "",
      department: "",
      designation: "",
    });
    setErrors({});
  };

  const openViewModal = (user) => {
    setModalConfig({ isOpen: true, mode: "VIEW" });
    setSelectedItem(user);
    setErrors({});
  };

  const openEditModal = (user) => {
    setModalConfig({ isOpen: true, mode: "EDIT" });
    setSelectedItem(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: "",
      confirmPassword: "",
      role: user.role || "Employee",
      status: user.status || "ACTIVE",
      phoneNumber: user.phoneNumber || "",
      teamName:
        typeof user.teamName === "object"
          ? user.teamName?._id || ""
          : user.teamName || "",
      department:
        typeof user.department === "object"
          ? user.department?._id || ""
          : user.department || "",
      designation:
        typeof user.designation === "object"
          ? user.designation?._id || ""
          : user.designation || "",
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (modalConfig.mode === "CREATE") {
      const { isValid, errors: formErrors } =
        validateUserManagementForm(formData);
      if (!isValid) {
        setErrors(formErrors);
        showError("Please fix the form errors");
        return;
      }
      setIsSubmitting(true);
      try {
        await createUserAccount(formData);
        showSuccess("Account created successfully");
        setModalConfig({ isOpen: false, mode: "CREATE" });
        fetchData(); // refresh list
      } catch (error) {
        showError(error.message || "Failed to create account");
      } finally {
        setIsSubmitting(false);
      }
    } else if (modalConfig.mode === "EDIT") {
      const originalRole = selectedItem.role || "Employee";
      const originalStatus = selectedItem.status || "ACTIVE";
      const originalTeamName =
        typeof selectedItem.teamName === "object"
          ? selectedItem.teamName?._id || ""
          : selectedItem.teamName || "";
      const originalDepartment =
        typeof selectedItem.department === "object"
          ? selectedItem.department?._id || ""
          : selectedItem.department || "";
      const originalDesignation =
        typeof selectedItem.designation === "object"
          ? selectedItem.designation?._id || ""
          : selectedItem.designation || "";

      if (
        formData.role === originalRole &&
        formData.status === originalStatus &&
        formData.teamName === originalTeamName &&
        formData.department === originalDepartment &&
        formData.designation === originalDesignation
      ) {
        showSuccess("No changes were made");
        setModalConfig({ ...modalConfig, isOpen: false });
        return;
      }

      setIsSubmitting(true);
      try {
        const payload = {
          role: formData.role,
          status: formData.status,
          teamName: formData.teamName,
          designation: formData.designation,
          department: formData.department,
        };
        await updateUserDetails(selectedItem._id, payload);
        showSuccess("Account updated successfully");
        setModalConfig({ ...modalConfig, isOpen: false });
        fetchData();
      } catch (error) {
        showError(error.message || "Failed to update account");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Users
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Manage company users and create accounts.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-ems-primary hover:bg-blue-700 text-white rounded-xl font-medium transition-colors cursor-pointer shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add User
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-ems-primary rounded-full animate-spin"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center shadow-sm">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">
            No Users Found
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            Get started by creating your first user account.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {user.name}
                </h3>
                <span
                  className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                    user.status === "ACTIVE"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {user.status || "ACTIVE"}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 truncate">
                {user.email}
              </p>
              <div className="mb-4 text-sm text-slate-500 dark:text-slate-400 space-y-1">
                <div>
                  Role:{" "}
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {user.role}
                  </span>
                </div>
                <div>
                  Department:{" "}
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {user.department?.departmentName || "Unknown"}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mt-2 border-t border-slate-100 dark:border-slate-700 pt-3">
                <span className="font-mono bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded">
                  {user.employeeId || "No ID"}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openViewModal(user)}
                    className="p-1.5 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/30 dark:hover:text-green-400 rounded-lg transition-colors cursor-pointer"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {user.role !== "Management" && (
                    <button
                      onClick={() => openEditModal(user)}
                      className="p-1.5 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/30 dark:hover:text-green-400 rounded-lg transition-colors cursor-pointer"
                      title="Edit User"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create User Modal */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto pt-24 pb-10">
          <div
            className={`bg-white dark:bg-slate-800 w-full rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto ${modalConfig.mode !== "CREATE" ? "max-w-4xl" : "max-w-lg"}`}
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
                onClick={() =>
                  setModalConfig({ ...modalConfig, isOpen: false })
                }
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
                                  : selectedItem.isAvailable ===
                                      "Appear offline"
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
                            {selectedItem.department?.departmentName ||
                              "Unknown"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                            Designation
                          </label>
                          <p className="text-slate-800 dark:text-slate-200">
                            {selectedItem.designation?.designationName ||
                              "Unknown"}
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
                  <SubmitButton
                    isSubmitting={isSubmitting}
                    text="Create Account"
                  />
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
