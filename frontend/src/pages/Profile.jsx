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
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Profile Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Manage your account information and preferences
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in duration-300">
        {/* Premium Header Profile Section */}
        <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 border-b border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Premium Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/60 to-blue-50/60 dark:from-slate-800/80 dark:to-slate-900/80 z-0"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>

          {/* Profile Image with Camera Button */}
          <div className="relative z-10 shrink-0">
            <div className="relative p-1 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg group">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-5xl font-bold text-slate-400 border-4 border-white dark:border-slate-900 overflow-hidden">
                {user?.profilePicUrl ? (
                  <img
                    src={user.profilePicUrl}
                    alt={user.name || "User"}
                    className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                  />
                ) : (
                  user?.name?.charAt(0).toUpperCase() || "U"
                )}
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isImageUploading}
                className="absolute bottom-1 right-1 md:bottom-2 md:right-2 p-2.5 md:p-3 bg-ems-primary text-white rounded-full shadow-lg hover:bg-blue-700 transition-all cursor-pointer transform hover:scale-110 disabled:opacity-50"
                title="Update Profile Picture"
              >
                <Camera className="w-5 h-5 md:w-6 md:h-6" />
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
              <p className="text-sm font-medium text-ems-primary animate-pulse text-center mt-3">
                Uploading...
              </p>
            )}
          </div>

          {/* Profile Info */}
          <div className="relative z-10 flex flex-col justify-center text-center md:text-left w-full pt-2 md:pt-4">
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
              {user?.name}
            </h3>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-4 mb-5">
              {/* Employee ID Badge */}
              <div className="flex items-center text-slate-600 dark:text-slate-300 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                <Hash className="w-4 h-4 mr-1.5 opacity-70" />
                <span className="font-mono text-sm md:text-base font-semibold tracking-wide">
                  ID: {user?.employeeId || "N/A"}
                </span>
              </div>
            </div>

            {/* Status & Role Badges */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span
                className={`inline-flex items-center px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full border shadow-sm ${
                  user?.status === "ACTIVE"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                    : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full mr-2.5 ${user?.status === "ACTIVE" ? "bg-emerald-500" : "bg-rose-500"}`}
                ></span>
                {user?.status || "ACTIVE"}
              </span>

              <span className="inline-flex items-center px-4 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                <Shield className="w-4 h-4 mr-1.5" />
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 md:p-10 space-y-8">
          {/* Contact Information */}
          <div>
            <h4 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <User className="w-4 h-4" /> Contact Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
                  Email Address
                </label>
                <div className="flex items-center text-slate-900 dark:text-white font-medium text-base truncate">
                  <Mail className="w-4 h-4 mr-2 text-slate-400" />
                  {user?.email}
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
                  Phone Number
                </label>
                <div className="flex items-center text-slate-900 dark:text-white font-medium text-base">
                  <Phone className="w-4 h-4 mr-2 text-slate-400" />
                  {user?.phoneNumber || "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* Editable Form */}
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-700/50 pb-2">
              <h4 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4" /> Organization Settings
              </h4>
              <span className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold tracking-wider uppercase">
                Editable
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-6 gap-y-5">
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

                <SelectField
                  label="Team"
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleInputChange}
                  placeholder="Select Team"
                  options={[
                    { value: "", label: "Select Team" },
                    ...teams.map((team) => ({
                      label: team.teamName,
                      value: team._id,
                    })),
                  ]}
                />

                <InputField
                  label="New Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Leave blank to keep unchanged"
                />
              </div>

              <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-700/50">
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
  );
}

export default Profile;
