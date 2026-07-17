import { useState, useEffect, useRef, useCallback } from "react";
import {
  Camera,
  User,
  Mail,
  Hash,
  Phone,
  Shield,
  Activity,
  Save,
} from "lucide-react";
import {
  getSingleUser,
  updateManagementProfile,
  updateProfileImage,
} from "../api/authApi";
import { getAllActiveTeams } from "../api/teamApi";
import { getAllActiveDepartments } from "../api/departmentApi";
import { getAllActiveDesignations } from "../api/designationApi";
import { showSuccess, showError } from "../toastMessage/toastDeliver";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import SubmitButton from "../components/SubmitButton";
import { useAuth } from "../context/AuthContext";

function Profile() {
  useAuth();
  const [user, setUser] = useState(null);
  const [teams, setTeams] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    password: "",
    teamName: "",
    designation: "",
    department: "",
  });

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [userRes, teamsRes, deptRes, desigRes] = await Promise.all([
        getSingleUser(),
        getAllActiveTeams().catch(() => ({ data: [] })),
        getAllActiveDepartments().catch(() => ({ data: [] })),
        getAllActiveDesignations().catch(() => ({ data: [] })),
      ]);

      const userData = userRes.data;
      setUser(userData);

      setTeams(teamsRes.data || []);
      setDepartments(deptRes.data || []);
      setDesignations(desigRes.data || []);

      setFormData({
        password: "",
        teamName: userData?.teamName?._id || userData?.teamName || "",
        designation: userData?.designation?._id || userData?.designation || "",
        department: userData?.department?._id || userData?.department || "",
      });
    } catch (error) {
      console.error("Profile fetch error:", error);
      showError(error.message || "Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      await fetchData();
    };
    loadProfile();
  }, [fetchData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any data actually changed
    const originalTeam = user?.teamName?._id || user?.teamName || "";
    const originalDesignation =
      user?.designation?._id || user?.designation || "";
    const originalDepartment = user?.department?._id || user?.department || "";

    const isChanged =
      formData.password !== "" ||
      formData.teamName !== originalTeam ||
      formData.designation !== originalDesignation ||
      formData.department !== originalDepartment;

    if (!isChanged) {
      showSuccess("No changes detected");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await updateManagementProfile(formData);
      showSuccess(res.message || "Profile updated successfully");
      await fetchData();
    } catch (error) {
      showError(error.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsImageUploading(true);
      const formData = new FormData();
      formData.append("image", file);

      const res = await updateProfileImage(formData);
      showSuccess(res.message || "Profile picture updated successfully");
      await fetchData();
    } catch (error) {
      showError(error.message || "Failed to update profile picture");
    } finally {
      setIsImageUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-ems-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center p-12">
        <p className="text-red-500">
          Failed to load user profile. Please try refreshing.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Profile Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Manage your account information and preferences
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center gap-4 w-full md:w-auto">
            <div className="relative group">
              <div
                className="rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700 border-4 border-white dark:border-slate-800 shadow-lg flex items-center justify-center text-4xl font-bold text-slate-400"
                style={{ width: "8rem", height: "8rem" }}
              >
                {user?.profilePicUrl ? (
                  <img
                    src={user.profilePicUrl}
                    alt={user.name || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user?.name?.charAt(0).toUpperCase() || "U"
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isImageUploading}
                className="absolute bottom-0 right-0 p-2 bg-ems-primary text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <Camera className="w-5 h-5" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                style={{ display: "none" }}
              />
            </div>
            {isImageUploading && (
              <p className="text-sm text-ems-primary animate-pulse">
                Uploading...
              </p>
            )}
          </div>

          {/* Form Section */}
          <div className="flex-1 w-full space-y-6" style={{ minWidth: "50%" }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Read Only Fields */}
              <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-2">
                  <User className="w-4 h-4" /> Full Name
                </label>
                <div className="w-full py-1 text-base font-medium text-slate-900 dark:text-white">
                  {user?.name}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email Address
                </label>
                <div className="w-full py-1 text-base font-medium text-slate-900 dark:text-white">
                  {user?.email}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-2">
                  <Hash className="w-4 h-4" /> Employee ID
                </label>
                <div className="w-full py-1 text-base font-medium text-slate-900 dark:text-white">
                  {user?.employeeId}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Phone Number
                </label>
                <div className="w-full py-1 text-base font-medium text-slate-900 dark:text-white">
                  {user?.phoneNumber}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Role
                </label>
                <div className="w-full py-1 text-base font-medium text-slate-900 dark:text-white">
                  {user?.role}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Status
                </label>
                <div className="w-full py-1 text-base font-medium text-slate-900 dark:text-white">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                      user?.status === "ACTIVE"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400"
                    }`}
                  >
                    {user?.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-6 mt-8">
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
                Editable Information
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Department Select */}
                  <SelectField
                    label="Department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="Select Department"
                    options={departments.map((dept) => ({
                      label: dept.departmentName,
                      value: dept._id,
                    }))}
                  />

                  {/* Designation Select */}
                  <SelectField
                    label="Designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    placeholder="Select Designation"
                    options={designations.map((desig) => ({
                      label: desig.designationName,
                      value: desig._id,
                    }))}
                  />

                  {/* Team Select */}
                  <SelectField
                    label="Team"
                    name="teamName"
                    value={formData.teamName}
                    onChange={handleInputChange}
                    placeholder="Select Team"
                    options={teams.map((team) => ({
                      label: team.teamName,
                      value: team._id,
                    }))}
                  />

                  {/* Password Update */}
                  <div>
                    <InputField
                      label="New Password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Leave blank to keep unchanged"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <SubmitButton isSubmitting={isSubmitting}>
                    <div className="flex items-center justify-center gap-2">
                      <Save size={20} />
                      <span>Save Changes</span>
                    </div>
                  </SubmitButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
