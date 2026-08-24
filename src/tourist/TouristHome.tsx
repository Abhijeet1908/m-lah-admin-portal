import { useState } from "react";
import { useGetAllTourists } from "../utils/base.hooks";
import TouristCardBrief from "../components/customCards/TouristCardBrief";
import { BsFillPeopleFill } from "react-icons/bs";
import { FiAlertCircle, FiInbox, FiSearch, FiRefreshCw, FiUsers } from "react-icons/fi";
import { TouristType } from "../common/types";

const TouristHome = () => {
  const { tourists, loading, error, refetch } = useGetAllTourists();
  const [searchTerm, setSearchTerm] = useState("");

  // Calculate metrics
  const totalGroups = tourists.length;
  const totalChildren = tourists.reduce((acc, t) => {
    const childrenCount = t.childCustomers?.length ?? t.members?.length ?? 0;
    return acc + childrenCount;
  }, 0);
  const totalIndividuals = totalGroups + totalChildren;

  // Filter tourists by applicant name, child name, contact, or email
  const filteredTourists = tourists.filter((t: TouristType) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;

    const applicantMatch =
      `${t.firstName || ""} ${t.lastName || ""}`.toLowerCase().includes(term) ||
      (t.email && t.email.toLowerCase().includes(term)) ||
      (t.contactNo && t.contactNo.includes(term)) ||
      (t.contactNumber && t.contactNumber.includes(term)) ||
      (t.permanentAddress && t.permanentAddress.toLowerCase().includes(term)) ||
      (t.customerId && t.customerId.toString().includes(term));

    const children = t.childCustomers || (t.members as any[]) || [];
    const childMatch = children.some((c: any) =>
      `${c.firstName || ""} ${c.lastName || ""}`.toLowerCase().includes(term) ||
      (c.email && c.email.toLowerCase().includes(term)) ||
      (c.contactNo && c.contactNo.includes(term)) ||
      (c.contactNumber && c.contactNumber.includes(term)) ||
      (c.customerId && c.customerId.toString().includes(term))
    );

    return applicantMatch || childMatch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-sand-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5 mb-2">
            <div className="p-2.5 bg-ocean-50 text-ocean-700 rounded-xl">
              <BsFillPeopleFill size={22} />
            </div>
            <span className="badge-tag bg-ocean-50 text-ocean-700 border border-ocean-100">
              Visitor Registry
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-ink-900 font-serif">
            Tourist Group Registrations
          </h1>
          <p className="text-sm text-ink-600 mt-1">
            Authenticated registry of visiting groups, family members, accompanying children, and submitted identity documentation.
          </p>
        </div>

        {/* Action & Live Metrics */}
        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          {!loading && !error && (
            <div className="flex items-center gap-2 bg-sand-100 px-3.5 py-2 rounded-xl border border-sand-200 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-ink-700">
                <FiUsers className="text-ocean-600" size={14} />
                <span>{totalGroups} Groups</span>
              </div>
              <span className="text-sand-400">•</span>
              <span className="text-ink-600">{totalChildren} Children</span>
              <span className="text-sand-400">•</span>
              <span className="text-mint-700 font-bold">{totalIndividuals} Total Individuals</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => refetch()}
            disabled={loading}
            title="Refresh tourist records"
            className="p-2.5 rounded-xl bg-sand-100 hover:bg-sand-200 text-ocean-800 transition-colors border border-sand-200 disabled:opacity-50"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} size={16} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {!loading && !error && tourists.length > 0 && (
        <div className="bg-white rounded-2xl p-4 border border-sand-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-400">
              <FiSearch size={16} />
            </div>
            <input
              type="text"
              placeholder="Search by applicant or child name, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand-300 bg-sand-50/50 text-ink-900 text-xs sm:text-sm font-medium focus-visible:ring-2 focus-visible:ring-ocean-500"
            />
          </div>

          <span className="text-xs text-ink-500 font-mono">
            Showing {filteredTourists.length} of {tourists.length} groups
          </span>
        </div>
      )}

      {/* Content State Handling */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white rounded-2xl p-6 border border-sand-200 shadow-card animate-pulse flex items-start space-x-4"
            >
              <div className="w-16 h-16 rounded-full bg-sand-200 flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-sand-200 rounded w-1/4" />
                <div className="h-4 bg-sand-100 rounded w-1/2" />
                <div className="h-4 bg-sand-100 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="bg-coral-50 border border-coral-100 rounded-2xl p-6 text-center space-y-2">
          <div className="inline-flex p-3 bg-coral-100 text-coral-600 rounded-full">
            <FiAlertCircle size={24} />
          </div>
          <h3 className="font-serif font-bold text-ink-900 text-lg">Unable to Load Tourist Records</h3>
          <p className="text-sm text-ink-600 max-w-md mx-auto">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {tourists.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-sand-200 shadow-card space-y-3">
              <div className="inline-flex p-4 bg-sand-100 text-ink-400 rounded-full">
                <FiInbox size={32} />
              </div>
              <h3 className="font-serif font-bold text-ink-900 text-lg">
                No Tourist Groups Registered Yet
              </h3>
              <p className="text-sm text-ink-600 max-w-md mx-auto">
                Applications submitted via the tourist registration portal will appear here for verification and group roster compliance.
              </p>
            </div>
          ) : filteredTourists.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-sand-200 shadow-card space-y-2">
              <div className="inline-flex p-3 bg-sand-100 text-ink-400 rounded-full">
                <FiSearch size={24} />
              </div>
              <h3 className="font-serif font-bold text-ink-900 text-base">
                No Matching Tourist Groups or Children Found
              </h3>
              <p className="text-xs text-ink-500 max-w-sm mx-auto">
                Try searching with a different name, email address, or contact number.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTourists.map((tourist, index) => (
                <TouristCardBrief
                  key={tourist.customerId || tourist.id || index}
                  tourist={tourist}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TouristHome;
