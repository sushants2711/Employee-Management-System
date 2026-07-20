import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  createTeam,
  getAllTeams,
  updateTeam,
  deleteTeam,
} from "../api/teamApi";
import { getAllActiveDepartments } from "../api/departmentApi";
import {
  getAllEmployees,
  getAllActiveManagers,
  getAllActiveTeamLeaders,
} from "../api/authApi";
import { showSuccess, showError } from "../toastMessage/toastDeliver";
import {
  validateTeamField,
  validateTeamForm,
} from "../validators/teamValidators";
import { useAuth } from "../context/AuthContext";
import TeamCard from "../features/teams/TeamCard";
import TeamModal from "../features/teams/TeamModal";

function Teams() {
  const { user } = useAuth();
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

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

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
          getAllEmployees().catch(() => ({ data: [] })),
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

  const assignedUserIds = useMemo(() => {
    const ids = new Set();
    teams.forEach((team) => {
      // If we are updating, skip the current team so its members can still be selected
      if (modalConfig.mode === "UPDATE" && team._id === modalConfig.teamId) {
        return;
      }
      if (team.status === "ACTIVE") {
        if (team.teamLead) ids.add(team.teamLead._id || team.teamLead);
        if (team.manager) ids.add(team.manager._id || team.manager);
        if (team.members && Array.isArray(team.members)) {
          team.members.forEach((m) => ids.add(m._id || m));
        }
      }
    });
    return ids;
  }, [teams, modalConfig]);

  const availableUsers = useMemo(
    () => users.filter((u) => !assignedUserIds.has(u._id)),
    [users, assignedUserIds]
  );
  const availableManagers = useMemo(
    () => managers.filter((m) => !assignedUserIds.has(m._id)),
    [managers, assignedUserIds]
  );
  const availableTeamLeaders = useMemo(
    () => teamLeaders.filter((t) => !assignedUserIds.has(t._id)),
    [teamLeaders, assignedUserIds]
  );

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

      if (modalConfig.mode === "CREATE") {
        delete submitData.status;
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
        {user?.role === "Management" && (
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-ems-primary hover:bg-blue-700 text-white rounded-xl font-medium transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Add Team
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search teams..."
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
          const filteredTeams = teams.filter((team) => {
            const matchesSearch = (team.teamName || "")
              .toLowerCase()
              .includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter
              ? team.status === statusFilter
              : true;
            return matchesSearch && matchesStatus;
          });

          if (filteredTeams.length === 0) {
            return (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center shadow-sm">
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">
                  No Teams Found
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  {searchQuery || statusFilter
                    ? "No teams match your filters."
                    : "Get started by creating your first team."}
                </p>
              </div>
            );
          }

          return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeams.map((team) => (
                <TeamCard
                  key={team._id}
                  team={team}
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

      {/* Create/Update Modal */}
      <TeamModal
        modalConfig={modalConfig}
        setModalConfig={setModalConfig}
        selectedItem={selectedItem}
        formData={formData}
        errors={errors}
        isSubmitting={isSubmitting}
        departments={departments}
        availableManagers={availableManagers}
        availableTeamLeaders={availableTeamLeaders}
        availableUsers={availableUsers}
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
