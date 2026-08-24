import React from "react";
import { LoggedInUserType } from "../common/types";
import { useGetUserDetails } from "../utils/base.hooks";

interface LoggedInUserDisplayProps {
  user?: LoggedInUserType;
}

const LoggedInUserDisplay: React.FC<LoggedInUserDisplayProps> = ({ user: fallbackUser }) => {
  const { user: apiUser } = useGetUserDetails();

  const roleFromStorage = localStorage.getItem("role") || "Administrator";
  const displayName =
    [apiUser?.firstName, apiUser?.lastName].filter(Boolean).join(" ") ||
    apiUser?.userName ||
    fallbackUser?.userName ||
    roleFromStorage;

  const displayRole =
    apiUser?.role ||
    (displayName.toLowerCase() === "admin" ? "Super Admin" : "Officer");

  const names = displayName.trim().split(/\s+/);
  const initials = (
    (names[0]?.charAt(0) || "U") + (names[1]?.charAt(0) || "")
  ).toUpperCase();

  return (
    <div className="flex items-center space-x-3 px-3 py-1.5 rounded-full bg-ocean-900/60 border border-ocean-700/60 text-white">
      <div
        className="flex h-8 w-8 rounded-full bg-mint-500 text-ocean-900 font-bold text-xs items-center justify-center shadow-sm"
        title={`Signed in as ${displayName} (${displayRole})`}
      >
        {initials}
      </div>
      <div className="hidden md:flex flex-col text-left">
        <span className="text-xs font-semibold text-sand-50 leading-tight capitalize truncate max-w-[120px]">
          {displayName}
        </span>
        <span className="text-[10px] uppercase font-bold tracking-wider text-mint-400">
          {displayRole}
        </span>
      </div>
    </div>
  );
};

export default LoggedInUserDisplay;


