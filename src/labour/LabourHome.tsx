import { useState } from "react";
import SubmittedLabourCard from "./SubmittedLabourCard";
import ProcessedLabourCard from "./ProcessedLabourCard";
import ApprovedLabourCard from "./ApprovedLabourCard";
import { GrUserWorker } from "react-icons/gr";
import { FiClock, FiFileText, FiCheckCircle } from "react-icons/fi";

const LabourHome = () => {
  const [activeTab, setActiveTab] = useState<
    "submitted" | "processed" | "approved"
  >("submitted");

  const tabs = [
    {
      id: "submitted",
      label: "1. Submitted",
      icon: <FiClock className="mr-2" size={16} />,
      badge: "Stage 1",
      badgeColor: "bg-coral-50 text-coral-600 border-coral-200",
      description: "Initial applicant intake awaiting officer triage.",
    },
    {
      id: "processed",
      label: "2. Processed",
      icon: <FiFileText className="mr-2" size={16} />,
      badge: "Stage 2",
      badgeColor: "bg-ocean-50 text-ocean-700 border-ocean-200",
      description: "Pre-verified records submitted for administrator authorization.",
    },
    {
      id: "approved",
      label: "3. Approved",
      icon: <FiCheckCircle className="mr-2" size={16} />,
      badge: "Stage 3",
      badgeColor: "bg-mint-50 text-mint-700 border-mint-200",
      description: "Formally certified and sanctioned labor applicants.",
    },
  ] as const;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-sand-200 shadow-card">
        <div className="flex items-center space-x-2.5 mb-2">
          <div className="p-2.5 bg-ocean-50 text-ocean-700 rounded-xl">
            <GrUserWorker size={22} />
          </div>
          <span className="badge-tag bg-ocean-50 text-ocean-700 border border-ocean-100">
            Labour Registry
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-ink-900 font-serif">
          Labour Verification Pipeline
        </h1>
        <p className="text-sm text-ink-600 mt-1 max-w-3xl">
          Multi-tiered verification workflow ensuring identity authenticity, workplace compliance, and statutory labor certification.
        </p>

        {/* Tab Navigation */}
        <div
          role="tablist"
          aria-label="Labour pipeline stages"
          className="mt-6 flex flex-wrap gap-2 p-1.5 bg-sand-100 rounded-2xl border border-sand-200/80"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[140px] flex items-center justify-center px-4 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ocean-500 ${
                  isActive
                    ? "bg-ocean-800 text-white shadow-md font-serif"
                    : "text-ink-700 hover:text-ocean-900 hover:bg-white/60"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stage Description Bar */}
      <div className="bg-sand-50 rounded-xl px-5 py-3 border border-sand-200/80 flex items-center justify-between text-xs text-ink-600">
        <div>
          <span className="font-semibold text-ink-800">Current View:</span>{" "}
          {tabs.find((t) => t.id === activeTab)?.description}
        </div>
        <span
          className={`badge-tag border ${
            tabs.find((t) => t.id === activeTab)?.badgeColor
          }`}
        >
          {tabs.find((t) => t.id === activeTab)?.badge}
        </span>
      </div>

      {/* Tab Panels */}
      <div
        role="tabpanel"
        id={`panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        className="space-y-4"
      >
        {activeTab === "submitted" && <SubmittedLabourCard />}
        {activeTab === "processed" && <ProcessedLabourCard />}
        {activeTab === "approved" && <ApprovedLabourCard />}
      </div>
    </div>
  );
};

export default LabourHome;

