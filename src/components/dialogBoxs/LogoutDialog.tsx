import React, { useEffect } from "react";
import { FiAlertTriangle } from "react-icons/fi";

type LogoutDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
};

const LogoutDialog: React.FC<LogoutDialogProps> = ({
  isOpen,
  onClose,
  onLogout,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-title"
      className="fixed inset-0 flex items-center justify-center bg-ocean-900/60 backdrop-blur-sm z-50 p-4 transition-all duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl w-full max-w-md border border-sand-200 transform transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start space-x-4 mb-5">
          <div className="p-3 bg-coral-100 text-coral-600 rounded-xl flex-shrink-0">
            <FiAlertTriangle size={24} />
          </div>
          <div>
            <h2
              id="logout-title"
              className="text-xl font-bold text-ink-900 font-serif"
            >
              Sign Out of Portal?
            </h2>
            <p className="text-sm text-ink-600 mt-1 leading-relaxed">
              Your active session will be securely terminated. You will need your credentials to sign in again.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-sand-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-sand-100 hover:bg-sand-200 text-ink-700 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ocean-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-coral-500 hover:bg-coral-600 text-white text-sm font-semibold shadow-md transition-colors focus-visible:ring-2 focus-visible:ring-coral-400"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutDialog;

