import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  createDesignation,
  getAllDesignations,
  updateDesignation,
  deleteDesignation,
} from "../api/designationApi";
import { getAllActiveDepartments } from "../api/departmentApi";
import { showSuccess, showError } from "../toastMessage/toastDeliver";
import {
  validateDesignationField,
  validateDesignationForm,
} from "../validators/designationValidators";
import { useAuth } from "../context/AuthContext";
import DesignationCard from "../features/designations/DesignationCard";
import DesignationModal from "../features/designations/DesignationModal";

function Designations() {
  const { user } = useAuth();
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

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

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
        getAllActiveDepartments(),
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
        {user?.role === "Management" && (
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-ems-primary hover:bg-blue-700 text-white rounded-xl font-medium transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Add Designation
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search designations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-700 dark:text-slate-300 transition-shadow shadow-sm"
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
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-48 pl-3 pr-10 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none text-sm text-slate-700 dark:text-slate-300 transition-shadow shadow-sm cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-ems-primary rounded-full animate-spin"></div>
        </div>
      ) : (
        (() => {
          const filteredDesignations = designations.filter((desig) => {
            const matchesSearch =
              (desig.designationName || "")
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              (desig.designationCode || "")
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter
              ? desig.status === statusFilter
              : true;
            return matchesSearch && matchesStatus;
          });

          if (filteredDesignations.length === 0) {
            return (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center shadow-sm">
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">
                  No Designations Found
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  {searchQuery || statusFilter
                    ? "No designations match your filters."
                    : "Get started by creating your first designation."}
                </p>
              </div>
            );
          }

          return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDesignations.map((desig) => (
                <DesignationCard
                  key={desig._id}
                  desig={desig}
                  user={user}
                  openViewModal={openViewModal}
                  openUpdateModal={openUpdateModal}
                  setDeleteConfirmId={setDeleteConfirmId}
                />
              ))}
            </div>
          );
        })()
      )}

      {/* Modal extracted to separate component */}
      <DesignationModal
        modalConfig={modalConfig}
        setModalConfig={setModalConfig}
        selectedItem={selectedItem}
        formData={formData}
        errors={errors}
        isSubmitting={isSubmitting}
        departments={departments}
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
