import { useState } from "react";
import AllAppliedLabourCard from "./AllAppliedLabourCard";
import SubmittedLabourCard from "./SubmittedLabourCard";
import ProcessedLabourCard from "./ProcessedLabourCard";
import ReviewPendingLabourCard from "./ReviewPendingLabourCard";
import ApprovedLabourCard from "./ApprovedLabourCard";
import SuspendedLabourCard from "./SuspendedLabourCard";
import { GrUserWorker } from "react-icons/gr";
import {
  FiClock,
  FiFileText,
  FiCheckCircle,
  FiAlertTriangle,
  FiSlash,
  FiLayers,
} from "react-icons/fi";

type TabId =
  | "all"
  | "submitted"
  | "review_pending"
  | "processed"
  | "approved"
  | "suspended";

const LabourHome = () => {
  const [activeTab, setActiveTab] = useState<TabId>("all");

  const tabs = [
    {
      id: "all" as TabId,
      label: "All Labour Cards",
      icon: <FiLayers className="mr-1.5" size={15} />,
      badge: "Master Registry",
      badgeColor: "bg-sand-100 text-ink-800 border-sand-300",
      description:
        "Comprehensive master registry of all labor cards across intake, review, certification, and suspension stages.",
    },
    {
      id: "submitted" as TabId,
      label: "Submitted",
      icon: <FiClock className="mr-1.5" size={15} />,
      badge: "Intake",
      badgeColor: "bg-coral-50 text-coral-600 border-coral-200",
      description:
        "Initial intake awaiting reviewer triage. Reviewer can mark as Processed, move to Review Pending, or Suspend. (Action: Reviewer Only)",
    },
    {
      id: "review_pending" as TabId,
      label: "Review Pending",
      icon: <FiAlertTriangle className="mr-1.5" size={15} />,
      badge: "Clarification",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      description:
        "Applications marked for review. Only Reviewers can transition records here back to Submitted or forward to Processed. (Action: Reviewer Only)",
    },
    {
      id: "processed" as TabId,
      label: "Processed",
      icon: <FiFileText className="mr-1.5" size={15} />,
      badge: "Reviewed",
      badgeColor: "bg-ocean-50 text-ocean-700 border-ocean-200",
      description:
        "Pre-verified records (Reviewed). Admin can grant final Approval, return to Review Pending, or Suspend. (Action: Admin Only)",
    },
    {
      id: "approved" as TabId,
      label: "Approved",
      icon: <FiCheckCircle className="mr-1.5" size={15} />,
      badge: "Certified",
      badgeColor: "bg-mint-50 text-mint-700 border-mint-200",
      description:
        "Formally sanctioned and certified labor applicants. (Certified Register)",
    },
    {
      id: "suspended" as TabId,
      label: "Suspended",
      icon: <FiSlash className="mr-1.5" size={15} />,
      badge: "Suspended / Expired",
      badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
      description:
        "Applications suspended by officers or automatically moved here upon validity expiration.",
    },
  ];

  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];

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
          Multi-tiered verification workflow ensuring identity authenticity, statutory labor certification, review pending resolution, and validity compliance.
        </p>

        {/* Tab Navigation Bar */}
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
                className={`flex-1 min-w-[130px] flex items-center justify-center px-3 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ocean-500 ${
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

      {/* Stage Description & Authorization Guidance Banner */}
      <div className="bg-sand-50 rounded-xl px-5 py-3.5 border border-sand-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-ink-600">
        <div>
          <span className="font-semibold text-ink-800">Pipeline Stage:</span>{" "}
          {currentTab.description}
        </div>
        <span className={`badge-tag border flex-shrink-0 ${currentTab.badgeColor}`}>
          {currentTab.badge}
        </span>
      </div>

      {/* Active Tab Panel */}
      <div
        role="tabpanel"
        id={`panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        className="space-y-4"
      >
        {activeTab === "all" && <AllAppliedLabourCard />}
        {activeTab === "submitted" && <SubmittedLabourCard />}
        {activeTab === "processed" && <ProcessedLabourCard />}
        {activeTab === "review_pending" && <ReviewPendingLabourCard />}
        {activeTab === "approved" && <ApprovedLabourCard />}
        {activeTab === "suspended" && <SuspendedLabourCard />}
      </div>
    </div>
  );
};

export default LabourHome;
