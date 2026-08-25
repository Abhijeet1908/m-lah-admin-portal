import { useState } from "react";
import { useGetLabourByStatus } from "../utils/base.hooks";
import LabourCardBrief from "../components/customCards/LabourCardBrief";
import { FiAlertCircle, FiSlash, FiSearch, FiRefreshCw } from "react-icons/fi";

const SuspendedLabourCard = () => {
  const { labourCards, loading, error, refetch } = useGetLabourByStatus(5);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCards = labourCards.filter((labour) => {
    const fullName = [labour.firstName, labour.middleName, labour.lastName]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    const contact = (labour.contactNumber || "").toLowerCase();
    const id = String(labour.labourId || labour.id || "");
    const term = searchTerm.toLowerCase();

    return fullName.includes(term) || contact.includes(term) || id.includes(term);
  });

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
        <h3 className="font-serif font-bold text-ink-900 text-lg">
          Unable to Load Suspended Labour Records
        </h3>
        <p className="text-sm text-ink-600 max-w-md mx-auto">{error}</p>
        <button
          onClick={() => refetch()}
          className="mt-2 px-4 py-2 bg-ocean-800 text-white rounded-xl text-xs font-semibold"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and live counter toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-sand-200 shadow-card flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-400">
            <FiSearch size={16} />
          </div>
          <input
            type="text"
            placeholder="Search by name, ID, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-sand-300 bg-sand-50/50 text-xs text-ink-900 focus-visible:ring-2 focus-visible:ring-ocean-500"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center text-xs">
          <span className="badge-tag bg-rose-50 text-rose-700 border border-rose-200">
            {labourCards.length} Suspended / Expired
          </span>
          <button
            onClick={() => refetch()}
            className="p-2 rounded-xl bg-sand-100 hover:bg-sand-200 text-ink-700 transition-colors"
            title="Refresh List"
          >
            <FiRefreshCw size={14} />
          </button>
        </div>
      </div>

      {filteredCards.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-sand-200 shadow-card space-y-3">
          <div className="inline-flex p-4 bg-sand-100 text-ink-400 rounded-full">
            <FiSlash size={32} />
          </div>
          <h3 className="font-serif font-bold text-ink-900 text-lg">
            No Suspended Labour Records
          </h3>
          <p className="text-sm text-ink-600 max-w-md mx-auto">
            Applications that are suspended by officers or automatically moved here due to validity expiration will appear in this registry.
          </p>
        </div>
      ) : (
        filteredCards.map((labour, index) => (
          <LabourCardBrief
            key={labour.labourId || labour.id || index}
            labour={labour}
            onStatusUpdated={refetch}
          />
        ))
      )}
    </div>
  );
};

export default SuspendedLabourCard;
