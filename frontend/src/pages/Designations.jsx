import { useState, useEffect, useCallback } from "react";
import { Plus, X, Edit2, Trash2, Eye } from "lucide-react";
import {
  createDesignation,
  getAllDesignations,
  updateDesignation,
  deleteDesignation,
} from "../api/designationApi";
import { getAllDepartments } from "../api/departmentApi";
import { showSuccess, showError } from "../toastMessage/toastDeliver";
import {
  validateDesignationField,
  validateDesignationForm,
} from "../validators/designationValidators";
import InputField from "../components/InputField";
import SubmitButton from "../components/SubmitButton";

function Designations() {
  const [designations, setDesignations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    mode: "CREATE",
    desigId: null,
  });
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    designationName: "",
    designationCode: "",
    description: "",
    department: "",
    status: "ACTIVE",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDesignationsAndDepartments = useCallback(async () => {
    try {
      setIsLoading(true);
      const [desigRes, deptRes] = await Promise.all([
        getAllDesignations(),
        getAllDepartments(),
      ]);
      setDesignations(desigRes.data || []);
      setDepartments(deptRes.data || []);
    } catch (error) {
      showError(error.message || "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDesignationsAndDepartments();
  }, [fetchDesignationsAndDepartments]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const error = validateDesignationField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const openCreateModal = () => {
    setModalConfig({ isOpen: true, mode: "CREATE", desigId: null });
    setFormData({
      designationName: "",
      designationCode: "",
      description: "",
      department: "",
      status: "ACTIVE",
    });
    setErrors({});
  };

  const openViewModal = (desig) => {
    setModalConfig({ isOpen: true, mode: "VIEW", desigId: desig._id });
    setSelectedItem(desig);
    setErrors({});
  };

  const openUpdateModal = (desig) => {
    setModalConfig({ isOpen: true, mode: "UPDATE", desigId: desig._id });
    setFormData({
      designationName: desig.designationName,
      designationCode: desig.designationCode,
      description: desig.description || "",
      department: desig.department?._id || "",
      status: desig.status || "ACTIVE",
    });
    setErrors({});
  };

  const handleDelete = async (id) => {
    try {
      await deleteDesignation(id);
      showSuccess("Designation deleted successfully");
      setDeleteConfirmId(null);
      setDesignations((prev) => prev.filter((desig) => desig._id !== id));
    } catch (error) {
      showError(error.message || "Failed to delete designation");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValid, errors: formErrors } = validateDesignationForm(formData);

    if (!isValid) {
      setErrors(formErrors);
      showError("Please fix the form errors");
      return;
    }

    setIsSubmitting(true);
    try {
      if (modalConfig.mode === "CREATE") {
        const createData = {
          designationName: formData.designationName,
          designationCode: formData.designationCode,
          description: formData.description,
          department: formData.department,
        };
        await createDesignation(createData);
        showSuccess("Designation created successfully");
      } else {
        await updateDesignation(modalConfig.desigId, formData);
        showSuccess("Designation updated successfully");
      }
      setModalConfig({ isOpen: false, mode: "CREATE", desigId: null });
      fetchDesignationsAndDepartments(); // refresh list to get populated references
    } catch (error) {
      showError(
        error.message ||
          `Failed to ${modalConfig.mode.toLowerCase()} designation`
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
            Designations
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Manage company designations and their details.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-ems-primary hover:bg-blue-700 text-white rounded-xl font-medium transition-colors cursor-pointer shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Designation
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-ems-primary rounded-full animate-spin"></div>
        </div>
      ) : designations.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center shadow-sm">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">
            No Designations Found
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            Get started by creating your first designation.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {designations.map((desig) => (
            <div
              key={desig._id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {desig.designationName}
                </h3>
                <span
                  className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                    desig.status === "ACTIVE"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {desig.status}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 line-clamp-2 min-h-[40px]">
                {desig.description || "No description provided."}
              </p>
              <div className="mb-4 text-sm text-slate-500 dark:text-slate-400">
                Department:{" "}
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {desig.department?.departmentName || "Unknown"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mt-2">
                <span className="font-mono bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded">
                  {desig.designationCode}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openViewModal(desig)}
                    className="p-1.5 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/30 dark:hover:text-green-400 rounded-lg transition-colors cursor-pointer"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openUpdateModal(desig)}
                    className="p-1.5 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 rounded-lg transition-colors cursor-pointer"
                    title="Edit Designation"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(desig._id)}
                    className="p-1.5 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                    title="Delete Designation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Update Designation Modal */}
      {modalConfig.isOpen && (
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
                onClick={() =>
                  setModalConfig({ ...modalConfig, isOpen: false })
                }
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

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Department
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-2.5 rounded-xl border ${
                      errors.department
                        ? "border-red-300 focus:ring-red-500 dark:border-red-500/50"
                        : "border-slate-300 dark:border-slate-700 focus:ring-ems-primary"
                    } bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                  >
                    <option value="">Select a department</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.departmentName}
                      </option>
                    ))}
                  </select>
                  {errors.department && (
                    <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 font-medium">
                      {errors.department}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Description{" "}
                    <span className="text-slate-400">(Optional)</span>
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
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-ems-primary transition-all"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
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
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Delete Designation
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
                Are you sure you want to delete this designation? This action
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

export default Designations;
