import { useGetLabourByStatus } from "../utils/base.hooks";
import LabourCardBrief from "../components/customCards/LabourCardBrief";
import { FiAlertCircle, FiInbox } from "react-icons/fi";

const ProcessedLabourCard = () => {
  const { labourCards, loading, error } = useGetLabourByStatus("2");
  const role = localStorage.getItem("role") ?? "";
  const status = role.toLowerCase() === "admin" ? "Approve" : "";

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="bg-white rounded-2xl p-6 border border-sand-200 shadow-card animate-pulse flex items-start space-x-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-sand-200 flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-sand-200 rounded w-1/4" />
              <div className="h-4 bg-sand-100 rounded w-1/2" />
              <div className="h-4 bg-sand-100 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-coral-50 border border-coral-100 rounded-2xl p-6 text-center space-y-2">
        <div className="inline-flex p-3 bg-coral-100 text-coral-600 rounded-full">
          <FiAlertCircle size={24} />
        </div>
        <h3 className="font-serif font-bold text-ink-900 text-lg">Unable to Load Processed Labour Records</h3>
        <p className="text-sm text-ink-600 max-w-md mx-auto">{error}</p>
      </div>
    );
  }

  if (labourCards.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-sand-200 shadow-card space-y-3">
        <div className="inline-flex p-4 bg-sand-100 text-ink-400 rounded-full">
          <FiInbox size={32} />
        </div>
        <h3 className="font-serif font-bold text-ink-900 text-lg">
          No Processed Applications Pending Approval
        </h3>
        <p className="text-sm text-ink-600 max-w-md mx-auto">
          Applications forwarded by triage officers will appear here for administrator final review and certification.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {labourCards.map((labour, index) => (
        <LabourCardBrief key={index} labour={labour} status={status} />
      ))}
    </div>
  );
};

export default ProcessedLabourCard;

