import React, { useState, useEffect } from "react";
import { TouristType, ChildCustomerType } from "../../common/types";
import {
  FiChevronDown,
  FiX,
  FiPhone,
  FiMapPin,
  FiUsers,
  FiMail,
  FiCalendar,
  FiUser,
  FiFileText,
  FiCheckCircle,
  FiMaximize2,
  FiGrid,
} from "react-icons/fi";

/**
 * Normalizes any image string (Base64 data URI, raw base64 string, http URL, or blob)
 * into a valid HTML img src. Returns null if empty, invalid, or swagger placeholder.
 */
export const formatImageSrc = (img?: string | null): string | null => {
  if (!img) return null;
  const trimmed = img.trim();
  if (
    trimmed === "" ||
    trimmed.toLowerCase() === "string" ||
    trimmed.toLowerCase() === "null" ||
    trimmed.toLowerCase() === "undefined"
  ) {
    return null;
  }
  // Already a full Data URI, URL, or local path
  if (
    trimmed.startsWith("data:") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("/")
  ) {
    return trimmed;
  }
  // Detect raw base64 header patterns
  if (trimmed.startsWith("/9j/")) {
    return `data:image/jpeg;base64,${trimmed}`;
  }
  if (trimmed.startsWith("iVBORw0KGgo")) {
    return `data:image/png;base64,${trimmed}`;
  }
  if (trimmed.startsWith("R0lGOD")) {
    return `data:image/gif;base64,${trimmed}`;
  }
  if (trimmed.startsWith("UklGR")) {
    return `data:image/webp;base64,${trimmed}`;
  }
  // Fallback default: wrap raw base64 with jpeg mime type
  return `data:image/jpeg;base64,${trimmed}`;
};

const isMeaningful = (val?: string | null): boolean => {
  if (!val) return false;
  const trimmed = val.trim();
  return (
    trimmed !== "" &&
    trimmed.toLowerCase() !== "string" &&
    trimmed.toLowerCase() !== "null"
  );
};

