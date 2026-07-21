import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
  updateTaskStatus,
} from "../api/taskApi";
import { getAllProjects } from "../api/projectApi";
import { getAllTeams } from "../api/teamApi";
import { getAllUsers } from "../api/authApi";
import { showSuccess, showError } from "../toastMessage/toastDeliver";
import { useAuth } from "../context/AuthContext";
import TaskCard from "../features/tasks/TaskCard";
import TaskModal from "../features/tasks/TaskModal";
import {
  validateTaskForm,
  validateTaskField,
} from "../validators/taskValidators";

function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);

  // Dropdown data
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    mode: "CREATE",
    taskId: null,
  });
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    taskName: "",
    description: "",
    project: "",
    team: "",
    assignedTo: "",
    priority: "MEDIUM",
    status: "TODO",
    startDate: "",
    dueDate: "",
    remarks: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getAllTasks(statusFilter, searchQuery);
      setTasks(res.data || []);
    } catch (error) {
      showError(error.message || "Failed to fetch tasks");
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchData]);

  const loadDropdownData = async () => {
    try {
      const [projRes, teamRes, userRes] = await Promise.all([
        getAllProjects(),
        getAllTeams(),
        getAllUsers(),
      ]);
      setProjects(projRes.data?.filter((p) => p.status !== "COMPLETED") || []);
      setTeams(teamRes.data || []);
      setUsers(userRes.data || []);
    } catch (error) {
      showError("Failed to load options for form", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // Auto-select team when project changes
      if (name === "project") {
        const selectedProject = projects.find((p) => p._id === value);
        if (selectedProject) {
          // project.teamName holds the team reference
          const teamId =
            selectedProject.teamName?._id || selectedProject.teamName;
          newData.team = teamId || "";
          newData.assignedTo = ""; // Reset user selection if team changes implicitly
        }
      } else if (name === "team") {
        newData.assignedTo = ""; // Reset user selection if team changes explicitly
      }

      return newData;
    });

    const error = validateTaskField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const availableUsers = useMemo(() => {
    if (!formData.team) return users;

    const selectedTeam = teams.find((t) => t._id === formData.team);
    if (!selectedTeam) return users;

    const memberIds = selectedTeam.members?.map((m) => m._id || m) || [];
    const teamLeadId = selectedTeam.teamLead?._id || selectedTeam.teamLead;
    const managerId = selectedTeam.manager?._id || selectedTeam.manager;

    const allTeamUserIds = new Set(
      [...memberIds, teamLeadId, managerId].filter(Boolean)
    );

    return users.filter((u) => allTeamUserIds.has(u._id));
  }, [formData.team, teams, users]);

  const openCreateModal = async () => {
    await loadDropdownData();
    setModalConfig({ isOpen: true, mode: "CREATE", taskId: null });
    setFormData({
      taskName: "",
      description: "",
      project: "",
      team: "",
      assignedTo: "",
      priority: "MEDIUM",
      status: "TODO",
      startDate: "",
      dueDate: "",
      remarks: "",
    });
    setErrors({});
  };

  const openViewModal = (task) => {
    setModalConfig({ isOpen: true, mode: "VIEW", taskId: task._id });
    setSelectedItem(task);
    setErrors({});
  };

  const openUpdateModal = async (task) => {
    await loadDropdownData();
    setModalConfig({ isOpen: true, mode: "UPDATE", taskId: task._id });
    setSelectedItem(task);
    setFormData({
      taskName: task.taskName,
      description: task.description || "",
      project: task.project?._id || task.project || "",
      team: task.team?._id || task.team || "",
      assignedTo: task.assignedTo?._id || task.assignedTo || "",
      priority: task.priority || "MEDIUM",
      status: task.status || "TODO",
      startDate: task.startDate || "",
      dueDate: task.dueDate || "",
      remarks: task.remarks || "",
    });
    setErrors({});
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      showSuccess("Task deleted successfully");
      setDeleteConfirmId(null);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      showError(error.message || "Failed to delete task");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValid, errors: formErrors } = validateTaskForm({
      ...formData,
      mode: modalConfig.mode,
    });

    if (!isValid) {
      setErrors(formErrors);
      showError("Please fix the form errors");
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = { ...formData };

      if (modalConfig.mode === "CREATE") {
        delete submitData.status; // backend handles default status
        await createTask(submitData);
        showSuccess("Task created successfully");
      } else {
        const isAssignedUser =
          selectedItem?.assignedTo?._id === user?._id ||
          selectedItem?.assignedTo === user?._id;

        if (
          isAssignedUser &&
          user?.role !== "Management" &&
          user?.role !== "Manager"
        ) {
          await updateTaskStatus(modalConfig.taskId, {
            status: submitData.status,
            remarks: submitData.remarks,
          });
          showSuccess("Task updated successfully");
        } else {
          await updateTask(modalConfig.taskId, submitData);
          showSuccess("Task updated successfully");
        }
      }
      setModalConfig({ isOpen: false, mode: "CREATE", taskId: null });
      fetchData();
    } catch (error) {
      showError(
        error.message || `Failed to ${modalConfig.mode.toLowerCase()} task`
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
            Tasks
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Manage and track assignments across projects and teams.
          </p>
        </div>
        {(user?.role === "Management" || user?.role === "Manager") && (
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-ems-primary hover:bg-blue-700 text-white rounded-xl font-medium transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Add Task
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search tasks..."
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
            <option value="">All</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="TESTING">Testing</option>
            <option value="COMPLETED">Completed</option>
            <option value="BLOCKED">Blocked</option>
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
          if (tasks.length === 0) {
            return (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center shadow-sm">
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">
                  No Tasks Found
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  {searchQuery || statusFilter
                    ? "No tasks match your filters."
                    : "Get started by creating your first task."}
                </p>
              </div>
            );
          }

          return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
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
      <TaskModal
        modalConfig={modalConfig}
        setModalConfig={setModalConfig}
        selectedItem={selectedItem}
        formData={formData}
        errors={errors}
        isSubmitting={isSubmitting}
        projects={projects}
        teams={teams}
        users={availableUsers}
        user={user}
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
                Delete Task
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
                Are you sure you want to delete this task? This action cannot be
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

export default Tasks;
