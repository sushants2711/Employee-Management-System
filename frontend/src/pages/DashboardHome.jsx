function DashboardHome() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col pt-10">
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
          <h1 className="text-2xl font-bold text-ems-text-dark dark:text-white mb-4">
            Welcome to the Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            This is your new home page. You have successfully logged in!
          </p>
        </div>
      </main>
    </div>
  );
}

export default DashboardHome;
