import { useNavigate } from "react-router-dom";
import { BsFillPeopleFill } from "react-icons/bs";
import { GrUserWorker } from "react-icons/gr";
import {
  FiArrowRight,
  FiShield,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiUsers,
  FiUserPlus,
} from "react-icons/fi";
import { useGetUserDetails } from "../utils/base.hooks";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useGetUserDetails();
  const storedRole = localStorage.getItem("role") || "";
  const storedRoleId = localStorage.getItem("roleId") ? Number(localStorage.getItem("roleId")) : null;
  const roleId = user?.roleId ?? storedRoleId;
  const rawRole = (user?.role || storedRole || (roleId === 1 ? "Admin" : "Reviewer")).toLowerCase();
  const displayRole = roleId === 1 || rawRole.includes("admin") ? "Admin" : "Reviewer";

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`
    : user?.userName || localStorage.getItem("userFullName") || localStorage.getItem("userName") || displayRole;

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Editorial Hero Banner */}
      <section
        aria-labelledby="hero-title"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ocean-900 via-ocean-800 to-ocean-700 text-white p-8 md:p-12 shadow-card border border-ocean-700/50"
      >
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-mint-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-32 bottom-0 w-64 h-64 rounded-full bg-ocean-500/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-mint-500/15 border border-mint-400/30 text-mint-400 text-xs font-bold uppercase tracking-wider mb-4">
            <FiShield className="inline-block" size={13} />
            <span>Official Government Registry Portal</span>
          </div>

          <h1
            id="hero-title"
            className="text-3xl md:text-5xl font-bold font-serif text-white tracking-tight leading-[1.15]"
          >
            Safeguarding Dignity, Empowering Mobility & Labor.
          </h1>

          <p className="text-ocean-100/90 text-base md:text-lg mt-4 font-normal leading-relaxed">
            Welcome, <span className="font-semibold text-mint-400 capitalize">{displayName}</span> (
            <span className="text-mint-300 font-semibold">{displayRole}</span>
            ). The m-lah portal coordinates authenticated tourist group registrations, multi-stage verification for labor certifications, and officer access control across municipal departments.
          </p>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate("/tourist")}
              className="px-6 py-3 rounded-xl bg-mint-500 hover:bg-mint-400 text-ocean-900 font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2 focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>Tourist Registry</span>
              <FiArrowRight size={16} />
            </button>
            <button
              type="button"
              onClick={() => navigate("/labour")}
              className="px-6 py-3 rounded-xl bg-ocean-700/80 hover:bg-ocean-600/90 text-white font-bold text-sm border border-ocean-600/80 shadow-md transition-all duration-200 flex items-center space-x-2 focus-visible:ring-2 focus-visible:ring-mint-400"
            >
              <span>Labour Pipeline</span>
              <FiArrowRight size={16} />
            </button>
            <button
              type="button"
              onClick={() => navigate("/users")}
              className="px-6 py-3 rounded-xl bg-ocean-800/90 hover:bg-ocean-900 text-mint-400 hover:text-white font-bold text-sm border border-mint-400/30 shadow-md transition-all duration-200 flex items-center space-x-2 focus-visible:ring-2 focus-visible:ring-mint-400"
            >
              <span>User Accounts</span>
              <FiUsers size={16} />
            </button>
          </div>
        </div>

        {/* Milestone Impact Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-ocean-700/60">
          <div className="space-y-1">
            <div className="font-serif text-2xl md:text-3xl font-bold text-white tracking-tight">
              Live API
            </div>
            <div className="text-xs font-semibold text-ocean-100/80 uppercase tracking-wider">
              Central India Cloud
            </div>
          </div>

          <div className="space-y-1">
            <div className="font-serif text-2xl md:text-3xl font-bold text-mint-400 tracking-tight">
              3-Stage
            </div>
            <div className="text-xs font-semibold text-ocean-100/80 uppercase tracking-wider">
              Labour Pipeline
            </div>
          </div>

          <div className="space-y-1">
            <div className="font-serif text-2xl md:text-3xl font-bold text-white tracking-tight">
              100%
            </div>
            <div className="text-xs font-semibold text-ocean-100/80 uppercase tracking-wider">
              Bearer Authentication
            </div>
          </div>

          <div className="space-y-1">
            <div className="font-serif text-2xl md:text-3xl font-bold text-mint-400 tracking-tight">
              Active
            </div>
            <div className="text-xs font-semibold text-ocean-100/80 uppercase tracking-wider">
              Account Governance
            </div>
          </div>
        </div>
      </section>

      {/* Core Operational Modules Grid */}
      <section aria-labelledby="modules-title">
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-2">
          <div>
            <h2 id="modules-title" className="text-2xl md:text-3xl font-bold text-ink-900 font-serif">
              Administrative Systems
            </h2>
            <p className="text-sm text-ink-600 mt-1">
              Select a module below to inspect records, verify document credentials, update applicant statuses, or provision system accounts.
            </p>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-ocean-700 bg-ocean-50 border border-ocean-100 px-3 py-1 rounded-full">
            Real-Time Connected
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tourist Registration Card */}
          <div
            onClick={() => navigate("/tourist")}
            className="group relative bg-white rounded-2xl p-6 md:p-8 border border-sand-200 shadow-card hover:shadow-card-hover hover:border-mint-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-ocean-50 text-ocean-700 group-hover:bg-mint-500 group-hover:text-ocean-900 transition-colors duration-300 shadow-sm">
                  <BsFillPeopleFill size={28} />
                </div>
                <span className="badge-tag bg-ocean-50 text-ocean-700 border border-ocean-100">
                  Registry • Groups
                </span>
              </div>

              <h3 className="text-xl font-bold text-ink-900 font-serif group-hover:text-ocean-700 transition-colors">
                Tourist Group Management
              </h3>

              <p className="text-ink-600 text-xs sm:text-sm mt-3 leading-relaxed">
                Review incoming tourist travel groups, inspect member identity certificates, verify Aadhaar / ID documents, and monitor group rosters.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="inline-flex items-center text-xs text-ink-600 bg-sand-100 px-2.5 py-1 rounded-lg">
                  <FiCheckCircle className="mr-1.5 text-mint-600" size={13} />
                  Document Lightbox
                </span>
                <span className="inline-flex items-center text-xs text-ink-600 bg-sand-100 px-2.5 py-1 rounded-lg">
                  <FiFileText className="mr-1.5 text-ocean-600" size={13} />
                  Family & Member Roster
                </span>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-sand-100 flex items-center justify-between text-ocean-700 font-bold text-sm group-hover:text-mint-600 transition-colors">
              <span>Access Tourist Registry</span>
              <span className="transform group-hover:translate-x-1.5 transition-transform duration-200">
                →
              </span>
            </div>
          </div>

          {/* Labour Registration Card */}
          <div
            onClick={() => navigate("/labour")}
            className="group relative bg-white rounded-2xl p-6 md:p-8 border border-sand-200 shadow-card hover:shadow-card-hover hover:border-mint-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-ocean-50 text-ocean-700 group-hover:bg-mint-500 group-hover:text-ocean-900 transition-colors duration-300 shadow-sm">
                  <GrUserWorker size={28} />
                </div>
                <span className="badge-tag bg-ocean-50 text-ocean-700 border border-ocean-100">
                  Workflow • 3-Stage
                </span>
              </div>

              <h3 className="text-xl font-bold text-ink-900 font-serif group-hover:text-ocean-700 transition-colors">
                Labour Verification Pipeline
              </h3>

              <p className="text-ink-600 text-xs sm:text-sm mt-3 leading-relaxed">
                Track labour cards across compliance stages: triage <span className="font-semibold text-ink-800">Submitted</span> entries, review <span className="font-semibold text-ink-800">Processed</span> cards, and issue <span className="font-semibold text-ink-800">Approved</span> certifications.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="inline-flex items-center text-xs text-ink-600 bg-sand-100 px-2.5 py-1 rounded-lg">
                  <FiClock className="mr-1.5 text-coral-500" size={13} />
                  Stage 1: Submitted
                </span>
                <span className="inline-flex items-center text-xs text-ink-600 bg-sand-100 px-2.5 py-1 rounded-lg">
                  <FiFileText className="mr-1.5 text-ocean-600" size={13} />
                  Stage 2: Processed
                </span>
                <span className="inline-flex items-center text-xs text-ink-600 bg-sand-100 px-2.5 py-1 rounded-lg">
                  <FiCheckCircle className="mr-1.5 text-mint-600" size={13} />
                  Stage 3: Approved
                </span>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-sand-100 flex items-center justify-between text-ocean-700 font-bold text-sm group-hover:text-mint-600 transition-colors">
              <span>Manage Labour Pipeline</span>
              <span className="transform group-hover:translate-x-1.5 transition-transform duration-200">
                →
              </span>
            </div>
          </div>

          {/* User Management Card */}
          <div
            onClick={() => navigate("/users")}
            className="group relative bg-white rounded-2xl p-6 md:p-8 border border-sand-200 shadow-card hover:shadow-card-hover hover:border-mint-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-ocean-50 text-ocean-700 group-hover:bg-mint-500 group-hover:text-ocean-900 transition-colors duration-300 shadow-sm">
                  <FiUsers size={28} />
                </div>
                <span className="badge-tag bg-ocean-50 text-ocean-700 border border-ocean-100">
                  Security • Access
                </span>
              </div>

              <h3 className="text-xl font-bold text-ink-900 font-serif group-hover:text-ocean-700 transition-colors">
                User Accounts & Roles
              </h3>

              <p className="text-ink-600 text-xs sm:text-sm mt-3 leading-relaxed">
                Provision new verification officers, assign administrative permissions, and manage departmental user directories on the backend API.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="inline-flex items-center text-xs text-ink-600 bg-sand-100 px-2.5 py-1 rounded-lg">
                  <FiUserPlus className="mr-1.5 text-mint-600" size={13} />
                  Provision Accounts
                </span>
                <span className="inline-flex items-center text-xs text-ink-600 bg-sand-100 px-2.5 py-1 rounded-lg">
                  <FiShield className="mr-1.5 text-ocean-600" size={13} />
                  Role Permissions
                </span>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-sand-100 flex items-center justify-between text-ocean-700 font-bold text-sm group-hover:text-mint-600 transition-colors">
              <span>Manage User Directory</span>
              <span className="transform group-hover:translate-x-1.5 transition-transform duration-200">
                →
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Information & Standard Operating Protocol Notice */}
      <section
        aria-labelledby="protocol-notice"
        className="bg-sand-100 rounded-2xl p-6 border border-sand-300/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-white rounded-xl text-ocean-700 shadow-sm flex-shrink-0">
            <FiShield size={22} />
          </div>
          <div>
            <h4 id="protocol-notice" className="text-base font-bold text-ink-900 font-serif">
              Data Governance & Verification Compliance
            </h4>
            <p className="text-xs text-ink-600 mt-0.5 leading-relaxed">
              All identity certificates, residential credentials, and photos are strictly regulated under national data privacy statutes. Ensure all verification remarks are recorded accurately prior to state approval.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

