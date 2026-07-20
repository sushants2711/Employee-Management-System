import { Eye, Edit2, Trash2 } from "lucide-react";

function DesignationCard({
  desig,
  user,
  openViewModal,
  openUpdateModal,
  setDeleteConfirmId,
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-shadow group">
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
          {user?.role === "Management" && (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default DesignationCard;
