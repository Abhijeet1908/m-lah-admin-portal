import { useState } from "react";
import { useGetLabourByStatus } from "../utils/base.hooks";
import LabourCardBrief from "../components/customCards/LabourCardBrief";
import { LabourStatusEnum } from "../common/types";
import {
  FiAlertCircle,
  FiList,
  FiSearch,
  FiFilter,
  FiRefreshCw,
} from "react-icons/fi";

const AllAppliedLabourCard = () => {
  const { labourCards, loading, error, refetch } = useGetLabourByStatus("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | "all">("all");

  const filteredCards = labourCards.filter((labour) => {
    const fullName = [labour.firstName, labour.middleName, labour.lastName]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    const contact = (labour.contactNumber || "").toLowerCase();
    const id = String(labour.labourId || labour.id || "");
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      fullName.includes(term) || contact.includes(term) || id.includes(term);

    const matchesStatus =
      statusFilter === "all" || labour.statusId === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const countByStatus = (statusId: number) =>
    labourCards.filter((c) => c.statusId === statusId).length;

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((n) => (
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
          Unable to Load Master Labour Records
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
      {/* Control Bar */}
      <div className="bg-white rounded-2xl p-4 border border-sand-200 shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-400">
            <FiSearch size={16} />
          </div>
          <input
            type="text"
            placeholder="Search all labour cards by name, record ID, contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-sand-300 bg-sand-50/50 text-xs text-ink-900 focus-visible:ring-2 focus-visible:ring-ocean-500"
          />
        </div>

        {/* Status Filter & Refresh */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center space-x-1 bg-sand-100 px-2.5 py-1 rounded-xl border border-sand-200">
            <FiFilter size={13} className="text-ink-500" />
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value === "all" ? "all" : Number(e.target.value)
                )
              }
              className="bg-transparent text-xs font-semibold text-ink-800 outline-none cursor-pointer py-1"
            >
              <option value="all">All Statuses ({labourCards.length})</option>
              <option value={LabourStatusEnum.Submitted}>
                Submitted ({countByStatus(1)})
              </option>
              <option value={LabourStatusEnum.ReviewedPending}>
                Review Pending ({countByStatus(4)})
              </option>
              <option value={LabourStatusEnum.Reviewed}>
                Processed ({countByStatus(2)})
              </option>
              <option value={LabourStatusEnum.Approved}>
                Approved ({countByStatus(3)})
              </option>
              <option value={LabourStatusEnum.Suspended}>
                Suspended ({countByStatus(5)})
              </option>
            </select>
          </div>

          <button
            onClick={() => refetch()}
            className="p-2.5 rounded-xl bg-sand-100 hover:bg-sand-200 text-ink-700 transition-colors"
            title="Refresh All Records"
          >
            <FiRefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Quick Summary Pill Badges */}
      <div className="flex flex-wrap gap-2 text-xs">
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-3 py-1.5 rounded-xl border font-semibold transition-all ${
            statusFilter === "all"
              ? "bg-ocean-800 text-white border-ocean-800 shadow-sm"
              : "bg-white text-ink-700 border-sand-200 hover:bg-sand-50"
          }`}
        >
          All ({labourCards.length})
        </button>
        <button
          onClick={() => setStatusFilter(1)}
          className={`px-3 py-1.5 rounded-xl border font-semibold transition-all ${
            statusFilter === 1
              ? "bg-coral-600 text-white border-coral-600 shadow-sm"
              : "bg-coral-50 text-coral-700 border-coral-200 hover:bg-coral-100"
          }`}
        >
          Submitted ({countByStatus(1)})
        </button>
        <button
          onClick={() => setStatusFilter(4)}
          className={`px-3 py-1.5 rounded-xl border font-semibold transition-all ${
            statusFilter === 4
              ? "bg-amber-600 text-white border-amber-600 shadow-sm"
              : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
          }`}
        >
          Review Pending ({countByStatus(4)})
        </button>
        <button
          onClick={() => setStatusFilter(2)}
          className={`px-3 py-1.5 rounded-xl border font-semibold transition-all ${
            statusFilter === 2
              ? "bg-ocean-700 text-white border-ocean-700 shadow-sm"
              : "bg-ocean-50 text-ocean-700 border-ocean-200 hover:bg-ocean-100"
          }`}
        >
          Processed ({countByStatus(2)})
        </button>
        <button
          onClick={() => setStatusFilter(3)}
          className={`px-3 py-1.5 rounded-xl border font-semibold transition-all ${
            statusFilter === 3
              ? "bg-mint-600 text-white border-mint-600 shadow-sm"
              : "bg-mint-50 text-mint-700 border-mint-200 hover:bg-mint-100"
          }`}
        >
          Approved ({countByStatus(3)})
        </button>
        <button
          onClick={() => setStatusFilter(5)}
          className={`px-3 py-1.5 rounded-xl border font-semibold transition-all ${
            statusFilter === 5
              ? "bg-rose-600 text-white border-rose-600 shadow-sm"
              : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
          }`}
        >
          Suspended ({countByStatus(5)})
        </button>
      </div>

      {filteredCards.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-sand-200 shadow-card space-y-3">
          <div className="inline-flex p-4 bg-sand-100 text-ink-400 rounded-full">
            <FiList size={32} />
          </div>
          <h3 className="font-serif font-bold text-ink-900 text-lg">
            No Labour Applications Found
          </h3>
          <p className="text-sm text-ink-600 max-w-md mx-auto">
            {searchTerm || statusFilter !== "all"
              ? "No applications matched your search or status filter criteria."
              : "No labour applications have been filed yet."}
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

export default AllAppliedLabourCard;
