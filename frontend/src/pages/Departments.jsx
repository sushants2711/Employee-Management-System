import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  createDepartment,
  getAllDepartments,
  updateDepartment,
  deleteDepartment,
} from "../api/departmentApi";
import { showSuccess, showError } from "../toastMessage/toastDeliver";
import {
  validateDepartmentField,
  validateDepartmentForm,
} from "../validators/departmentValidators";
import { useAuth } from "../context/AuthContext";
import DepartmentCard from "../features/departments/DepartmentCard";
import DepartmentModal from "../features/departments/DepartmentModal";

function Departments() {
  const { user } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    mode: "CREATE",
    deptId: null,
  });
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    departmentName: "",
    departmentCode: "",
    description: "",
    status: "ACTIVE",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDepartments = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getAllDepartments();
      setDepartments(response.data || []);
    } catch (error) {
      showError(error.message || "Failed to fetch departments");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDepartments();
  }, [fetchDepartments]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const error = validateDepartmentField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const openCreateModal = () => {
    setModalConfig({ isOpen: true, mode: "CREATE", deptId: null });
    setFormData({
      departmentName: "",
      departmentCode: "",
      description: "",
      status: "ACTIVE",
    });
    setErrors({});
  };

  const openViewModal = (dept) => {
    setModalConfig({ isOpen: true, mode: "VIEW", deptId: dept._id });
    setSelectedItem(dept);
    setErrors({});
  };

  const openUpdateModal = (dept) => {
    setModalConfig({ isOpen: true, mode: "UPDATE", deptId: dept._id });
    setFormData({
      departmentName: dept.departmentName,
      departmentCode: dept.departmentCode,
      description: dept.description || "",
      status: dept.status,
    });
    setErrors({});
  };

  const handleDelete = async (id) => {
    try {
      await deleteDepartment(id);
      showSuccess("Department deleted successfully");
      setDeleteConfirmId(null);

      // Instantly remove the deleted department from local state
      // without needing to wait for a network refresh
      setDepartments((prev) => prev.filter((dept) => dept._id !== id));
    } catch (error) {
      showError(error.message || "Failed to delete department");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValid, errors: formErrors } = validateDepartmentForm(formData);

    if (!isValid) {
      setErrors(formErrors);
      showError("Please fix the form errors");
      return;
    }

    setIsSubmitting(true);
    try {
      if (modalConfig.mode === "CREATE") {
        const createData = {
          departmentName: formData.departmentName,
          departmentCode: formData.departmentCode,
          description: formData.description,
        };
        await createDepartment(createData);
        showSuccess("Department created successfully");
      } else {
        await updateDepartment(modalConfig.deptId, formData);
        showSuccess("Department updated successfully");
      }
      setModalConfig({ isOpen: false, mode: "CREATE", deptId: null });
      fetchDepartments(); // refresh list
    } catch (error) {
      showError(
        error.message ||
          `Failed to ${modalConfig.mode.toLowerCase()} department`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Departments
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Manage company departments and their details.
          </p>
        </div>
        {user?.role === "Management" && (
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-ems-primary hover:bg-blue-700 text-white rounded-xl font-medium transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Add Department
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-ems-primary rounded-full animate-spin"></div>
        </div>
      ) : departments.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center shadow-sm">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">
            No Departments Found
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            Get started by creating your first department.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <DepartmentCard
              key={dept._id}
              dept={dept}
              user={user}
              openViewModal={openViewModal}
              openUpdateModal={openUpdateModal}
              setDeleteConfirmId={setDeleteConfirmId}
            />
          ))}
        </div>
      )}

      {/* Modal extracted to separate component */}
      <DepartmentModal
        modalConfig={modalConfig}
        setModalConfig={setModalConfig}
        selectedItem={selectedItem}
        formData={formData}
        errors={errors}
        isSubmitting={isSubmitting}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Delete Department
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
                Are you sure you want to delete this department? This action
                cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors cursor-pointer shadow-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Departments;
