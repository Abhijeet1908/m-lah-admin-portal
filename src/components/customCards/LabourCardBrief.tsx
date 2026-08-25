import React, { useState, useEffect } from "react";
import { LabourType, LabourStatusEnum } from "../../common/types";
import {
  useSaveLabourRemark,
  useUpdateLabourStatus,
  useGetUserDetails,
} from "../../utils/base.hooks";
import { formatImageSrc } from "./TouristCardBrief";
import {
  FiChevronDown,
  FiX,
  FiMapPin,
  FiPhone,
  FiCalendar,
  FiUser,
  FiCheckCircle,
  FiSave,
  FiShield,
  FiLock,
  FiAlertTriangle,
  FiClock,
  FiRotateCcw,
  FiSlash,
  FiArrowRight,
  FiFileText,
  FiCheckSquare,
  FiAward,
  FiInfo,
} from "react-icons/fi";

interface LabourCardBriefProps {
  labour: LabourType;
  status?: string; // Optional contextual status passed from parent tab
  onStatusUpdated?: () => void;
}

/** Check if a field value is valid and not empty, null, or placeholder */
export const isValidFieldValue = (val: any): boolean => {
  if (val === null || val === undefined) return false;
  if (typeof val === "boolean") return true;
  if (typeof val === "number") return true;
  if (typeof val === "string") {
    const trimmed = val.trim().toLowerCase();
    return (
      trimmed !== "" &&
      trimmed !== "null" &&
      trimmed !== "undefined" &&
      trimmed !== "string" &&
      trimmed !== "none"
    );
  }
  return false;
};

