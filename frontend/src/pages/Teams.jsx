import { useState, useEffect, useCallback } from "react";
import { Plus, X, Edit2, Trash2, Eye } from "lucide-react";
import {
  createTeam,
  getAllTeams,
  updateTeam,
  deleteTeam,
} from "../api/teamApi";
import { getAllActiveDepartments } from "../api/departmentApi";
import {
  getAllUsers,
  getAllActiveManagers,
  getAllActiveTeamLeaders,
} from "../api/authApi";
import { showSuccess, showError } from "../toastMessage/toastDeliver";
import {
  validateTeamField,
  validateTeamForm,
} from "../validators/teamValidators";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import MultiSelectField from "../components/MultiSelectField";
import SubmitButton from "../components/SubmitButton";

function Teams() {
  const [teams, setTeams] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    mode: "CREATE",
    teamId: null,
  });
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    teamName: "",
    teamDescription: "",
    department: "",
    manager: "",
    teamLead: "",
    status: "ACTIVE",
    members: [],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [teamsRes, deptRes, usersRes, managersRes, teamLeadersRes] =
        await Promise.all([
          getAllTeams().catch(() => ({ data: [] })),
          getAllActiveDepartments().catch(() => ({ data: [] })),
          getAllUsers().catch(() => ({ data: [] })),
          getAllActiveManagers().catch(() => ({ data: [] })),
          getAllActiveTeamLeaders().catch(() => ({ data: [] })),
        ]);
      setTeams(teamsRes.data || []);
      setDepartments(deptRes.data || []);
      setUsers(usersRes.data || []);
      setManagers(managersRes.data || []);
      setTeamLeaders(teamLeadersRes.data || []);
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

    const error = validateTeamField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const openCreateModal = () => {
    setModalConfig({ isOpen: true, mode: "CREATE", teamId: null });
    setFormData({
      teamName: "",
      teamDescription: "",
      department: "",
      manager: "",
      teamLead: "",
      status: "ACTIVE",
      members: [],
    });
    setErrors({});
  };

  const openViewModal = (team) => {
    setModalConfig({ isOpen: true, mode: "VIEW", teamId: team._id });
    setSelectedItem(team);
    setErrors({});
  };

  const openUpdateModal = (team) => {
    setModalConfig({ isOpen: true, mode: "UPDATE", teamId: team._id });
    setFormData({
      teamName: team.teamName,
      teamDescription: team.teamDescription || "",
      department: team.department?._id || team.department,
      manager: team.manager?._id || team.manager,
      teamLead: team.teamLead?._id || team.teamLead || "",
      status: team.status,
      members: team.members?.map((m) => m._id || m) || [],
    });
    setErrors({});
  };

  const handleDelete = async (id) => {
    try {
      await deleteTeam(id);
      showSuccess("Team deleted successfully");
      setDeleteConfirmId(null);
      setTeams((prev) => prev.filter((team) => team._id !== id));
    } catch (error) {
      showError(error.message || "Failed to delete team");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValid, errors: formErrors } = validateTeamForm(formData);

    if (!isValid) {
      setErrors(formErrors);
      showError("Please fix the form errors");
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = { ...formData };
      if (!submitData.teamLead) delete submitData.teamLead; // Optional field

      if (modalConfig.mode === "CREATE") {
        await createTeam(submitData);
        showSuccess("Team created successfully");
      } else {
        await updateTeam(modalConfig.teamId, submitData);
        showSuccess("Team updated successfully");
      }
      setModalConfig({ isOpen: false, mode: "CREATE", teamId: null });
      fetchData(); // refresh list
    } catch (error) {
      showError(
        error.message || `Failed to ${modalConfig.mode.toLowerCase()} team`
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
            Teams
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Manage company teams and assignments.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-ems-primary hover:bg-blue-700 text-white rounded-xl font-medium transition-colors cursor-pointer shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Team
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-ems-primary rounded-full animate-spin"></div>
        </div>
      ) : teams.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center shadow-sm">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">
            No Teams Found
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            Get started by creating your first team.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div
              key={team._id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {team.teamName}
                </h3>
                <span
                  className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                    team.status === "ACTIVE"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {team.status}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 min-h-[40px]">
                {team.teamDescription || "No description provided."}
              </p>

              <div className="mb-4 text-sm text-slate-500 dark:text-slate-400 space-y-1">
                <div>
                  Dept:{" "}
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {team.department?.departmentName || "Unknown"}
                  </span>
                </div>
                <div>
                  Manager:{" "}
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {team.manager?.name || "Unknown"}
                  </span>
                </div>
                {team.teamLead && (
                  <div>
                    Lead:{" "}
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {team.teamLead?.name || "Unknown"}
                    </span>
                  </div>
                )}
                <div>
                  Members:{" "}
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {team.members?.length || 0}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end text-sm text-slate-500 dark:text-slate-400 mt-2 border-t border-slate-100 dark:border-slate-700 pt-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openViewModal(team)}
                    className="p-1.5 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/30 dark:hover:text-green-400 rounded-lg transition-colors cursor-pointer"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openUpdateModal(team)}
                    className="p-1.5 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 rounded-lg transition-colors cursor-pointer"
                    title="Edit Team"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(team._id)}
                    className="p-1.5 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                    title="Delete Team"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Update Modal */}
      {modalConfig.isOpen && (
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
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                      Team Name
                    </label>
                    <p className="text-slate-900 dark:text-white font-medium">
                      {selectedItem.teamName}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                      Description
                    </label>
                    <p className="text-slate-900 dark:text-white">
                      {selectedItem.teamDescription ||
                        "No description provided."}
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
                      className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
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
                      {selectedItem.manager?.name || "Unknown"}
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
                    Description{" "}
                    <span className="text-slate-400">(Optional)</span>
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
                    options={managers.map((user) => ({
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
                    label="Team Lead (Optional)"
                    name="teamLead"
                    value={formData.teamLead}
                    onChange={handleInputChange}
                    error={errors.teamLead}
                    disabled={isSubmitting}
                    placeholder="Select a team lead"
                    options={teamLeaders.map((user) => ({
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
                  options={users.map((user) => ({
                    label: `${user.name} (${user.employeeId}) - ${user.designation?.designationName || "N/A"} | ${user.department?.departmentName || "N/A"}`,
                    chipLabel: user.name,
                    value: user._id,
                  }))}
                />

                <div className="pt-4">
                  <SubmitButton isSubmitting={isSubmitting}>
                    {modalConfig.mode === "CREATE"
                      ? "Create Team"
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
                Delete Team
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
                Are you sure you want to delete this team? This action cannot be
                undone.
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

export default Teams;
