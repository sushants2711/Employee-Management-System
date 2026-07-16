import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(-1);
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-6 text-red-500 dark:text-red-400">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
        404
      </h1>
      <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-6">
        Page Not Found
      </h2>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">
        We're sorry, but the page you were looking for doesn't exist or has been
        moved.
      </p>
      <button
        onClick={handleClick}
        className="px-6 py-3 rounded-xl shadow-sm text-sm font-semibold text-white bg-ems-primary hover:bg-blue-700 dark:bg-ems-primary-dark dark:hover:bg-blue-600 transition-all transform hover:-translate-y-0.5"
      >
        Return to Safety
      </button>
    </div>
  );
}

export default NotFound;
