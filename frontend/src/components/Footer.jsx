import { Link, NavLink } from "react-router-dom";
import { Mail, Heart, ExternalLink } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const getLinkClasses = ({ isActive }) =>
    `relative inline-block pb-1 transition-colors duration-300 font-medium after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-current after:transition-transform after:duration-500 after:ease-in-out after:origin-left ${
      isActive
        ? "text-slate-900 dark:text-white after:scale-x-100"
        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white after:scale-x-0 hover:after:scale-x-100"
    }`;

  return (
    <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 relative overflow-hidden mt-24">
      {/* Decorative gradient top border */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-ems-primary to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto py-10 px-6 sm:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-10">
          {/* Brand & Mission */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-sm">
            <Link
              to="/"
              className="text-2xl font-black text-slate-800 dark:text-white mb-3 tracking-tight"
            >
              Enterprise{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ems-primary to-purple-500">
                Hub
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Empowering the modern workforce with seamless, powerful, and
              intuitive management tools.
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 font-medium px-4 py-2 bg-slate-100 dark:bg-slate-800/50 rounded-full border border-slate-200 dark:border-slate-700">
              Built with{" "}
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />{" "}
              by Sushant
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center lg:items-start gap-4 w-full lg:w-auto mt-6 lg:mt-0 hidden sm:flex">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Links
            </h3>
            <ul className="flex flex-col gap-3 text-center lg:text-left text-sm text-slate-600 dark:text-slate-400 font-medium">
              <li>
                <NavLink to="/home" end className={getLinkClasses}>
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/home/projects" className={getLinkClasses}>
                  Projects
                </NavLink>
              </li>
              <li>
                <NavLink to="/home/teams" className={getLinkClasses}>
                  Teams
                </NavLink>
              </li>
              <li>
                <NavLink to="/home/users" className={getLinkClasses}>
                  Employees
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="flex flex-col items-center lg:items-start gap-4 w-full lg:w-auto mt-6 lg:mt-0 hidden sm:flex">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Resources
            </h3>
            <ul className="flex flex-col gap-3 text-center lg:text-left text-sm text-slate-600 dark:text-slate-400 font-medium">
              <li>
                <NavLink to="/home/help-center" className={getLinkClasses}>
                  Help Center
                </NavLink>
              </li>
              <li>
                <NavLink to="/home/documentation" className={getLinkClasses}>
                  Documentation
                </NavLink>
              </li>
              <li>
                <NavLink to="/home/community" className={getLinkClasses}>
                  Community
                </NavLink>
              </li>
              <li>
                <NavLink to="/home/system-status" className={getLinkClasses}>
                  System Status
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Connect Section */}
          <div className="flex flex-col items-center lg:items-end gap-5 w-full lg:w-auto mt-6 lg:mt-0">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Let's Connect
            </h3>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {/* GitHub */}
              <a
                href="https://github.com/sushants2711"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 px-5 py-2.5 bg-slate-50 hover:bg-[#24292e] dark:bg-slate-800/50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-slate-700 dark:text-slate-300 group-hover:text-white transition-colors"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-white transition-colors">
                  sushants2711
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white/70 ml-1 opacity-0 group-hover:opacity-100 transition-all -translate-y-1 group-hover:translate-y-0" />
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com/in/sushants2711"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 px-5 py-2.5 bg-slate-50 hover:bg-[#0A66C2] dark:bg-slate-800/50 dark:hover:bg-[#0A66C2]/90 border border-slate-200 dark:border-slate-700 hover:border-[#0A66C2] dark:hover:border-[#0A66C2] rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-slate-700 dark:text-slate-300 group-hover:text-white transition-colors"
                  fill="currentColor"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-white transition-colors">
                  LinkedIn
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white/70 ml-1 opacity-0 group-hover:opacity-100 transition-all -translate-y-1 group-hover:translate-y-0" />
              </a>

              {/* Email */}
              <a
                href="mailto:sushants2711@gmail.com"
                className="group flex items-center gap-3 px-5 py-2.5 bg-slate-50 hover:bg-ems-primary dark:bg-slate-800/50 dark:hover:bg-ems-primary-dark border border-slate-200 dark:border-slate-700 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <Mail className="w-5 h-5 text-slate-700 dark:text-slate-300 group-hover:text-white transition-colors" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-white transition-colors">
                  sushants2711@gmail.com
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-500 font-medium">
            &copy; {currentYear} Enterprise Workforce Hub.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-400 dark:text-slate-500 font-medium">
            <NavLink to="/home/privacy" className={getLinkClasses}>
              Privacy
            </NavLink>
            <NavLink to="/home/terms" className={getLinkClasses}>
              Terms
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
