import React from "react";

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
  if (!isOpen) return null; // Don't render anything if not open

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Are you sure you want to logout?
        </h2>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutDialog;
