import React, { useState, useEffect } from "react";
import { LabourType } from "../../common/types";
import { useSaveLabourRemark, useUpdateLabourStatus } from "../../utils/base.hooks";
import {
  FiChevronDown,
  FiX,
  FiMapPin,
  FiPhone,
  FiCalendar,
  FiUser,
  FiCheckCircle,
  FiXCircle,
  FiSave,
} from "react-icons/fi";

const LabourCardBrief: React.FC<{ labour: LabourType; status?: string }> = ({
  labour,
  status,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const { saveRemark, isLoading: isSaving, error: saveError } = useSaveLabourRemark();
  const { updateStatus, isLoading: isUpdating, error: updateError } = useUpdateLabourStatus();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedImage) {
        setSelectedImage(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage]);

  const handleSave = async () => {
    if (!inputValue.trim()) {
      return;
    }
    try {
      await saveRemark({ value: inputValue });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      setInputValue("");
    } catch {
      // error state is managed by the hook
    }
  };

  const handleCancel = () => {
    setInputValue("");
  };

  async function updateLabourCardStatus(): Promise<void> {
    let statusId = 0;
    if (status === "Approve") {
      statusId = 3;
    } else if (status === "Process") {
      statusId = 2;
    }
    try {
      await updateStatus({ labourId: labour.id, statusId, remark: inputValue });
      setActionSuccess(`Application successfully marked as ${status}d.`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch {
      // error state is managed by the hook
    }
  }

  async function handleReject() {
    try {
      await updateStatus({ labourId: labour.id, statusId: 0, remark: inputValue });
      setActionSuccess("Application marked as Rejected.");
      setTimeout(() => setActionSuccess(null), 3000);
    } catch {
      // error state is managed by the hook
    }
  }

  const fullName = [labour.firstName, labour.middleName, labour.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <article className="bg-white rounded-2xl p-6 border border-sand-200 shadow-card hover:shadow-card-hover transition-all duration-200">
      {/* Overview Top Row */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        {/* Left - Photo + Basic Identity */}
        <div className="flex items-start space-x-4">
          <div className="relative group/img flex-shrink-0">
            <img
              src={labour.photo}
              alt={fullName}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-sand-200 shadow-sm group-hover/img:border-mint-500 cursor-pointer transition-colors"
              onClick={() => setSelectedImage(labour.photo)}
            />
            <span className="absolute -bottom-1 -right-1 p-1 bg-ocean-900 text-mint-400 rounded-lg text-[10px] font-bold shadow-sm opacity-0 group-hover/img:opacity-100 transition-opacity">
              View
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-ink-900 font-serif">
                {fullName}
              </h2>
              <span className="badge-tag bg-ocean-50 text-ocean-700 border border-ocean-200/80">
                Labour Record
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-600">
              <span className="flex items-center">
                <FiMapPin className="mr-1.5 text-ocean-600 flex-shrink-0" size={13} />
                {labour.permanentAddress}
              </span>
              <span className="flex items-center">
                <FiPhone className="mr-1.5 text-ocean-600 flex-shrink-0" size={13} />
                {labour.contactNumber}
              </span>
              <span className="flex items-center font-medium text-ink-400">
                <FiCalendar className="mr-1.5 text-ink-400 flex-shrink-0" size={13} />
                Filed on: {labour.createdAt}
              </span>
            </div>
          </div>
        </div>

        {/* Right - Expand/Collapse Toggle Button */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          className="self-end sm:self-start flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-sand-100 hover:bg-sand-200 text-ocean-800 text-xs font-bold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ocean-500"
        >
          <span>{expanded ? "Hide Details" : "View Record"}</span>
          <FiChevronDown
            size={16}
            className={`transform transition-transform duration-200 ${
              expanded ? "rotate-180 text-mint-600" : ""
            }`}
          />
        </button>
      </div>

      {/* Expanded Profile & Documents Section */}
      {expanded && (
        <div className="mt-6 pt-6 border-t border-sand-100 space-y-6">
          {/* Details Box */}
          <div className="bg-sand-50 rounded-xl p-5 border border-sand-200/80 space-y-4">
            <h3 className="text-sm font-bold text-ink-900 uppercase tracking-wider font-sans flex items-center">
              <FiUser className="mr-2 text-ocean-600" size={15} />
              Applicant Verification Data
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-ink-400 uppercase font-semibold">Gender</span>
                <p className="font-semibold text-ink-800 mt-0.5">{labour.gender}</p>
              </div>
              <div>
                <span className="text-ink-400 uppercase font-semibold">Date of Birth</span>
                <p className="font-semibold text-ink-800 mt-0.5 flex items-center">
                  <FiCalendar className="mr-1 text-ink-400" size={12} />
                  {labour.dob}
                </p>
              </div>
              <div>
                <span className="text-ink-400 uppercase font-semibold">Current Residence</span>
                <p className="font-semibold text-ink-800 mt-0.5 flex items-center">
                  <FiMapPin className="mr-1 text-ink-400" size={12} />
                  {labour.currentAddress}
                </p>
              </div>
            </div>

            {/* Document Attachments */}
            <div className="pt-3 border-t border-sand-200/60">
              <span className="text-xs font-bold text-ink-700 uppercase tracking-wider block mb-2">
                Certified Identification Documents
              </span>
              <div className="flex flex-wrap gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-ink-600">Document Front</span>
                  <img
                    src={labour.documentFront}
                    alt="Document Front"
                    className="w-32 h-20 object-cover rounded-xl border border-sand-300 hover:border-mint-500 cursor-pointer shadow-sm transition-all hover:scale-105"
                    onClick={() => setSelectedImage(labour.documentFront)}
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-ink-600">Document Back</span>
                  <img
                    src={labour.documentBack}
                    alt="Document Back"
                    className="w-32 h-20 object-cover rounded-xl border border-sand-300 hover:border-mint-500 cursor-pointer shadow-sm transition-all hover:scale-105"
                    onClick={() => setSelectedImage(labour.documentBack)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Officer Verification & Triage Action Section */}
          {status && status.length > 0 && (
            <div className="bg-ocean-50/50 rounded-xl p-5 border border-ocean-100 space-y-4">
              <h3 className="text-sm font-bold text-ocean-900 font-serif flex items-center justify-between">
                <span>Administrative Triage & Status Actions</span>
                <span className="badge-tag bg-ocean-700 text-white text-[10px]">
                  Action Required: {status}
                </span>
              </h3>

              {/* Remarks Input */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-sand-300 bg-white text-sm text-ink-800 focus-visible:ring-2 focus-visible:ring-ocean-500"
                  placeholder="Enter officer notes or compliance remarks..."
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving || !inputValue.trim()}
                    className="px-4 py-2.5 rounded-xl bg-ocean-700 hover:bg-ocean-600 text-white font-semibold text-xs transition-colors flex items-center space-x-1.5 disabled:opacity-50"
                  >
                    <FiSave size={14} />
                    <span>{isSaving ? "Saving..." : "Save Note"}</span>
                  </button>
                  {inputValue && (
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-3 py-2.5 rounded-xl bg-sand-200 hover:bg-sand-300 text-ink-700 text-xs font-semibold transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Feedback Notifications */}
              {saveSuccess && (
                <p className="text-mint-600 text-xs font-semibold flex items-center">
                  <FiCheckCircle className="mr-1" /> Remark saved successfully.
                </p>
              )}
              {actionSuccess && (
                <p className="text-mint-600 text-xs font-semibold flex items-center">
                  <FiCheckCircle className="mr-1" /> {actionSuccess}
                </p>
              )}
              {saveError && <p className="text-coral-600 text-xs">{saveError}</p>}
              {updateError && <p className="text-coral-600 text-xs">{updateError}</p>}

              {/* Pipeline Stage Transition Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-ocean-100">
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={isUpdating}
                  className="px-5 py-2.5 rounded-xl bg-coral-50 hover:bg-coral-500 text-coral-600 hover:text-white border border-coral-200 font-bold text-xs shadow-sm transition-all duration-200 flex items-center space-x-1.5 focus-visible:ring-2 focus-visible:ring-coral-400 disabled:opacity-50"
                >
                  <FiXCircle size={15} />
                  <span>Reject Application</span>
                </button>

                <button
                  type="button"
                  onClick={updateLabourCardStatus}
                  disabled={isUpdating}
                  className="px-6 py-2.5 rounded-xl bg-mint-500 hover:bg-mint-400 text-ocean-900 font-bold text-xs shadow-md transition-all duration-200 flex items-center space-x-1.5 focus-visible:ring-2 focus-visible:ring-ocean-500 disabled:opacity-50"
                >
                  <FiCheckCircle size={15} />
                  <span>
                    {isUpdating ? "Updating..." : `${status} Application`}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Accessible Full-Screen Document Lightbox */}
      {selectedImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Document Preview"
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

export default LabourCardBrief;

