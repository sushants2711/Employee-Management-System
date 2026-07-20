import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import {
  getAllUsers,
  createUserAccount,
  updateUserDetails,
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
        {authUser?.role === "Management" && (
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-ems-primary hover:bg-blue-700 text-white rounded-xl font-medium transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Add User
          </button>
        )}
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

      {/* Modal extracted to separate component */}
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
  );
}

export default Users;
