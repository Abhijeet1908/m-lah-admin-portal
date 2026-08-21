import AppRoutes from "./route/Routes";
import Sidebar from "./components/Sidebar";
import LoggedInUserDisplay from "./components/LoggedInUserDisplay";
import { FiLogOut } from "react-icons/fi";
import { useEffect, useState } from "react";
import LogoutDialog from "./components/dialogBoxs/LogoutDialog";
import { useLocation, useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const status = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(status);

    if (!status && location.pathname !== "/login") {
      navigate("/login");
    }
  }, [location.pathname, navigate]);

  function handleLogout() {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    setShowLogoutDialog(false);
    navigate("/login");
  }

  const role = localStorage.getItem("role") ?? "Administrator";
  const loggedInUser = {
    userName: role,
    userProfile: role.toLowerCase() === "admin" ? "Super Admin" : "Officer",
  };

  return (
    <div className="min-h-screen bg-sand-50 font-sans text-ink-800 flex flex-col">
      {isLoggedIn ? (
        <>
          {/* Top Authoritative Header */}
          <header
            role="banner"
            className="fixed top-0 left-0 right-0 h-16 bg-ocean-800 border-b border-ocean-700/80 shadow-header z-40 px-4 md:px-6 flex items-center justify-between"
          >
            {/* Brand & Emblem */}
            <div
              className="flex items-center space-x-3 cursor-pointer select-none"
              onClick={() => navigate("/")}
            >
              <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-mint-400 to-ocean-600 text-ocean-900 font-serif font-bold text-xl shadow-md border border-mint-400/30">
                M
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className="font-serif font-bold text-2xl text-white tracking-wide">
                    m-lah
                  </span>
                  <span className="badge-tag bg-mint-500/20 text-mint-400 border border-mint-400/30 text-[10px] hidden sm:inline-flex">
                    Official
                  </span>
                </div>
                <span className="text-[11px] font-medium text-ocean-100/70 -mt-1 tracking-wider uppercase hidden md:inline-block">
                  Labour & Human Affairs Portal
                </span>
              </div>
            </div>

            {/* Right User & Actions */}
            <div className="flex items-center space-x-3">
              <LoggedInUserDisplay user={loggedInUser} />

              <button
                type="button"
                onClick={() => setShowLogoutDialog(true)}
                title="Sign out of portal"
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-coral-500/15 hover:bg-coral-500 text-coral-400 hover:text-white border border-coral-500/30 transition-all duration-200 text-xs font-semibold focus-visible:ring-2 focus-visible:ring-coral-400"
              >
                <FiLogOut size={16} />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </header>

          {/* Body Container */}
          <div className="flex pt-16 min-h-screen">
            <Sidebar />
            <main
              role="main"
              className="ml-16 flex-1 w-[calc(100%-4rem)] p-4 md:p-8 bg-sand-50"
            >
              <AppRoutes />
            </main>
          </div>
        </>
      ) : (
        <main role="main" className="min-h-screen bg-sand-50">
          <AppRoutes />
        </main>
      )}

      <LogoutDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onLogout={handleLogout}
      />
    </div>
  );
}

export default App;

