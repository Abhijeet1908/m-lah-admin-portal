import React, { useState } from "react";
import { useGetAllUsers, useCreateUser } from "../utils/base.hooks";
import { CreateUserDTO, UserDetails } from "../common/types";
import {
  FiUsers,
  FiUserPlus,
  FiSearch,
  FiRefreshCw,
  FiMail,
  FiPhone,
  FiShield,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
  FiLock,
  FiUser,
} from "react-icons/fi";

const ROLE_OPTIONS = [
  { id: 1, name: "Admin", label: "Super Administrator", badgeColor: "bg-mint-50 text-mint-700 border-mint-200" },
  { id: 2, name: "Officer", label: "Verification Officer", badgeColor: "bg-ocean-50 text-ocean-700 border-ocean-200" },
  { id: 3, name: "User", label: "Standard Operator", badgeColor: "bg-sand-100 text-ink-700 border-sand-300" },
];

// ---------------------------------------------------------------------------
// Validation rules
// ---------------------------------------------------------------------------
interface FormErrors {
  firstName?: string;
  lastName?: string;
  userName?: string;
  email?: string;
  contactNo?: string;
  roleId?: string;
  password?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateForm(data: CreateUserDTO): FormErrors {
  const errors: FormErrors = {};

  if (!data.firstName || data.firstName.trim().length === 0) {
    errors.firstName = "First name is required.";
  } else if (data.firstName.trim().length < 2) {
    errors.firstName = "First name must be at least 2 characters.";
  }

  if (!data.lastName || data.lastName.trim().length === 0) {
    errors.lastName = "Last name is required.";
  } else if (data.lastName.trim().length < 2) {
    errors.lastName = "Last name must be at least 2 characters.";
  }

  if (!data.userName || data.userName.trim().length === 0) {
    errors.userName = "Username is required.";
  } else if (data.userName.trim().length < 3) {
    errors.userName = "Username must be at least 3 characters.";
  }

  if (!data.email || data.email.trim().length === 0) {
    errors.email = "Email address is required.";
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.email = "Enter a valid email address (e.g. user@domain.com).";
  }

  if (!data.contactNo || data.contactNo.trim().length === 0) {
    errors.contactNo = "Contact number is required.";
  } else if (!/^\d{10}$/.test(data.contactNo.trim())) {
    errors.contactNo = "Contact number must be exactly 10 digits (numbers only).";
  }

  if (!data.roleId) {
    errors.roleId = "Please select a departmental role.";
  }

  if (!data.password || data.password.trim().length === 0) {
    errors.password = "Password is required.";
  }

  return errors;
}

// ---------------------------------------------------------------------------
// Helper: input class with error state
// ---------------------------------------------------------------------------
function inputClass(base: string, hasError: boolean) {
  return `${base} ${
    hasError
      ? "border-red-400 bg-red-50/30 focus-visible:ring-red-400"
      : "border-sand-300 bg-sand-50/50 focus-visible:ring-ocean-500"
  }`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const UserManagement: React.FC = () => {
  const { users, loading, error, refetch } = useGetAllUsers();
  const { createUser, isLoading: isCreating, error: createError } = useCreateUser();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Form State
  const emptyForm: CreateUserDTO = {
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    contactNo: "",
    roleId: undefined,
    role: "",
    password: "",
  };

  const [formData, setFormData] = useState<CreateUserDTO>(emptyForm);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Strip non-numeric for contactNo
    if (name === "contactNo") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, contactNo: digitsOnly }));
      if (formErrors.contactNo) {
        setFormErrors((prev) => ({ ...prev, contactNo: undefined }));
      }
      return;
    }

    if (name === "roleId") {
      const selectedId = value === "" ? undefined : Number(value);
      const matched = selectedId ? ROLE_OPTIONS.find((r) => r.id === selectedId) : undefined;
      setFormData((prev) => ({
        ...prev,
        roleId: selectedId,
        role: matched ? matched.name : "",
      }));
      if (formErrors.roleId) setFormErrors((prev) => ({ ...prev, roleId: undefined }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      // Clear individual error on change
      if (formErrors[name as keyof FormErrors]) {
        setFormErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    }
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setFormData(emptyForm);
    setFormErrors({});
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await createUser(formData);
      setSuccessMessage(`User account "@${formData.userName}" created successfully.`);
      handleCloseModal();
      await refetch();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch {
      // Error handled by hook
    }
  };

  const filteredUsers = users.filter((u: UserDetails) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (u.userName && u.userName.toLowerCase().includes(term)) ||
      (u.firstName && u.firstName.toLowerCase().includes(term)) ||
      (u.lastName && u.lastName.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term)) ||
      (u.contactNo && u.contactNo.includes(term));

    const matchesRole =
      selectedRoleFilter === "all" ||
      (u.role && u.role.toLowerCase() === selectedRoleFilter.toLowerCase()) ||
      (selectedRoleFilter === "admin" && u.roleId === 1) ||
      (selectedRoleFilter === "officer" && u.roleId === 2) ||
      (selectedRoleFilter === "user" && u.roleId === 3);

    return matchesSearch && matchesRole;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header Banner */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-sand-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5 mb-2">
            <div className="p-2.5 bg-ocean-50 text-ocean-700 rounded-xl">
              <FiUsers size={22} />
            </div>
            <span className="badge-tag bg-ocean-50 text-ocean-700 border border-ocean-100">
              Access Control &amp; Accounts
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-ink-900 font-serif">
            User Accounts &amp; Permissions
          </h1>
          <p className="text-sm text-ink-600 mt-1">
            Provision departmental officers, configure access tiers, and audit authorized portal credentials.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={loading}
            title="Refresh user list"
            className="p-3 rounded-xl bg-sand-100 hover:bg-sand-200 text-ocean-800 transition-colors border border-sand-200 disabled:opacity-50"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} size={16} />
          </button>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-3 rounded-xl bg-mint-500 hover:bg-mint-400 text-ocean-900 font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2 focus-visible:ring-2 focus-visible:ring-ocean-500"
          >
            <FiUserPlus size={18} />
            <span>Create New User</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMessage && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-mint-50 border border-mint-200 text-mint-800 text-sm font-semibold flex items-center space-x-2.5 animate-fadeIn"
        >
          <FiCheckCircle className="text-mint-600 flex-shrink-0" size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-sand-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-400">
            <FiSearch size={16} />
          </div>
          <input
            type="text"
            placeholder="Search by name, username, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand-300 bg-sand-50/50 text-ink-900 text-xs sm:text-sm font-medium focus-visible:ring-2 focus-visible:ring-ocean-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-ink-600 uppercase tracking-wider hidden sm:inline">
            Role:
          </span>
          <select
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-sand-300 bg-white text-ink-800 text-xs sm:text-sm font-medium focus-visible:ring-2 focus-visible:ring-ocean-500"
          >
            <option value="all">All Roles</option>
            <option value="admin">Administrators</option>
            <option value="officer">Verification Officers</option>
            <option value="user">Standard Users</option>
          </select>

          <span className="text-xs text-ink-400 font-mono ml-2">
            ({filteredUsers.length} {filteredUsers.length === 1 ? "user" : "users"})
          </span>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="bg-white rounded-2xl p-6 border border-sand-200 shadow-card animate-pulse space-y-4"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-sand-200" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-sand-200 rounded w-2/3" />
                  <div className="h-3 bg-sand-100 rounded w-1/3" />
                </div>
              </div>
              <div className="h-3 bg-sand-100 rounded w-4/5" />
              <div className="h-3 bg-sand-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-coral-50 border border-coral-100 rounded-2xl p-6 text-center space-y-2">
          <div className="inline-flex p-3 bg-coral-100 text-coral-600 rounded-full">
            <FiAlertCircle size={24} />
          </div>
          <h3 className="font-serif font-bold text-ink-900 text-lg">Unable to Load User Accounts</h3>
          <p className="text-sm text-ink-600 max-w-md mx-auto">{error}</p>
        </div>
      )}

      {/* User Accounts Grid */}
      {!loading && !error && (
        <>
          {filteredUsers.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-sand-200 shadow-card space-y-3">
              <div className="inline-flex p-4 bg-sand-100 text-ink-400 rounded-full">
                <FiUsers size={32} />
              </div>
              <h3 className="font-serif font-bold text-ink-900 text-lg">
                No Matching User Accounts
              </h3>
              <p className="text-sm text-ink-600 max-w-md mx-auto">
                No users found matching your search criteria. Create a new user or adjust your filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((u: UserDetails, index: number) => {
                const fullName =
                  [u.firstName, u.lastName].filter(Boolean).join(" ") ||
                  u.userName ||
                  "Authorized User";

                const roleBadge =
                  ROLE_OPTIONS.find(
                    (r) =>
                      r.name.toLowerCase() === (u.role || "").toLowerCase() ||
                      r.id === u.roleId
                  ) || {
                    badgeColor: "bg-sand-100 text-ink-700 border-sand-300",
                    label: u.role || "Operator",
                  };

                const initials = (
                  (u.firstName?.charAt(0) || u.userName?.charAt(0) || "U") +
                  (u.lastName?.charAt(0) || "")
                ).toUpperCase();

                return (
                  <div
                    key={u.userId || index}
                    className="bg-white rounded-2xl p-6 border border-sand-200 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-12 w-12 rounded-full bg-ocean-800 text-mint-400 font-bold text-sm flex items-center justify-center border-2 border-mint-400/40 shadow-sm flex-shrink-0">
                            {initials}
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-ink-900 font-serif leading-tight">
                              {fullName}
                            </h3>
                            <span className="text-xs text-ink-400 font-mono">
                              @{u.userName || "user"}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`badge-tag border ${roleBadge.badgeColor} text-[10px] whitespace-nowrap`}
                        >
                          {roleBadge.label}
                        </span>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-sand-100 text-xs text-ink-600">
                        {u.email && (
                          <div className="flex items-center space-x-2">
                            <FiMail className="text-ocean-600 flex-shrink-0" size={13} />
                            <span className="truncate">{u.email}</span>
                          </div>
                        )}
                        {u.contactNo && (
                          <div className="flex items-center space-x-2">
                            <FiPhone className="text-ocean-600 flex-shrink-0" size={13} />
                            <span>{u.contactNo}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2 text-ink-400">
                          <FiShield className="text-ink-400 flex-shrink-0" size={13} />
                          <span>User ID: #{u.userId}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-sand-100 flex items-center justify-between text-[11px] text-ink-400">
                      <span className="inline-flex items-center text-mint-600 font-semibold">
                        <span className="h-2 w-2 rounded-full bg-mint-500 mr-1.5 animate-pulse" />
                        Active Access
                      </span>
                      <span>Security Level {u.roleId || 1}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Accessible Create User Modal */}
      {showCreateModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 bg-ocean-900/80 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-200"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full border border-sand-200 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              type="button"
              onClick={handleCloseModal}
              className="absolute top-5 right-5 p-2 rounded-full text-ink-400 hover:text-ink-900 hover:bg-sand-100 transition-colors"
            >
              <FiX size={18} />
            </button>

            {/* Header */}
            <div className="mb-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-mint-50 border border-mint-200 text-mint-700 text-xs font-bold uppercase tracking-wider mb-2">
                <FiUserPlus size={13} />
                <span>Account Provisioning</span>
              </div>
              <h2 id="modal-title" className="text-2xl font-bold font-serif text-ink-900">
                Create System User
              </h2>
              <p className="text-xs text-ink-600 mt-1">
                Register a new administrator or verification officer on the M-Lah backend API.
              </p>
            </div>

            {/* API Error in modal */}
            {createError && (
              <div
                role="alert"
                className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start space-x-2"
              >
                <FiAlertCircle className="flex-shrink-0 mt-0.5 text-red-500" size={15} />
                <span>{createError}</span>
              </div>
            )}

            {/* Create User Form */}
            <form onSubmit={handleFormSubmit} noValidate className="space-y-4">

              {/* First & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label className="block text-xs font-bold text-ink-800 uppercase tracking-wider mb-1.5">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName || ""}
                    onChange={handleInputChange}
                    placeholder="e.g. John"
                    className={inputClass(
                      "w-full px-3.5 py-2.5 rounded-xl border text-ink-900 text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2",
                      !!formErrors.firstName
                    )}
                  />
                  {formErrors.firstName && (
                    <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                      <FiAlertCircle size={11} />
                      {formErrors.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-xs font-bold text-ink-800 uppercase tracking-wider mb-1.5">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName || ""}
                    onChange={handleInputChange}
                    placeholder="e.g. Doe"
                    className={inputClass(
                      "w-full px-3.5 py-2.5 rounded-xl border text-ink-900 text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2",
                      !!formErrors.lastName
                    )}
                  />
                  {formErrors.lastName && (
                    <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                      <FiAlertCircle size={11} />
                      {formErrors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-xs font-bold text-ink-800 uppercase tracking-wider mb-1.5">
                  Account Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink-400">
                    <FiUser size={15} />
                  </div>
                  <input
                    type="text"
                    name="userName"
                    value={formData.userName || ""}
                    onChange={handleInputChange}
                    placeholder="e.g. jdoe_officer"
                    className={inputClass(
                      "w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-ink-900 text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2",
                      !!formErrors.userName
                    )}
                  />
                </div>
                {formErrors.userName && (
                  <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                    <FiAlertCircle size={11} />
                    {formErrors.userName}
                  </p>
                )}
              </div>

              {/* Email & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-ink-800 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink-400">
                      <FiMail size={15} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ""}
                      onChange={handleInputChange}
                      placeholder="e.g. jdoe@gov.in"
                      className={inputClass(
                        "w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-ink-900 text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2",
                        !!formErrors.email
                      )}
                    />
                  </div>
                  {formErrors.email && (
                    <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                      <FiAlertCircle size={11} />
                      {formErrors.email}
                    </p>
                  )}
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-xs font-bold text-ink-800 uppercase tracking-wider mb-1.5">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink-400">
                      <FiPhone size={15} />
                    </div>
                    <input
                      type="tel"
                      name="contactNo"
                      value={formData.contactNo || ""}
                      onChange={handleInputChange}
                      placeholder="9876543210"
                      maxLength={10}
                      className={inputClass(
                        "w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-ink-900 text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2",
                        !!formErrors.contactNo
                      )}
                    />
                  </div>
                  {formErrors.contactNo ? (
                    <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                      <FiAlertCircle size={11} />
                      {formErrors.contactNo}
                    </p>
                  ) : (
                    <p className="mt-1 text-[11px] text-ink-400">
                      {(formData.contactNo || "").length}/10 digits
                    </p>
                  )}
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-bold text-ink-800 uppercase tracking-wider mb-1.5">
                  Assigned Departmental Role <span className="text-red-500">*</span>
                </label>
                <select
                  name="roleId"
                  value={formData.roleId ?? ""}
                  onChange={handleInputChange}
                  className={inputClass(
                    "w-full px-3.5 py-2.5 rounded-xl border text-ink-900 text-xs sm:text-sm font-medium focus-visible:outline-none focus-visible:ring-2",
                    !!formErrors.roleId
                  )}
                >
                  <option value="" disabled>
                    — Select a role —
                  </option>
                  {ROLE_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label} ({opt.name})
                    </option>
                  ))}
                </select>
                {formErrors.roleId && (
                  <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                    <FiAlertCircle size={11} />
                    {formErrors.roleId}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-ink-800 uppercase tracking-wider mb-1.5">
                  Account Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink-400">
                    <FiLock size={15} />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password || ""}
                    onChange={handleInputChange}
                    placeholder="Enter secure initial password"
                    className={inputClass(
                      "w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-ink-900 text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2",
                      !!formErrors.password
                    )}
                  />
                </div>
                {formErrors.password && (
                  <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                    <FiAlertCircle size={11} />
                    {formErrors.password}
                  </p>
                )}
              </div>

              {/* Form Actions */}
              <div className="pt-4 border-t border-sand-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 rounded-xl bg-sand-100 hover:bg-sand-200 text-ink-700 font-semibold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-6 py-2.5 rounded-xl bg-mint-500 hover:bg-mint-400 text-ocean-900 font-bold text-xs shadow-md transition-all flex items-center space-x-1.5 disabled:opacity-50"
                >
                  <span>{isCreating ? "Provisioning..." : "Create Account"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