const TouristCardBrief: React.FC<{ tourist: TouristType }> = ({ tourist }) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    title: string;
  } | null>(null);

  // Tab selection for children: 'all' or child index (number)
  const [activeChildTab, setActiveChildTab] = useState<number | "all">(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedImage) {
        setSelectedImage(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage]);

  // Combine children from childCustomers or legacy members
  const children: ChildCustomerType[] =
    tourist.childCustomers && tourist.childCustomers.length > 0
      ? tourist.childCustomers
      : (tourist.members as ChildCustomerType[]) || [];

  const primaryPhoto = formatImageSrc(tourist.customerImages || tourist.photo);
  const primaryDocFront = formatImageSrc(tourist.documentFront);
  const primaryDocBack = formatImageSrc(tourist.documentBack);

  const primaryContact = isMeaningful(tourist.contactNo)
    ? tourist.contactNo
    : isMeaningful(tourist.contactNumber)
    ? tourist.contactNumber
    : null;

  return (
    <article className="bg-white rounded-2xl p-6 border border-sand-200 shadow-card hover:shadow-card-hover transition-all duration-200">
      {/* Primary Overview Row */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        {/* Left - Portrait Photo + Identity Details */}
        <div className="flex items-start space-x-4">
          <div className="relative group/img flex-shrink-0">
            {primaryPhoto ? (
              <img
                src={primaryPhoto}
                alt={`${tourist.firstName} ${tourist.lastName}`}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-sand-200 shadow-sm group-hover/img:border-mint-500 cursor-pointer transition-colors"
                onClick={() =>
                  setSelectedImage({
                    src: primaryPhoto,
                    title: `${tourist.firstName} ${tourist.lastName} - Profile Photo`,
                  })
                }
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-ocean-800 text-mint-400 font-serif font-bold text-xl flex items-center justify-center border-2 border-sand-200 shadow-sm">
                {tourist.firstName?.charAt(0) || "T"}
              </div>
            )}
            {primaryPhoto && (
              <span className="absolute -bottom-1 -right-1 p-1 bg-ocean-900 text-mint-400 rounded-lg text-[10px] font-bold shadow-sm opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center gap-0.5">
                <FiMaximize2 size={10} />
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-ink-900 font-serif">
                {`${tourist.firstName} ${tourist.lastName}`}
              </h2>
              <span className="badge-tag bg-mint-50 text-mint-700 border border-mint-200/80">
                Primary Applicant
              </span>
              {tourist.customerId && (
                <span className="text-[11px] font-mono text-ink-500 bg-sand-100 px-2 py-0.5 rounded-md border border-sand-200">
                  ID: #{tourist.customerId}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-600">
              {isMeaningful(tourist.permanentAddress) && (
                <span className="flex items-center">
                  <FiMapPin className="mr-1.5 text-ocean-600 flex-shrink-0" size={13} />
                  {tourist.permanentAddress}
                </span>
              )}
              {primaryContact && (
                <span className="flex items-center">
                  <FiPhone className="mr-1.5 text-ocean-600 flex-shrink-0" size={13} />
                  {primaryContact}
                </span>
              )}
              <span className="flex items-center font-semibold text-ocean-700">
                <FiUsers className="mr-1.5 text-mint-600 flex-shrink-0" size={13} />
                {children.length} {children.length === 1 ? "Accompanying Child" : "Accompanying Children"}
              </span>
            </div>
          </div>
        </div>

        {/* Right - Expand/Collapse Action */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          className="self-end sm:self-start flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-sand-100 hover:bg-sand-200 text-ocean-800 text-xs font-bold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ocean-500"
        >
          <span>{expanded ? "Hide Details" : "View Group & Children"}</span>
          <FiChevronDown
            size={16}
            className={`transform transition-transform duration-200 ${
              expanded ? "rotate-180 text-mint-600" : ""
            }`}
          />
        </button>
      </div>

      {/* Expanded Details Section */}
      {expanded && (
        <div className="mt-6 pt-6 border-t border-sand-100 space-y-6 animate-fadeIn">
          {/* Primary Applicant Details Box */}
          <div className="bg-sand-50/80 rounded-2xl p-5 border border-sand-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink-900 uppercase tracking-wider font-sans flex items-center">
                <FiUser className="mr-2 text-ocean-600" size={15} />
                Primary Applicant Details
              </h3>
              <span className="text-xs text-mint-700 font-semibold flex items-center gap-1">
                <FiCheckCircle size={13} /> Verified Registry Record
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-ink-400 uppercase font-semibold">Gender</span>
                <p className="font-semibold text-ink-800 mt-0.5">
                  {isMeaningful(tourist.gender) ? tourist.gender : "—"}
                </p>
              </div>
              <div>
                <span className="text-ink-400 uppercase font-semibold">Date of Birth</span>
                <p className="font-semibold text-ink-800 mt-0.5 flex items-center">
                  <FiCalendar className="mr-1 text-ink-400" size={12} />
                  {isMeaningful(tourist.dob) ? tourist.dob : "—"}
                </p>
              </div>
              <div>
                <span className="text-ink-400 uppercase font-semibold">Email Address</span>
                <p className="font-semibold text-ink-800 mt-0.5 flex items-center truncate">
                  <FiMail className="mr-1 text-ink-400 flex-shrink-0" size={12} />
                  <span className="truncate">{isMeaningful(tourist.email) ? tourist.email : "—"}</span>
                </p>
              </div>
              <div>
                <span className="text-ink-400 uppercase font-semibold">Contact Number</span>
                <p className="font-semibold text-ink-800 mt-0.5 flex items-center">
                  <FiPhone className="mr-1 text-ink-400" size={12} />
                  {primaryContact || "—"}
                </p>
              </div>
            </div>

            {isMeaningful(tourist.permanentAddress) && (
              <div className="text-xs pt-2 border-t border-sand-200/50">
                <span className="text-ink-400 uppercase font-semibold">Permanent Address:</span>
                <p className="font-semibold text-ink-800 mt-0.5">{tourist.permanentAddress}</p>
              </div>
            )}

            {/* Document Attachments (Front and Back Base64 Preview) */}
            {(primaryDocFront || primaryDocBack) && (
              <div className="pt-3 border-t border-sand-200/60">
                <span className="text-xs font-bold text-ink-700 uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
                  <FiFileText className="text-ocean-600" size={13} />
                  Primary Applicant Identity Credentials (Aadhaar / ID Card)
                </span>
                <div className="flex flex-wrap gap-4">
                  {primaryDocFront && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-ink-600 block">Document Front</span>
                      <div
                        className="relative group/doc cursor-pointer rounded-xl overflow-hidden border border-sand-300 hover:border-mint-500 shadow-sm transition-all"
                        onClick={() =>
                          setSelectedImage({
                            src: primaryDocFront,
                            title: `${tourist.firstName} ${tourist.lastName} - Document Front`,
                          })
                        }
                      >
                        <img
                          src={primaryDocFront}
                          alt="Document Front"
                          className="w-36 h-24 object-cover group-hover/doc:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-ocean-950/40 opacity-0 group-hover/doc:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                          <FiMaximize2 size={13} /> Zoom
                        </div>
                      </div>
                    </div>
                  )}
                  {primaryDocBack && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-ink-600 block">Document Back</span>
                      <div
                        className="relative group/doc cursor-pointer rounded-xl overflow-hidden border border-sand-300 hover:border-mint-500 shadow-sm transition-all"
                        onClick={() =>
                          setSelectedImage({
                            src: primaryDocBack,
                            title: `${tourist.firstName} ${tourist.lastName} - Document Back`,
                          })
                        }
                      >
                        <img
                          src={primaryDocBack}
                          alt="Document Back"
                          className="w-36 h-24 object-cover group-hover/doc:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-ocean-950/40 opacity-0 group-hover/doc:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                          <FiMaximize2 size={13} /> Zoom
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Accompanying Children Tabs & Expandable Details */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sand-200 pb-3">
              <h3 className="text-base font-bold text-ink-900 font-serif flex items-center">
                <FiUsers className="mr-2 text-mint-600" size={18} />
                Accompanying Children ({children.length})
              </h3>

              {/* Child Tabs Navigation */}
              {children.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {children.map((child, idx) => {
                    const isSelected = activeChildTab === idx;
                    return (
                      <button
                        key={child.customerId || idx}
                        type="button"
                        onClick={() => setActiveChildTab(idx)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isSelected
                            ? "bg-ocean-800 text-mint-400 shadow-sm"
                            : "bg-sand-100 text-ink-700 hover:bg-sand-200"
                        }`}
                      >
                        Child {idx + 1}: {child.firstName || `Member #${idx + 1}`}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setActiveChildTab("all")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                      activeChildTab === "all"
                        ? "bg-ocean-800 text-mint-400 shadow-sm"
                        : "bg-sand-100 text-ink-700 hover:bg-sand-200"
                    }`}
                  >
                    <FiGrid size={12} />
                    <span>View All</span>
                  </button>
                </div>
              )}
            </div>

            {children.length === 0 ? (
              <div className="bg-sand-50 rounded-xl p-6 text-center text-xs text-ink-400 italic border border-sand-200/60">
                No accompanying children or additional group members registered under this tourist application.
              </div>
            ) : (
              <div className="space-y-4">
                {children
                  .filter((_, idx) => activeChildTab === "all" || activeChildTab === idx)
                  .map((child) => {
                    const originalIdx = children.indexOf(child);
                    const childPhoto = formatImageSrc(
                      child.customerImages || child.photo
                    );
                    const childDocFront = formatImageSrc(child.documentFront);
                    const childDocBack = formatImageSrc(child.documentBack);

                    const childContact = isMeaningful(child.contactNo)
                      ? child.contactNo
                      : isMeaningful(child.contactNumber)
                      ? child.contactNumber
                      : null;

                    return (
                      <div
                        key={child.customerId || originalIdx}
                        className="bg-white rounded-2xl p-5 border border-sand-200 shadow-sm space-y-4 hover:border-sand-300 transition-colors"
                      >
                        {/* Child Profile Top Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-sand-100">
                          <div className="flex items-center space-x-3.5">
                            {/* Child Photo Thumbnail with click zoom */}
                            <div className="relative group/childImg flex-shrink-0">
                              {childPhoto ? (
                                <img
                                  src={childPhoto}
                                  alt={`${child.firstName} ${child.lastName}`}
                                  className="w-14 h-14 rounded-xl object-cover border-2 border-sand-200 cursor-pointer group-hover/childImg:border-mint-500 shadow-sm transition-all"
                                  onClick={() =>
                                    setSelectedImage({
                                      src: childPhoto,
                                      title: `Child ${originalIdx + 1}: ${child.firstName} ${child.lastName} - Profile Photo`,
                                    })
                                  }
                                />
                              ) : (
                                <div className="w-14 h-14 rounded-xl bg-ocean-800 text-mint-400 font-serif font-bold text-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                                  {child.firstName?.charAt(0) || "C"}
                                </div>
                              )}
                              {childPhoto && (
                                <span className="absolute -bottom-1 -right-1 p-0.5 bg-ocean-900 text-mint-400 rounded text-[9px] font-bold opacity-0 group-hover/childImg:opacity-100 transition-opacity">
                                  <FiMaximize2 size={9} />
                                </span>
                              )}
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-serif font-bold text-ink-900 text-base">
                                  {`${child.firstName} ${child.lastName}`}
                                </h4>
                                <span className="badge-tag bg-ocean-50 text-ocean-700 border border-ocean-100 text-[10px] py-0.5 px-2">
                                  Child #{originalIdx + 1}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 text-xs text-ink-400 mt-0.5">
                                {child.customerId && (
                                  <span className="font-mono">Customer ID: #{child.customerId}</span>
                                )}
                                {child.parentCustomerId && child.parentCustomerId > 0 && (
                                  <>
                                    <span>•</span>
                                    <span className="font-mono">Parent ID: #{child.parentCustomerId}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {child.gender && (
                            <span className="self-start sm:self-center badge-tag bg-sand-100 text-ink-700 border border-sand-200 text-xs">
                              {child.gender}
                            </span>
                          )}
                        </div>

                        {/* Child Detailed Field Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                          <div>
                            <span className="text-ink-400 uppercase font-semibold block">Date of Birth</span>
                            <p className="font-semibold text-ink-800 mt-0.5 flex items-center">
                              <FiCalendar className="mr-1 text-ink-400" size={12} />
                              {isMeaningful(child.dob) ? child.dob : "—"}
                            </p>
                          </div>
                          <div>
                            <span className="text-ink-400 uppercase font-semibold block">Email Address</span>
                            <p className="font-semibold text-ink-800 mt-0.5 flex items-center truncate">
                              <FiMail className="mr-1 text-ink-400 flex-shrink-0" size={12} />
                              <span className="truncate">{isMeaningful(child.email) ? child.email : "—"}</span>
                            </p>
                          </div>
                          <div>
                            <span className="text-ink-400 uppercase font-semibold block">Contact Number</span>
                            <p className="font-semibold text-ink-800 mt-0.5 flex items-center">
                              <FiPhone className="mr-1 text-ink-400" size={12} />
                              {childContact || "—"}
                            </p>
                          </div>
                          <div>
                            <span className="text-ink-400 uppercase font-semibold block">Gender</span>
                            <p className="font-semibold text-ink-800 mt-0.5">
                              {isMeaningful(child.gender) ? child.gender : "—"}
                            </p>
                          </div>
                        </div>

                        {isMeaningful(child.permanentAddress) && (
                          <div className="text-xs pt-2 border-t border-sand-100">
                            <span className="text-ink-400 uppercase font-semibold block">Permanent Address:</span>
                            <p className="font-semibold text-ink-800 mt-0.5 flex items-center">
                              <FiMapPin className="mr-1 text-ocean-600 flex-shrink-0" size={12} />
                              {child.permanentAddress}
                            </p>
                          </div>
                        )}

                        {/* Child Document Attachments (Front & Back Base64 Previews) */}
                        {(childDocFront || childDocBack) && (
                          <div className="pt-3 border-t border-sand-100">
                            <span className="text-xs font-bold text-ink-700 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                              <FiFileText className="text-ocean-600" size={13} />
                              Child Certified Identity Documents
                            </span>
                            <div className="flex flex-wrap gap-4">
                              {childDocFront && (
                                <div className="space-y-1">
                                  <span className="text-[11px] font-semibold text-ink-600 block">Document Front</span>
                                  <div
                                    className="relative group/doc cursor-pointer rounded-xl overflow-hidden border border-sand-300 hover:border-mint-500 shadow-sm transition-all"
                                    onClick={() =>
                                      setSelectedImage({
                                        src: childDocFront,
                                        title: `Child ${originalIdx + 1}: ${child.firstName} ${child.lastName} - Document Front`,
                                      })
                                    }
                                  >
                                    <img
                                      src={childDocFront}
                                      alt="Child Document Front"
                                      className="w-32 h-20 object-cover group-hover/doc:scale-105 transition-transform duration-200"
                                    />
                                    <div className="absolute inset-0 bg-ocean-950/40 opacity-0 group-hover/doc:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                                      <FiMaximize2 size={12} /> Zoom
                                    </div>
                                  </div>
                                </div>
                              )}
                              {childDocBack && (
                                <div className="space-y-1">
                                  <span className="text-[11px] font-semibold text-ink-600 block">Document Back</span>
                                  <div
                                    className="relative group/doc cursor-pointer rounded-xl overflow-hidden border border-sand-300 hover:border-mint-500 shadow-sm transition-all"
                                    onClick={() =>
                                      setSelectedImage({
                                        src: childDocBack,
                                        title: `Child ${originalIdx + 1}: ${child.firstName} ${child.lastName} - Document Back`,
                                      })
                                    }
                                  >
                                    <img
                                      src={childDocBack}
                                      alt="Child Document Back"
                                      className="w-32 h-20 object-cover group-hover/doc:scale-105 transition-transform duration-200"
                                    />
                                    <div className="absolute inset-0 bg-ocean-950/40 opacity-0 group-hover/doc:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                                      <FiMaximize2 size={12} /> Zoom
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Accessible Full-Screen Document/Photo Lightbox */}
      {selectedImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image Preview"
          className="fixed inset-0 bg-ocean-950/85 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white p-3 rounded-2xl shadow-2xl border border-sand-200 flex flex-col space-y-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-2 pt-1">
              <h4 className="text-sm font-bold text-ink-900 font-serif truncate pr-4">
                {selectedImage.title}
              </h4>
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="p-1.5 bg-sand-100 hover:bg-coral-500 hover:text-white text-ink-700 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-ocean-500"
                title="Close image view (Esc)"
              >
                <FiX size={16} />
              </button>
            </div>
            <div className="overflow-auto max-h-[80vh] flex items-center justify-center bg-sand-50 rounded-xl p-2">
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="max-h-[75vh] w-auto object-contain rounded-lg shadow-sm"
              />
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

export default TouristCardBrief;
