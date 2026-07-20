import { Camera, Hash, Shield } from "lucide-react";

function ProfileHeader({
  user,
  fileInputRef,
  isImageUploading,
  handleImageChange,
}) {
  return (
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
  );
}

export default ProfileHeader;