/** Format date and timestamps into readable local format */
export const formatDisplayDateTime = (dateStr?: string | null): string => {
  if (!isValidFieldValue(dateStr)) return "—";
  try {
    const d = new Date(dateStr as string);
    if (isNaN(d.getTime())) return String(dateStr);

    // If string has time component (e.g. 2026-08-25T18:28:25)
    if ((dateStr as string).includes("T") || (dateStr as string).includes(":")) {
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    // Simple date (e.g. 2026-08-25)
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return String(dateStr);
  }
};

export const getLabourStatusMeta = (statusId?: number | null) => {
  switch (statusId) {
    case LabourStatusEnum.Submitted:
    case 1:
      return {
        label: "Submitted",
        badgeColor: "bg-coral-50 text-coral-700 border-coral-200",
        dotColor: "bg-coral-500",
        description: "Intake Awaiting Review",
      };
    case LabourStatusEnum.Reviewed:
    case 2:
      return {
        label: "Processed (Reviewed)",
        badgeColor: "bg-ocean-50 text-ocean-700 border-ocean-200",
        dotColor: "bg-ocean-500",
        description: "Reviewed & Pending Admin Approval",
      };
    case LabourStatusEnum.Approved:
    case 3:
      return {
        label: "Approved & Certified",
        badgeColor: "bg-mint-50 text-mint-700 border-mint-200",
        dotColor: "bg-mint-500",
        description: "Officially Sanctioned & Certified",
      };
    case LabourStatusEnum.ReviewedPending:
    case 4:
      return {
        label: "Review Pending",
        badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
        dotColor: "bg-amber-500",
        description: "Requires Further Review or Clarification",
      };
    case LabourStatusEnum.Suspended:
    case 5:
      return {
        label: "Suspended",
        badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
        dotColor: "bg-rose-500",
        description: "Application Suspended / Expired",
      };
    default:
      return {
        label: "Registered",
        badgeColor: "bg-sand-100 text-ink-700 border-sand-300",
        dotColor: "bg-ink-400",
        description: "Labour Registry",
      };
  }
};

const LabourCardBrief: React.FC<LabourCardBriefProps> = ({
  labour,
  status,
  onStatusUpdated,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [inputValue, setInputValue] = useState(
    isValidFieldValue(labour.remark) ? (labour.remark as string) : ""
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const { saveRemark, isLoading: isSaving, error: saveError } = useSaveLabourRemark();
  const { updateStatus, isLoading: isUpdating, error: updateError } = useUpdateLabourStatus();

  // Active status resolution
  const currentStatusId =
    labour.statusId ??
    (status === "Process"
      ? LabourStatusEnum.Submitted
      : status === "Approve"
      ? LabourStatusEnum.Reviewed
      : LabourStatusEnum.Approved);

  const statusMeta = getLabourStatusMeta(currentStatusId);

  // Expiration check (validUpTo or validUpto)
  const validityDateStr = labour.validUpTo || labour.validUpto || labour.validityDate;
  const isExpired = validityDateStr
    ? new Date(validityDateStr) < new Date()
    : false;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedImage) {
        setSelectedImage(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage]);

  const handleSaveNoteOnly = async () => {
    if (!inputValue.trim()) return;
    try {
      await saveRemark({ value: inputValue });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      // error state managed by hook
    }
  };

  const handleExecuteStatusTransition = async (
    targetStatusId: number,
    targetLabel: string
  ) => {
    const numericLabourId = Number(labour.labourId ?? labour.id ?? 0);
    try {
      await updateStatus({
        labourId: numericLabourId,
        statusId: targetStatusId,
        remark: inputValue,
      });
      setActionSuccess(`Application status successfully updated to "${targetLabel}".`);
      if (onStatusUpdated) {
        onStatusUpdated();
      }
      setTimeout(() => setActionSuccess(null), 3500);
    } catch {
      // error state managed by hook
    }
  };

  // Role resolution
  const { user } = useGetUserDetails();
  const storedRole = localStorage.getItem("role") || "";
  const storedRoleId = localStorage.getItem("roleId")
    ? Number(localStorage.getItem("roleId"))
    : null;
  const roleId = user?.roleId ?? storedRoleId;
  const rawRole = (user?.role || storedRole || (roleId === 1 ? "admin" : "reviewer")).toLowerCase();
  const isAdmin = roleId === 1 || rawRole.includes("admin");
  const isReviewer =
    roleId === 2 ||
    rawRole.includes("reviewer") ||
    rawRole.includes("officer") ||
    rawRole.includes("user");

  const fullName = [labour.firstName, labour.middleName, labour.lastName]
    .filter(isValidFieldValue)
    .join(" ");

  const labourPhoto = formatImageSrc(labour.photo);
  const labourDocFront = formatImageSrc(labour.documentFront);
  const labourDocBack = formatImageSrc(labour.documentBack);

  return (
    <article className="bg-white rounded-2xl p-6 border border-sand-200 shadow-card hover:shadow-card-hover transition-all duration-200">
      {/* Overview Top Row */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        {/* Left - Photo + Basic Identity */}
        <div className="flex items-start space-x-4">
          <div className="relative group/img flex-shrink-0">
            {labourPhoto ? (
              <img
                src={labourPhoto}
                alt={fullName || "Labour applicant"}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-sand-200 shadow-sm group-hover/img:border-mint-500 cursor-pointer transition-colors"
                onClick={() => setSelectedImage(labourPhoto)}
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-ocean-800 text-mint-400 font-serif font-bold text-xl flex items-center justify-center border-2 border-sand-200 shadow-sm">
                {labour.firstName?.charAt(0) || "L"}
              </div>
            )}
            {labourPhoto && (
              <span className="absolute -bottom-1 -right-1 p-1 bg-ocean-900 text-mint-400 rounded-lg text-[10px] font-bold shadow-sm opacity-0 group-hover/img:opacity-100 transition-opacity">
                View
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-ink-900 font-serif">
                {fullName || "Labour Applicant"}
              </h2>
              {isValidFieldValue(labour.labourId || labour.id) && (
                <span className="badge-tag bg-ocean-50 text-ocean-700 border border-ocean-200/80">
                  Record #{labour.labourId || labour.id}
                </span>
              )}

              {/* Status Badge */}
              <span
                className={`badge-tag border flex items-center gap-1.5 ${statusMeta.badgeColor}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dotColor}`} />
                {statusMeta.label}
              </span>

              {/* Verification & Approval Badges */}
              {labour.isVerified === true && (
                <span className="badge-tag bg-mint-50 text-mint-700 border border-mint-200 flex items-center gap-1">
                  <FiCheckCircle size={11} />
                  Verified
                </span>
              )}
              {labour.isApproved === true && (
                <span className="badge-tag bg-mint-50 text-mint-700 border border-mint-200 flex items-center gap-1">
                  <FiAward size={11} />
                  Approved
                </span>
              )}

              {/* Expiration warning if applicable */}
              {isExpired && (
                <span className="badge-tag bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                  <FiAlertTriangle size={12} />
                  Expired ({formatDisplayDateTime(validityDateStr)})
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-600">
              {isValidFieldValue(labour.permanentAddress) && (
                <span className="flex items-center">
                  <FiMapPin className="mr-1.5 text-ocean-600 flex-shrink-0" size={13} />
                  {labour.permanentAddress}
                </span>
              )}
              {isValidFieldValue(labour.contactNumber) && (
                <span className="flex items-center">
                  <FiPhone className="mr-1.5 text-ocean-600 flex-shrink-0" size={13} />
                  {labour.contactNumber}
                </span>
              )}
              {isValidFieldValue(labour.createdAt) && (
                <span className="flex items-center font-medium text-ink-400">
                  <FiCalendar className="mr-1.5 text-ink-400 flex-shrink-0" size={13} />
                  Filed: {formatDisplayDateTime(labour.createdAt)}
                </span>
              )}
              {isValidFieldValue(validityDateStr) && !isExpired && (
                <span className="flex items-center text-mint-700 font-semibold">
                  <FiClock className="mr-1.5 text-mint-600 flex-shrink-0" size={13} />
                  Valid Upto: {formatDisplayDateTime(validityDateStr)}
                </span>
              )}
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

      {/* Expanded Profile & Complete Details Section */}
      {expanded && (
        <div className="mt-6 pt-6 border-t border-sand-100 space-y-6">
          {/* SECTION 1: Personal & Demographic Information */}
          <div className="bg-sand-50 rounded-2xl p-5 border border-sand-200/80 space-y-4">
            <h3 className="text-xs font-bold text-ink-900 uppercase tracking-wider font-sans flex items-center">
              <FiUser className="mr-2 text-ocean-600" size={15} />
              Applicant Personal &amp; Demographic Data
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              {isValidFieldValue(labour.firstName) && (
                <div>
                  <span className="text-ink-400 uppercase font-semibold text-[10px] block">
                    First Name
                  </span>
                  <p className="font-semibold text-ink-800 mt-0.5">{labour.firstName}</p>
                </div>
              )}

              {isValidFieldValue(labour.middleName) && (
                <div>
                  <span className="text-ink-400 uppercase font-semibold text-[10px] block">
                    Middle Name
                  </span>
                  <p className="font-semibold text-ink-800 mt-0.5">{labour.middleName}</p>
                </div>
              )}

              {isValidFieldValue(labour.lastName) && (
                <div>
                  <span className="text-ink-400 uppercase font-semibold text-[10px] block">
                    Last Name
                  </span>
                  <p className="font-semibold text-ink-800 mt-0.5">{labour.lastName}</p>
                </div>
              )}

              {isValidFieldValue(labour.gender) && (
                <div>
                  <span className="text-ink-400 uppercase font-semibold text-[10px] block">
                    Gender
                  </span>
                  <p className="font-semibold text-ink-800 mt-0.5 capitalize">{labour.gender}</p>
                </div>
              )}

              {isValidFieldValue(labour.dob) && (
                <div>
                  <span className="text-ink-400 uppercase font-semibold text-[10px] block">
                    Date of Birth
                  </span>
                  <p className="font-semibold text-ink-800 mt-0.5 flex items-center">
                    <FiCalendar className="mr-1 text-ink-400" size={12} />
                    {formatDisplayDateTime(labour.dob)}
                  </p>
                </div>
              )}

              {isValidFieldValue(labour.contactNumber) && (
                <div>
                  <span className="text-ink-400 uppercase font-semibold text-[10px] block">
                    Contact Number
                  </span>
                  <p className="font-semibold text-ink-800 mt-0.5 flex items-center">
                    <FiPhone className="mr-1 text-ink-400" size={12} />
                    {labour.contactNumber}
                  </p>
                </div>
              )}

              {isValidFieldValue(labour.permanentAddress) && (
                <div className="sm:col-span-2">
                  <span className="text-ink-400 uppercase font-semibold text-[10px] block">
                    Permanent Address
                  </span>
                  <p className="font-semibold text-ink-800 mt-0.5 flex items-start">
                    <FiMapPin className="mr-1 text-ink-400 mt-0.5 flex-shrink-0" size={12} />
                    <span>{labour.permanentAddress}</span>
                  </p>
                </div>
              )}

              {isValidFieldValue(labour.currentAddress) && (
                <div className="sm:col-span-2">
                  <span className="text-ink-400 uppercase font-semibold text-[10px] block">
                    Current Address
                  </span>
                  <p className="font-semibold text-ink-800 mt-0.5 flex items-start">
                    <FiMapPin className="mr-1 text-ink-400 mt-0.5 flex-shrink-0" size={12} />
                    <span>{labour.currentAddress}</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 2: Official Audit, Verification & Approval Trail */}
          <div className="bg-sand-50 rounded-2xl p-5 border border-sand-200/80 space-y-4">
            <h3 className="text-xs font-bold text-ink-900 uppercase tracking-wider font-sans flex items-center">
              <FiCheckSquare className="mr-2 text-mint-600" size={15} />
              Official Verification, Approval &amp; Validity Audit Trail
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              {/* Verification Status */}
              {labour.isVerified !== undefined && labour.isVerified !== null && (
                <div>
                  <span className="text-ink-400 uppercase font-semibold text-[10px] block">
                    Verification Status
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 font-bold mt-1 px-2.5 py-0.5 rounded-lg border text-[11px] ${
                      labour.isVerified
                        ? "bg-mint-50 text-mint-700 border-mint-200"
                        : "bg-sand-100 text-ink-600 border-sand-200"
                    }`}
                  >
                    <FiCheckCircle size={12} />
                    {labour.isVerified ? "Verified" : "Pending Verification"}
                  </span>
                </div>
              )}

              {/* Verified By */}
              {isValidFieldValue(labour.verifiedBy) && (
                <div>
                  <span className="text-ink-400 uppercase font-semibold text-[10px] block">
                    Verified By
                  </span>
                  <p className="font-semibold text-ink-800 mt-0.5 capitalize">
                    {labour.verifiedBy}
                  </p>
                </div>
              )}

              {/* Verified On */}
              {isValidFieldValue(labour.verifiedOn) && (
                <div>
                  <span className="text-ink-400 uppercase font-semibold text-[10px] block">
                    Verified On
                  </span>
                  <p className="font-semibold text-ink-800 mt-0.5">
                    {formatDisplayDateTime(labour.verifiedOn)}
                  </p>
                </div>
              )}

              {/* Approval Status */}
              {labour.isApproved !== undefined && labour.isApproved !== null && (
                <div>
                  <span className="text-ink-400 uppercase font-semibold text-[10px] block">
                    Approval Sanction
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 font-bold mt-1 px-2.5 py-0.5 rounded-lg border text-[11px] ${
                      labour.isApproved
                        ? "bg-mint-50 text-mint-700 border-mint-200"
                        : "bg-sand-100 text-ink-600 border-sand-200"
                    }`}
                  >
                    <FiAward size={12} />
                    {labour.isApproved ? "Approved" : "Pending Approval"}
                  </span>
                </div>
              )}

              {/* Approved By */}
              {isValidFieldValue(labour.approvedBy) && (
                <div>
                  <span className="text-ink-400 uppercase font-semibold text-[10px] block">
                    Approved By
                  </span>
                  <p className="font-semibold text-ink-800 mt-0.5 capitalize">
                    {labour.approvedBy}
                  </p>
                </div>
              )}

              {/* Approved On */}
              {isValidFieldValue(labour.approvedOn) && (
                <div>
                  <span className="text-ink-400 uppercase font-semibold text-[10px] block">
                    Approved On
                  </span>
                  <p className="font-semibold text-ink-800 mt-0.5">
                    {formatDisplayDateTime(labour.approvedOn)}
                  </p>
                </div>
              )}

              {/* Created At */}
              {isValidFieldValue(labour.createdAt) && (
                <div>
                  <span className="text-ink-400 uppercase font-semibold text-[10px] block">
                    Filing Created On
                  </span>
                  <p className="font-semibold text-ink-800 mt-0.5">
                    {formatDisplayDateTime(labour.createdAt)}
                  </p>
                </div>
              )}

              {/* Valid Up To */}
              {isValidFieldValue(validityDateStr) && (
                <div>
                  <span className="text-ink-400 uppercase font-semibold text-[10px] block">
                    Certification Valid Upto
                  </span>
                  <p
                    className={`font-semibold mt-0.5 flex items-center ${
                      isExpired ? "text-rose-700" : "text-mint-700"
                    }`}
                  >
                    <FiClock className="mr-1 flex-shrink-0" size={12} />
                    <span>
                      {formatDisplayDateTime(validityDateStr)}
                      {isExpired ? " (Expired)" : " (Active)"}
                    </span>
                  </p>
                </div>
              )}

              {/* Status String */}
              {isValidFieldValue(labour.status) && (
                <div>
                  <span className="text-ink-400 uppercase font-semibold text-[10px] block">
                    System Lifecycle Status
                  </span>
                  <p className="font-semibold text-ink-800 mt-0.5">{labour.status}</p>
                </div>
              )}

              {/* Existing Remark */}
              {isValidFieldValue(labour.remark) && (
                <div className="sm:col-span-2 md:col-span-3">
                  <span className="text-ink-400 uppercase font-semibold text-[10px] block">
                    Registered Officer Remark / Observation
                  </span>
                  <p className="font-medium text-ink-800 mt-0.5 p-2 bg-white rounded-lg border border-sand-200">
                    {labour.remark}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 3: Certified Identification Documents */}
          {(labourDocFront || labourDocBack) && (
            <div className="bg-sand-50 rounded-2xl p-5 border border-sand-200/80 space-y-3">
              <span className="text-xs font-bold text-ink-900 uppercase tracking-wider block">
                Certified Identification Documents
              </span>
              <div className="flex flex-wrap gap-4">
                {labourDocFront && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-ink-600 block">
                      Document Front
                    </span>
                    <img
                      src={labourDocFront}
                      alt="Document Front"
                      className="w-36 h-24 object-cover rounded-xl border border-sand-300 hover:border-mint-500 cursor-pointer shadow-sm transition-all hover:scale-105"
                      onClick={() => setSelectedImage(labourDocFront)}
                    />
                  </div>
                )}
                {labourDocBack && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-ink-600 block">
                      Document Back
                    </span>
                    <img
                      src={labourDocBack}
                      alt="Document Back"
                      className="w-36 h-24 object-cover rounded-xl border border-sand-300 hover:border-mint-500 cursor-pointer shadow-sm transition-all hover:scale-105"
                      onClick={() => setSelectedImage(labourDocBack)}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTION 4: Workflow Action & Review Remarks */}
          <div className="bg-ocean-50/50 rounded-2xl p-5 border border-ocean-100 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ocean-100 pb-3">
              <div className="flex items-center gap-2">
                <FiShield className="text-ocean-700" size={16} />
                <span className="text-sm font-bold text-ocean-900 font-serif">
                  Pipeline Status Actions &amp; Review Remarks
                </span>
              </div>
              <span className={`badge-tag text-[10px] border ${statusMeta.badgeColor}`}>
                Current: {statusMeta.label}
              </span>
            </div>

            {/* Review Notes Input */}
            <div>
              <label className="block text-[11px] font-bold text-ocean-900 uppercase tracking-wider mb-1.5">
                Review Remarks / Officer Notes
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-sand-300 bg-white text-sm text-ink-800 focus-visible:ring-2 focus-visible:ring-ocean-500"
                  placeholder="Enter reviewer feedback, compliance observations, or admin remarks..."
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveNoteOnly}
                    disabled={isSaving || !inputValue.trim()}
                    className="px-4 py-2.5 rounded-xl bg-ocean-700 hover:bg-ocean-600 text-white font-semibold text-xs transition-colors flex items-center space-x-1.5 disabled:opacity-50"
                  >
                    <FiSave size={14} />
                    <span>{isSaving ? "Saving..." : "Save Note"}</span>
                  </button>
                  {inputValue && (
                    <button
                      type="button"
                      onClick={() => setInputValue("")}
                      className="px-3 py-2.5 rounded-xl bg-sand-200 hover:bg-sand-300 text-ink-700 text-xs font-semibold transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Feedback Notifications */}
            {saveSuccess && (
              <p className="text-mint-600 text-xs font-semibold flex items-center">
                <FiCheckCircle className="mr-1" /> Note saved successfully.
              </p>
            )}
            {actionSuccess && (
              <p className="text-mint-600 text-xs font-semibold flex items-center">
                <FiCheckCircle className="mr-1" /> {actionSuccess}
              </p>
            )}
            {saveError && <p className="text-coral-600 text-xs">{saveError}</p>}
            {updateError && <p className="text-coral-600 text-xs">{updateError}</p>}

            {/* Workflow Action Buttons Guarded By Role and Current Status */}
            <div className="pt-2">
              {/* STAGE 1: SUBMITTED */}
              {currentStatusId === LabourStatusEnum.Submitted && (
                <div>
                  {isReviewer ? (
                    <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2 border-t border-ocean-100">
                      {/* Review Pending */}
                      <button
                        type="button"
                        onClick={() =>
                          handleExecuteStatusTransition(
                            LabourStatusEnum.ReviewedPending,
                            "Review Pending"
                          )
                        }
                        disabled={isUpdating}
                        className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-500 text-amber-700 hover:text-white border border-amber-300 font-bold text-xs shadow-sm transition-all duration-200 flex items-center space-x-1.5 focus-visible:ring-2 focus-visible:ring-amber-400 disabled:opacity-50"
                      >
                        <FiClock size={15} />
                        <span>Move to Review Pending</span>
                      </button>

                      {/* Suspend */}
                      <button
                        type="button"
                        onClick={() =>
                          handleExecuteStatusTransition(
                            LabourStatusEnum.Suspended,
                            "Suspended"
                          )
                        }
                        disabled={isUpdating}
                        className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-300 font-bold text-xs shadow-sm transition-all duration-200 flex items-center space-x-1.5 focus-visible:ring-2 focus-visible:ring-rose-400 disabled:opacity-50"
                      >
                        <FiSlash size={15} />
                        <span>Suspend Application</span>
                      </button>

                      {/* Process */}
                      <button
                        type="button"
                        onClick={() =>
                          handleExecuteStatusTransition(
                            LabourStatusEnum.Reviewed,
                            "Processed (Reviewed)"
                          )
                        }
                        disabled={isUpdating}
                        className="px-5 py-2.5 rounded-xl bg-mint-500 hover:bg-mint-400 text-ocean-900 font-bold text-xs shadow-md transition-all duration-200 flex items-center space-x-1.5 focus-visible:ring-2 focus-visible:ring-ocean-500 disabled:opacity-50"
                      >
                        <FiCheckCircle size={15} />
                        <span>{isUpdating ? "Processing..." : "Mark as Processed"}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-sand-100/90 border border-sand-200 text-xs text-ink-600 flex items-start space-x-2.5">
                      <FiLock className="text-ocean-700 flex-shrink-0 mt-0.5" size={15} />
                      <div>
                        <span className="font-bold text-ink-900 block">
                          Reviewer Action Required
                        </span>
                        <p className="text-ink-600 mt-0.5">
                          Only Verification Reviewers can triage Stage 1 submitted applications to Processed or place them in Review Pending. You have full read access as an Administrator.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STAGE 4: REVIEW PENDING */}
              {currentStatusId === LabourStatusEnum.ReviewedPending && (
                <div>
                  {isReviewer ? (
                    <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2 border-t border-ocean-100">
                      {/* Return to Submitted */}
                      <button
                        type="button"
                        onClick={() =>
                          handleExecuteStatusTransition(
                            LabourStatusEnum.Submitted,
                            "Submitted"
                          )
                        }
                        disabled={isUpdating}
                        className="px-4 py-2.5 rounded-xl bg-sand-100 hover:bg-sand-300 text-ink-800 border border-sand-300 font-bold text-xs shadow-sm transition-all duration-200 flex items-center space-x-1.5 focus-visible:ring-2 focus-visible:ring-ocean-500 disabled:opacity-50"
                      >
                        <FiRotateCcw size={15} />
                        <span>Return to Submitted</span>
                      </button>

                      {/* Mark as Processed */}
                      <button
                        type="button"
                        onClick={() =>
                          handleExecuteStatusTransition(
                            LabourStatusEnum.Reviewed,
                            "Processed (Reviewed)"
                          )
                        }
                        disabled={isUpdating}
                        className="px-5 py-2.5 rounded-xl bg-ocean-800 hover:bg-ocean-700 text-white font-bold text-xs shadow-md transition-all duration-200 flex items-center space-x-1.5 focus-visible:ring-2 focus-visible:ring-ocean-500 disabled:opacity-50"
                      >
                        <FiArrowRight size={15} />
                        <span>{isUpdating ? "Updating..." : "Mark as Processed"}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-sand-100/90 border border-sand-200 text-xs text-ink-600 flex items-start space-x-2.5">
                      <FiLock className="text-ocean-700 flex-shrink-0 mt-0.5" size={15} />
                      <div>
                        <span className="font-bold text-ink-900 block">
                          Reviewer Action Required
                        </span>
                        <p className="text-ink-600 mt-0.5">
                          Only Verification Reviewers can resolve Review Pending applications back to Submitted or forward to Processed. You have full read access as an Administrator.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STAGE 2: REVIEWED / PROCESSED */}
              {currentStatusId === LabourStatusEnum.Reviewed && (
                <div>
                  {isAdmin ? (
                    <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2 border-t border-ocean-100">
                      {/* Return to Review Pending */}
                      <button
                        type="button"
                        onClick={() =>
                          handleExecuteStatusTransition(
                            LabourStatusEnum.ReviewedPending,
                            "Review Pending"
                          )
                        }
                        disabled={isUpdating}
                        className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-500 text-amber-700 hover:text-white border border-amber-300 font-bold text-xs shadow-sm transition-all duration-200 flex items-center space-x-1.5 focus-visible:ring-2 focus-visible:ring-amber-400 disabled:opacity-50"
                      >
                        <FiClock size={15} />
                        <span>Return to Review Pending</span>
                      </button>

                      {/* Suspend */}
                      <button
                        type="button"
                        onClick={() =>
                          handleExecuteStatusTransition(
                            LabourStatusEnum.Suspended,
                            "Suspended"
                          )
                        }
                        disabled={isUpdating}
                        className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-300 font-bold text-xs shadow-sm transition-all duration-200 flex items-center space-x-1.5 focus-visible:ring-2 focus-visible:ring-rose-400 disabled:opacity-50"
                      >
                        <FiSlash size={15} />
                        <span>Suspend Application</span>
                      </button>

                      {/* Approve */}
                      <button
                        type="button"
                        onClick={() =>
                          handleExecuteStatusTransition(
                            LabourStatusEnum.Approved,
                            "Approved & Certified"
                          )
                        }
                        disabled={isUpdating}
                        className="px-5 py-2.5 rounded-xl bg-mint-500 hover:bg-mint-400 text-ocean-900 font-bold text-xs shadow-md transition-all duration-200 flex items-center space-x-1.5 focus-visible:ring-2 focus-visible:ring-ocean-500 disabled:opacity-50"
                      >
                        <FiCheckCircle size={15} />
                        <span>{isUpdating ? "Approving..." : "Approve & Certify"}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-sand-100/90 border border-sand-200 text-xs text-ink-600 flex items-start space-x-2.5">
                      <FiLock className="text-ocean-700 flex-shrink-0 mt-0.5" size={15} />
                      <div>
                        <span className="font-bold text-ink-900 block">
                          Administrator Authorization Required
                        </span>
                        <p className="text-ink-600 mt-0.5">
                          Only Administrators can grant final certification and approval or return processed records to Review Pending. You have full read access as a Reviewer.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STAGE 3: APPROVED */}
              {currentStatusId === LabourStatusEnum.Approved && (
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-ocean-100">
                  <div className="flex items-center space-x-2 text-mint-700 font-semibold text-xs">
                    <FiCheckCircle size={16} />
                    <span>Application Sanctioned &amp; Permanently Certified</span>
                  </div>

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() =>
                        handleExecuteStatusTransition(
                          LabourStatusEnum.Suspended,
                          "Suspended"
                        )
                      }
                      disabled={isUpdating}
                      className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 font-bold text-xs shadow-sm transition-all duration-200 flex items-center space-x-1.5"
                    >
                      <FiSlash size={14} />
                      <span>Suspend Certification</span>
                    </button>
                  )}
                </div>
              )}

              {/* STAGE 5: SUSPENDED */}
              {currentStatusId === LabourStatusEnum.Suspended && (
                <div className="space-y-3 pt-2 border-t border-ocean-100">
                  <div className="flex items-center space-x-2 text-rose-700 font-semibold text-xs">
                    <FiAlertTriangle size={16} />
                    <span>
                      {isExpired
                        ? `Application Suspended due to Validity Expiration (${formatDisplayDateTime(
                            validityDateStr
                          )}).`
                        : "Application is currently in Suspended status."}
                    </span>
                  </div>

                  {(isReviewer || isAdmin) && (
                    <div className="flex flex-wrap items-center justify-end gap-2.5">
                      {isReviewer && (
                        <button
                          type="button"
                          onClick={() =>
                            handleExecuteStatusTransition(
                              LabourStatusEnum.Submitted,
                              "Submitted"
                            )
                          }
                          disabled={isUpdating}
                          className="px-4 py-2 rounded-xl bg-sand-100 hover:bg-sand-200 text-ink-800 border border-sand-300 font-bold text-xs shadow-sm transition-all flex items-center space-x-1.5"
                        >
                          <FiRotateCcw size={14} />
                          <span>Re-open to Submitted</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          handleExecuteStatusTransition(
                            LabourStatusEnum.ReviewedPending,
                            "Review Pending"
                          )
                        }
                        disabled={isUpdating}
                        className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-500 text-amber-700 hover:text-white border border-amber-300 font-bold text-xs shadow-sm transition-all flex items-center space-x-1.5"
                      >
                        <FiClock size={14} />
                        <span>Re-open to Review Pending</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
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
