import React, { useState, useEffect } from "react";
import { TouristType } from "../../common/types";
import { FiChevronDown, FiX, FiPhone, FiMapPin, FiUsers, FiMail, FiCalendar, FiUser } from "react-icons/fi";

const TouristCardBrief: React.FC<{ tourist: TouristType }> = ({ tourist }) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedImage) {
        setSelectedImage(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage]);

  return (
    <article className="bg-white rounded-2xl p-6 border border-sand-200 shadow-card hover:shadow-card-hover transition-all duration-200">
      {/* Primary Overview Row */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        {/* Left - Portrait Photo + Identity Details */}
        <div className="flex items-start space-x-4">
          <div className="relative group/img flex-shrink-0">
            <img
              src={tourist.photo}
              alt={`${tourist.firstName} ${tourist.lastName}`}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-sand-200 shadow-sm group-hover/img:border-mint-500 cursor-pointer transition-colors"
              onClick={() => setSelectedImage(tourist.photo)}
            />
            <span className="absolute -bottom-1 -right-1 p-1 bg-ocean-900 text-mint-400 rounded-lg text-[10px] font-bold shadow-sm opacity-0 group-hover/img:opacity-100 transition-opacity">
              View
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-ink-900 font-serif">
                {`${tourist.firstName} ${tourist.lastName}`}
              </h2>
              <span className="badge-tag bg-mint-50 text-mint-600 border border-mint-200/80">
                Primary Applicant
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-600">
              <span className="flex items-center">
                <FiMapPin className="mr-1.5 text-ocean-600 flex-shrink-0" size={13} />
                {tourist.permanentAddress}
              </span>
              <span className="flex items-center">
                <FiPhone className="mr-1.5 text-ocean-600 flex-shrink-0" size={13} />
                {tourist.contactNumber}
              </span>
              <span className="flex items-center font-semibold text-ocean-700">
                <FiUsers className="mr-1.5 text-mint-600 flex-shrink-0" size={13} />
                {tourist.members?.length ?? 0} Group Members
              </span>
            </div>
          </div>
        </div>

        {/* Right - Expand/Collapse Action */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          className="self-end sm:self-start flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-sand-100 hover:bg-sand-200 text-ocean-800 text-xs font-bold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ocean-500"
        >
          <span>{expanded ? "Hide Details" : "View Group"}</span>
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
        <div className="mt-6 pt-6 border-t border-sand-100 space-y-6">
          {/* Primary Applicant Details Box */}
          <div className="bg-sand-50 rounded-xl p-5 border border-sand-200/80 space-y-4">
            <h3 className="text-sm font-bold text-ink-900 uppercase tracking-wider font-sans flex items-center">
              <FiUser className="mr-2 text-ocean-600" size={15} />
              Primary Applicant Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-ink-400 uppercase font-semibold">Gender</span>
                <p className="font-semibold text-ink-800 mt-0.5">{tourist.gender}</p>
              </div>
              <div>
                <span className="text-ink-400 uppercase font-semibold">Date of Birth</span>
                <p className="font-semibold text-ink-800 mt-0.5 flex items-center">
                  <FiCalendar className="mr-1 text-ink-400" size={12} />
                  {tourist.dob}
                </p>
              </div>
              <div>
                <span className="text-ink-400 uppercase font-semibold">Email Address</span>
                <p className="font-semibold text-ink-800 mt-0.5 flex items-center">
                  <FiMail className="mr-1 text-ink-400" size={12} />
                  {tourist.email}
                </p>
              </div>
            </div>

            {/* Document Attachments */}
            <div className="pt-3 border-t border-sand-200/60">
              <span className="text-xs font-bold text-ink-700 uppercase tracking-wider block mb-2">
                Identity Credentials (Aadhaar / ID Card)
              </span>
              <div className="flex flex-wrap gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-ink-600">Document Front</span>
                  <img
                    src={tourist.documentFront}
                    alt="Document Front"
                    className="w-32 h-20 object-cover rounded-xl border border-sand-300 hover:border-mint-500 cursor-pointer shadow-sm transition-all hover:scale-105"
                    onClick={() => setSelectedImage(tourist.documentFront)}
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-ink-600">Document Back</span>
                  <img
                    src={tourist.documentBack}
                    alt="Document Back"
                    className="w-32 h-20 object-cover rounded-xl border border-sand-300 hover:border-mint-500 cursor-pointer shadow-sm transition-all hover:scale-105"
                    onClick={() => setSelectedImage(tourist.documentBack)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Group Members Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-ink-900 font-serif flex items-center">
                <FiUsers className="mr-2 text-mint-600" size={18} />
                Accompanying Group Members ({tourist.members?.length ?? 0})
              </h3>
              {tourist.members?.length === 0 && (
                <span className="text-xs text-ink-400 italic">No additional members</span>
              )}
            </div>

            {tourist.members && tourist.members.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tourist.members.map((member, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl p-4 border border-sand-200 shadow-sm space-y-3"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={member.photo}
                        alt={`${member.firstName} ${member.lastName}`}
                        className="w-12 h-12 rounded-xl object-cover border border-sand-200 cursor-pointer hover:border-mint-500 transition-colors flex-shrink-0"
                        onClick={() => setSelectedImage(member.photo)}
                      />
                      <div className="min-w-0">
                        <h4 className="font-serif font-bold text-ink-900 text-sm truncate">
                          {`${member.firstName} ${member.lastName}`}
                        </h4>
                        <p className="text-xs text-ink-400 truncate">{member.email}</p>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-ink-600 pt-2 border-t border-sand-100">
                      <div className="flex justify-between">
                        <span className="text-ink-400">Phone:</span>
                        <span className="font-medium text-ink-800">{member.contactNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink-400">DOB / Gender:</span>
                        <span className="font-medium text-ink-800">
                          {member.dob} • {member.gender}
                        </span>
                      </div>
                      <div className="text-[11px] text-ink-600 truncate pt-1">
                        <span className="text-ink-400">Address:</span> {member.permanentAddress}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <img
                        src={member.documentFront}
                        alt="Front ID"
                        title="View Document Front"
                        className="w-1/2 h-14 object-cover rounded-lg border border-sand-200 cursor-pointer hover:border-mint-500 transition-all"
                        onClick={() => setSelectedImage(member.documentFront)}
                      />
                      <img
                        src={member.documentBack}
                        alt="Back ID"
                        title="View Document Back"
                        className="w-1/2 h-14 object-cover rounded-lg border border-sand-200 cursor-pointer hover:border-mint-500 transition-all"
                        onClick={() => setSelectedImage(member.documentBack)}
                      />
                    </div>
                  </div>
                ))}
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
          className="fixed inset-0 bg-ocean-900/80 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white p-2 rounded-2xl shadow-2xl border border-sand-200">
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute -top-3 -right-3 p-2 bg-ocean-900 hover:bg-coral-500 text-white rounded-full shadow-lg transition-colors focus-visible:ring-2 focus-visible:ring-white"
              title="Close image view (Esc)"
            >
              <FiX size={18} />
            </button>
            <img
              src={selectedImage}
              alt="High Resolution Preview"
              className="max-h-[80vh] w-auto object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </article>
  );
};

export default TouristCardBrief;

