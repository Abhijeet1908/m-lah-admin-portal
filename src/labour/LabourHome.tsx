import { useState } from "react";
import SubmittedLabourCard from "./SubmittedLabourCard";
import ProcessedLabourCard from "./ProcessedLabourCard";
import ApprovedLabourCard from "./ApprovedLabourCard";

const LabourHome = () => {
  const [activeTab, setActiveTab] = useState<
    "submitted" | "processed" | "approved"
  >("submitted");

  return (
    <div className="p-4">
      {/* Tabs */}
      <div className="flex space-x-4 border-b mb-4">
        <button
          onClick={() => setActiveTab("submitted")}
          className={`px-4 py-2 ${
            activeTab === "submitted"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600"
          }`}
        >
          Submitted
        </button>
        <button
          onClick={() => setActiveTab("processed")}
          className={`px-4 py-2 ${
            activeTab === "processed"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600"
          }`}
        >
          Processed
        </button>
        <button
          onClick={() => setActiveTab("approved")}
          className={`px-4 py-2 ${
            activeTab === "approved"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600"
          }`}
        >
          Approved
        </button>
      </div>

      {/* Content */}
      <div className="mt-4 ">
        {activeTab === "submitted" && <SubmittedLabourCard />}
        {activeTab === "processed" && <ProcessedLabourCard />}
        {activeTab === "approved" && <ApprovedLabourCard />}
      </div>
    </div>
  );
};

export default LabourHome;
