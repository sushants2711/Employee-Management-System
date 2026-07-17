function DashboardHome() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
      <h1 className="text-2xl font-bold text-ems-text-dark dark:text-white mb-4">
        Welcome to the Dashboard
      </h1>
      <p className="text-slate-600 dark:text-slate-400">
        This is your new home page. You have successfully logged in!
      </p>
    </div>
  );
}

export default DashboardHome;
