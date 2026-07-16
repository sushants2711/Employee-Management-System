import { Link } from "react-router-dom";
import { Code2, MessageSquare, Briefcase, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-8 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start">
          <Link
            to="/"
            className="text-xl font-bold text-slate-800 dark:text-white mb-2"
          >
            Enterprise{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ems-primary to-purple-500">
              Hub
            </span>
          </Link>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Empowering modern workforce management.
          </p>
        </div>

        {/* Made With Love */}
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
          Built with{" "}
          <Heart className="w-4 h-4 text-pink-500 fill-pink-500 animate-pulse" />{" "}
          for Enterprise
        </div>

        {/* Socials & Copyright */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-slate-400 hover:text-ems-primary dark:hover:text-ems-primary-dark transition-colors"
            >
              <Code2 className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-slate-400 hover:text-[#1DA1F2] transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-slate-400 hover:text-[#0A66C2] transition-colors"
            >
              <Briefcase className="w-5 h-5" />
            </a>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            &copy; {currentYear} Enterprise Workforce Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
