import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Users as UsersIcon,
  Shield,
  Briefcase,
  Star,
  Filter,
} from "lucide-react";
import {
  getAllUsers,
  createUserAccount,
  updateUserDetails,
  getEmployeesByStatus,
  getManagementByStatus,
  getManagersByStatus,
  getTeamLeadersByStatus,
} from "../api/authApi";
import { getAllActiveTeams } from "../api/teamApi";
import { getAllActiveDepartments } from "../api/departmentApi";
import { getAllActiveDesignations } from "../api/designationApi";
import { showSuccess, showError } from "../toastMessage/toastDeliver";
import {
  validateUserManagementField,
  validateUserManagementForm,
} from "../validators/userManagementValidators";
import { useAuth } from "../context/AuthContext";
import UserCard from "../features/users/UserCard";
import UserModal from "../features/users/UserModal";

const ROLE_TABS = [
  { id: "ALL", label: "All Users", icon: UsersIcon },
  { id: "Management", label: "Management", icon: Shield },
  { id: "Manager", label: "Managers", icon: Briefcase },
  { id: "Team Leader", label: "Team Leaders", icon: Star },
  { id: "Employee", label: "Employees", icon: UsersIcon },
];

const STATUS_OPTIONS = [
  { id: "", label: "All" },
  { id: "ACTIVE", label: "Active" },
  { id: "INACTIVE", label: "Inactive" },
  { id: "SUSPENDED", label: "Suspended" },
];

function Users() {
  const { user: authUser } = useAuth();
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

  // Filters State
  const [activeTab, setActiveTab] = useState("ALL");
  const [activeStatus, setActiveStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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
      let usersPromise;
      if (activeTab === "ALL")
        usersPromise = getAllUsers(activeStatus, searchQuery);
      else if (activeTab === "Management")
        usersPromise = getManagementByStatus(activeStatus, searchQuery);
      else if (activeTab === "Manager")
        usersPromise = getManagersByStatus(activeStatus, searchQuery);
      else if (activeTab === "Team Leader")
        usersPromise = getTeamLeadersByStatus(activeStatus, searchQuery);
      else if (activeTab === "Employee")
        usersPromise = getEmployeesByStatus(activeStatus, searchQuery);

      const [usersRes, teamsRes, deptRes, desigRes] = await Promise.all([
        usersPromise.catch(() => ({ data: [] })),
        getAllActiveTeams().catch(() => ({ data: [] })),
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
  }, [activeTab, activeStatus, searchQuery]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
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
      status: "ACTIVE",
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
        // eslint-disable-next-line no-unused-vars
        const { status, ...createPayload } = formData;
        await createUserAccount(createPayload);
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

  const filteredUsers = users;

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full">
      {/* Sidebar Filters */}
      <div className="w-full md:w-64 flex-shrink-0 space-y-6">
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-700/50">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Filter size={18} className="text-blue-500" />
            Filters
          </h2>

          <div className="space-y-6">
            {/* Search Filter */}
            <div>
              <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-700 dark:text-slate-300 transition-shadow"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                Status
              </label>
              <div className="relative">
                <select
                  value={activeStatus}
                  onChange={(e) => setActiveStatus(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none text-sm text-slate-700 dark:text-slate-300 transition-shadow cursor-pointer"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Role Tabs */}
            <div>
              <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                Categories
              </label>
              <div className="space-y-1">
                {ROLE_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <Icon
                        size={18}
                        className={
                          isActive
                            ? "text-white"
                            : "text-slate-400 dark:text-slate-500"
                        }
                      />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-700/50">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Users
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              Manage company users and create accounts.
            </p>
          </div>
          {authUser?.role === "Management" && (
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-300 shadow-md shadow-blue-500/20 hover:shadow-lg hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              Add User
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-700/50 p-16 text-center shadow-sm">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <UsersIcon
                size={32}
                className="text-slate-400 dark:text-slate-500"
              />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              No Users Found
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              {activeStatus || activeTab !== "ALL" || searchQuery
                ? "No users match your current filter criteria. Try adjusting your filters."
                : "Get started by creating your first user account."}
            </p>
            {(activeStatus || activeTab !== "ALL" || searchQuery) && (
              <button
                onClick={() => {
                  setActiveTab("ALL");
                  setActiveStatus("");
                  setSearchQuery("");
                }}
                className="mt-6 text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                authUser={authUser}
                openViewModal={openViewModal}
                openEditModal={openEditModal}
              />
            ))}
          </div>
        )}

        <UserModal
          modalConfig={modalConfig}
          setModalConfig={setModalConfig}
          selectedItem={selectedItem}
          formData={formData}
          errors={errors}
          isSubmitting={isSubmitting}
          departments={departments}
          designations={designations}
          teams={teams}
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
        />
      </div>
    </div>
  );
}

export default Users;
