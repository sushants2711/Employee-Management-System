import { useState, useEffect, useRef, useCallback } from "react";
import { Activity, Lock, User, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import {
  getSingleUser,
  updateManagementProfile,
  updateProfileImage,
} from "../api/authApi";
import { getAllActiveTeams } from "../api/teamApi";
import { getAllActiveDepartments } from "../api/departmentApi";
import { getAllActiveDesignations } from "../api/designationApi";
import { showSuccess, showError } from "../toastMessage/toastDeliver";
import { useAuth } from "../context/AuthContext";
import ProfileHeader from "../features/profile/ProfileHeader";
import ProfileForm from "../features/profile/ProfileForm";

function Profile() {
  const { updateUser } = useAuth();
  const [user, setUser] = useState(null);
  const [teams, setTeams] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
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

      // Sync the latest profile picture to global AuthContext & localStorage
      // so it updates immediately in the Sidebar and Home page
      if (userData.profilePicUrl !== undefined) {
        updateUser({ profilePicUrl: userData.profilePicUrl });
      }

      setTeams(teamsRes.data || []);
      setDepartments(deptRes.data || []);
      setDesignations(desigRes.data || []);

      setFormData({
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
  }, [updateUser]);

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
        <ProfileHeader
          user={user}
          fileInputRef={fileInputRef}
          isImageUploading={isImageUploading}
          handleImageChange={handleImageChange}
        />

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

          {/* Organization Settings */}
          {user?.role === "Management" ? (
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-700/50 pb-2">
                <h4 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Organization Settings
                </h4>
                <span className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold tracking-wider uppercase">
                  Editable
                </span>
              </div>

              <ProfileForm
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                departments={departments}
                designations={designations}
                teams={teams}
              />
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-700/50 pb-2">
                <h4 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Organization Settings
                </h4>
                <span className="text-[10px] bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 px-2 py-0.5 rounded-full font-bold tracking-wider uppercase">
                  Read Only
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                <div className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
                    Department
                  </label>
                  <p className="text-slate-900 dark:text-white font-medium text-base">
                    {user?.department?.departmentName || "N/A"}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
                    Designation
                  </label>
                  <p className="text-slate-900 dark:text-white font-medium text-base">
                    {user?.designation?.designationName || "N/A"}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
                    Team Name
                  </label>
                  <p className="text-slate-900 dark:text-white font-medium text-base">
                    {user?.teamName?.teamName || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          <div>
            <h4 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4" /> Security Settings
            </h4>
            <div className="bg-slate-50 dark:bg-slate-900/30 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-slate-900 dark:text-white font-medium">
                  Password
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Ensure your account is using a long, random password to stay
                  secure.
                </p>
              </div>
              <Link
                to="/change-password"
                className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium transition-colors shadow-sm whitespace-nowrap"
              >
                Change Password
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
