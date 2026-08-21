import { useGetAllTourists } from "../utils/base.hooks";
import TouristCardBrief from "../components/customCards/TouristCardBrief";
import { BsFillPeopleFill } from "react-icons/bs";
import { FiAlertCircle, FiInbox } from "react-icons/fi";

const TouristHome = () => {
  const { tourists, loading, error } = useGetAllTourists();

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
            Authenticated registry of visiting groups, family members, and submitted identity documentation.
          </p>
        </div>

        {!loading && !error && (
          <div className="flex items-center space-x-3 self-start md:self-auto bg-sand-100 px-4 py-2.5 rounded-xl border border-sand-200">
            <span className="text-xs font-semibold text-ink-600 uppercase tracking-wider">
              Total Registered Groups:
            </span>
            <span className="font-serif text-lg font-bold text-ocean-800">
              {tourists.length}
            </span>
          </div>
        )}
      </div>

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
          ) : (
            <div className="space-y-4">
              {tourists.map((tourist, index) => (
                <TouristCardBrief key={index} tourist={tourist} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TouristHome;

