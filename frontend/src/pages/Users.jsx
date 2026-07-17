import { useState, useEffect, useCallback } from "react";
import { Plus, X, Eye } from "lucide-react";
import { getAllUsers, createUserAccount } from "../api/authApi";
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValid, errors: formErrors } =
      validateUserManagementForm(formData);

    if (!isValid) {
      setErrors(formErrors);
      showError("Please fix the form errors");
      return;
    }

    setIsSubmitting(true);
    try {
      if (modalConfig.mode === "CREATE") {
        await createUserAccount(formData);
        showSuccess("Account created successfully");
        setModalConfig({ isOpen: false, mode: "CREATE" });
        fetchData(); // refresh list
      }
    } catch (error) {
      showError(error.message || "Failed to create account");
    } finally {
      setIsSubmitting(false);
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
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create User Modal */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto pt-24 pb-10">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {modalConfig.mode === "CREATE"
                  ? "Create Account"
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

            {modalConfig.mode === "VIEW" && selectedItem ? (
              <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                      Name
                    </label>
                    <p className="text-slate-900 dark:text-white font-medium">
                      {selectedItem.name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                      Employee ID
                    </label>
                    <p className="font-mono text-slate-900 dark:text-white">
                      {selectedItem.employeeId || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                      Email
                    </label>
                    <p className="text-slate-900 dark:text-white truncate">
                      {selectedItem.email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                      Phone Number
                    </label>
                    <p className="text-slate-900 dark:text-white">
                      {selectedItem.phoneNumber}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                      Role
                    </label>
                    <p className="text-slate-900 dark:text-white font-medium">
                      {selectedItem.role}
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
                      {selectedItem.status || "ACTIVE"}
                    </span>
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
                      Designation
                    </label>
                    <p className="text-slate-900 dark:text-white">
                      {selectedItem.designation?.designationName || "Unknown"}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                      Team Name
                    </label>
                    <p className="text-slate-900 dark:text-white">
                      {typeof selectedItem.teamName === "object"
                        ? selectedItem.teamName?.teamName
                        : selectedItem.teamName}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="p-5 space-y-6 max-h-[70vh] overflow-y-auto"
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
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    error={errors.password}
                    disabled={isSubmitting}
                    placeholder="••••••••"
                  />
                  <InputField
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    error={errors.confirmPassword}
                    disabled={isSubmitting}
                    placeholder="••••••••"
                  />
                  <InputField
                    label="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    error={errors.phoneNumber}
                    disabled={isSubmitting}
                    placeholder="1234567890"
                  />
                  <SelectField
                    label="Role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    error={errors.role}
                    disabled={isSubmitting}
                    options={[
                      { label: "Employee", value: "Employee" },
                      { label: "Manager", value: "Manager" },
                      { label: "Team Leader", value: "Team Leader" },
                    ]}
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
                      label="Team"
                      name="teamName"
                      value={formData.teamName}
                      onChange={handleInputChange}
                      error={errors.teamName}
                      disabled={isSubmitting}
                      placeholder="Select a team"
                      options={teams.map((team) => ({
                        label: team.teamName,
                        value: team._id,
                      }))}
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <SubmitButton isSubmitting={isSubmitting}>
                    Create Account
                  </SubmitButton>
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
