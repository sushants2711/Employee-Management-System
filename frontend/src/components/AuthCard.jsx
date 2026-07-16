const AuthCard = ({
  icon: Icon,
  title,
  subtitle,
  children,
  maxWidth = "max-w-md",
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden w-full">
      <div className={`w-full ${maxWidth} relative z-10`}>
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 border border-slate-100 dark:border-slate-700/50 relative overflow-hidden">
          <div className="mb-8 text-center mt-2">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Icon className="w-8 h-8 text-ems-primary dark:text-ems-primary-dark" />
            </div>
            <h1 className="text-2xl font-bold text-ems-text-light dark:text-ems-text-dark mb-2">
              {title}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {subtitle}
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthCard;
