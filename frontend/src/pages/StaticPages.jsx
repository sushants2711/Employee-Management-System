import {
  HelpCircle,
  Book,
  MessageCircle,
  Activity,
  Shield,
  FileText,
} from "lucide-react";

export const HelpCenter = () => (
  <div className="max-w-4xl mx-auto p-8 animate-fade-in pb-20">
    <div className="flex items-center gap-4 mb-8">
      <div className="p-4 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl">
        <HelpCircle size={32} />
      </div>
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">
          Help Center
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Get the support you need to manage your workforce.
        </p>
      </div>
    </div>
    <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
      <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">
        Frequently Asked Questions
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-white mb-2">
            How do I add a new employee?
          </h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Navigate to the Employees tab on the dashboard and click "Add
            Employee". Fill in the required details, assign them to a
            department, and set their role. You can also generate an OTP for
            their initial login.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-white mb-2">
            How are teams structured?
          </h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Teams consist of a Manager, a Team Leader, and multiple Members.
            Projects are assigned directly to teams, ensuring clear
            accountability and reporting lines.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-white mb-2">
            What is the difference between Management and Manager roles?
          </h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            The <strong>Management</strong> role represents top-level
            administrators (e.g., HR, Directors) who have full access to create
            departments, designations, and system-wide settings.{" "}
            <strong>Managers</strong> oversee specific teams and projects
            assigned to them.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-white mb-2">
            Can I reset my password?
          </h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Yes, if you forgot your password or need an OTP, please contact your
            immediate Manager or the Management team. If you are already logged
            in, you can update your password via the Profile section.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export const Documentation = () => (
  <div className="max-w-4xl mx-auto p-8 animate-fade-in pb-20">
    <div className="flex items-center gap-4 mb-8">
      <div className="p-4 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-2xl">
        <Book size={32} />
      </div>
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">
          Documentation
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Comprehensive guides for Enterprise Hub.
        </p>
      </div>
    </div>
    <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
      <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">
        Getting Started
      </h2>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
        Welcome to Enterprise Hub. This system is designed to streamline your HR
        and project management workflows. Our REST API is also fully documented
        for internal integrations. Use the dashboard to monitor overall
        organizational health, track projects, and manage your workforce
        seamlessly.
      </p>

      <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">
        Role-Based Access Control (RBAC)
      </h2>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
        Enterprise Hub enforces strict role-based access. Available roles
        include:
      </p>
      <ul className="list-disc pl-5 mb-6 text-slate-600 dark:text-slate-400 space-y-2">
        <li>
          <strong>Management:</strong> Unrestricted access to all modules,
          including user creation and organization structure setup.
        </li>
        <li>
          <strong>Manager:</strong> Read/write access to assigned teams,
          projects, and subordinate employees.
        </li>
        <li>
          <strong>Team Leader:</strong> Project oversight and task management
          for specific team members.
        </li>
        <li>
          <strong>Employee:</strong> Read-only access to their own profile,
          assigned projects, and team directories.
        </li>
      </ul>

      <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">
        API Reference
      </h2>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
        All API endpoints (`/api/v1/*`) are authenticated via secure HttpOnly
        cookies. Ensure your client sends credentials with every request. Refer
        to your internal swagger documentation for full payload schemas. Error
        responses consistently follow a standard JSON structure containing a
        `message` and `success: false` flag.
      </p>
    </div>
  </div>
);

export const Community = () => (
  <div className="max-w-4xl mx-auto p-8 animate-fade-in pb-20">
    <div className="flex items-center gap-4 mb-8">
      <div className="p-4 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-2xl">
        <MessageCircle size={32} />
      </div>
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">
          Community Forum
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Connect, share, and collaborate with your peers.
        </p>
      </div>
    </div>
    <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="text-center py-10 mb-8 border-b border-slate-100 dark:border-slate-700">
        <MessageCircle
          size={64}
          className="mx-auto text-purple-200 dark:text-purple-900/50 mb-6"
        />
        <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-white">
          Discussions are moving to Slack!
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
          We are currently migrating our internal community forums to our
          enterprise Slack workspace for real-time collaboration. Please check
          the #announcements channel for the latest updates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-slate-800 dark:text-white mb-2">
            #general
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Join company-wide discussions, announcements, and casual watercooler
            chats.
          </p>
        </div>
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-slate-800 dark:text-white mb-2">
            #engineering-help
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Stuck on a problem? Ask your peers for help, code reviews, and
            architectural advice.
          </p>
        </div>
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-slate-800 dark:text-white mb-2">
            #hr-support
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Directly ping the HR team for questions regarding payroll, leaves,
            or policies.
          </p>
        </div>
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-slate-800 dark:text-white mb-2">
            #feedback
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Have an idea to improve Enterprise Hub? Drop your suggestions here!
          </p>
        </div>
      </div>
    </div>
  </div>
);

export const SystemStatus = () => (
  <div className="max-w-4xl mx-auto p-8 animate-fade-in pb-20">
    <div className="flex items-center gap-4 mb-8">
      <div className="p-4 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-2xl">
        <Activity size={32} />
      </div>
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">
          System Status
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Real-time monitoring of Enterprise Hub services.
        </p>
      </div>
    </div>
    <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/30 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="font-bold text-emerald-700 dark:text-emerald-400">
            All Systems Operational
          </span>
        </div>
        <span className="text-sm text-emerald-600 dark:text-emerald-500">
          Updated just now
        </span>
      </div>

      <div className="space-y-4">
        {[
          "API Services",
          "Database Clusters",
          "Authentication",
          "Background Workers",
        ].map((service) => (
          <div
            key={service}
            className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-700/50 last:border-0"
          >
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {service}
            </span>
            <span className="text-sm font-bold text-emerald-500">
              Operational
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const Privacy = () => (
  <div className="max-w-4xl mx-auto p-8 animate-fade-in pb-20">
    <div className="flex items-center gap-4 mb-8">
      <div className="p-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl">
        <Shield size={32} />
      </div>
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">
          Privacy Policy
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          How we handle your enterprise data.
        </p>
      </div>
    </div>
    <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 prose dark:prose-invert max-w-none">
      <h2 className="text-xl font-bold mt-8 mb-4 text-slate-800 dark:text-white">
        1. Data Collection
      </h2>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
        At Enterprise Hub, we take data security and privacy seriously. This
        system is designed for internal organizational use. All employee data,
        performance metrics, and organizational structures are strictly
        confidential and stored using industry-standard encryption protocols.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-4 text-slate-800 dark:text-white">
        2. Data Usage and Sharing
      </h2>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
        We do not share your organizational data with any third parties. Only
        authorized management personnel have access to sensitive employee
        records and payroll information. Your data is used exclusively to
        facilitate internal workforce management, reporting, and payroll
        processing.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-4 text-slate-800 dark:text-white">
        3. Your Rights
      </h2>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
        Employees have the right to request a complete export of their personal
        HR file. Should you find any discrepancies in your title, department
        assignment, or payroll information, please contact your HR
        representative immediately to initiate a correction.
      </p>
    </div>
  </div>
);

export const Terms = () => (
  <div className="max-w-4xl mx-auto p-8 animate-fade-in pb-20">
    <div className="flex items-center gap-4 mb-8">
      <div className="p-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl">
        <FileText size={32} />
      </div>
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">
          Terms of Service
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Usage guidelines for Enterprise Hub.
        </p>
      </div>
    </div>
    <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 prose dark:prose-invert max-w-none">
      <h2 className="text-xl font-bold mt-8 mb-4 text-slate-800 dark:text-white">
        1. Acceptable Use
      </h2>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
        By accessing and using the Enterprise Hub platform, you agree to comply
        with your organization's IT and acceptable use policies. This platform
        is provided "as is" for internal management and operational efficiency.
        You agree not to use the service for any unlawful purposes or to conduct
        any activity that would compromise the integrity of the system.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-4 text-slate-800 dark:text-white">
        2. Security and Access
      </h2>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
        Unauthorized access, data scraping, or attempting to bypass role-based
        access controls is strictly prohibited and will be logged. You are
        responsible for keeping your credentials confidential and reporting any
        suspicious activity on your account immediately.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-4 text-slate-800 dark:text-white">
        3. Modifications to Service
      </h2>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
        Enterprise Hub reserves the right to modify or discontinue, temporarily
        or permanently, the service (or any part thereof) with or without
        notice. We shall not be liable to you or any third party for any
        modification, suspension, or discontinuance of the service.
      </p>
    </div>
  </div>
);
