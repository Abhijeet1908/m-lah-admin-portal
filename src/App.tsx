// import AppRoutes from "./route/Routes";
// import Sidebar from "./components/Sidebar";
// import LoggedInUserDisplay from "./components/LoggedInUserDisplay";
// import { LoggedInUserType } from "./common/types";
// import { IoIosLogOut } from "react-icons/io";
// import { useEffect, useState } from "react";
// import LogoutDialog from "./components/dialogBoxs/LogoutDialog";
// import { Navigate, useLocation, useNavigate } from "react-router-dom";

// function App() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [showLogoutDialog, setShowLogoutDialog] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
//   const loggedInUser = {
//     userName: "Admin Test",
//     userProfile: "admin",
//   };
//   useEffect(() => {
//     // Check login status from localStorage
//     const status = localStorage.getItem("isLoggedIn") === "true";
//     setIsLoggedIn(status);

//     if (!status) {
//       navigate("/login"); // Redirect to login page if not logged in
//     }
//   }, []);
//   function handleLogout() {
//     localStorage.removeItem("isLoggedIn"); // Remove login status
//     setIsLoggedIn(false);
//     setShowLogoutDialog(false);
//     navigate("/login"); // Redirect to login page after logout
//   }

//   if (!isLoggedIn && location.pathname !== "/login") {
//     return <Navigate to="/login" />;
//   }
//   return (
//     <div>
//       {isLoggedIn ?? (
//         <div>
//           <div className="flex h-12 shadow-lg bg-gray-200 items-center px-4">
//             <div className="flex justify-between items-center w-full">
//               <div></div>
//               <div className="font-bold text-xl text-blue-600  ">m-lah</div>
//               <div className="flex items-center">
//                 <LoggedInUserDisplay user={loggedInUser} />
//                 <div className="pl-1 cursor-pointer">
//                   <IoIosLogOut
//                     title="Logout"
//                     onClick={() => setShowLogoutDialog(true)}
//                     size={24}
//                   ></IoIosLogOut>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="flex">
//             <Sidebar />
//             <div className="ml-16 w-full">
//               <AppRoutes />
//             </div>
//           </div>
//         </div>
//       )}

//       <LogoutDialog
//         isOpen={showLogoutDialog}
//         onClose={() => setShowLogoutDialog(false)}
//         onLogout={handleLogout}
//       />
//     </div>
//   );
// }
// export default App;

import AppRoutes from "./route/Routes";
import Sidebar from "./components/Sidebar";
import LoggedInUserDisplay from "./components/LoggedInUserDisplay";
import { IoIosLogOut } from "react-icons/io";
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

  let loggedInUser = {
    userName: localStorage.getItem("role") ?? "",
    userProfile: "admin",
  };

  // if (!isLoggedIn && location.pathname !== "/login") {
  //   return <Navigate to="/login" />;
  // }

  // if (location.pathname == "/login") {
  //   setIsLoggedIn(false);
  //   // localStorage.removeItem("isLoggedIn");
  // }

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <div className="flex h-12 shadow-lg bg-gray-200 items-center px-4 ">
            <div className="flex justify-between items-center w-full">
              <div></div>
              <div className="font-bold text-xl text-blue-600">m-lah</div>
              <div className="flex items-center">
                <LoggedInUserDisplay user={loggedInUser} />
                <div className="pl-1 cursor-pointer">
                  <IoIosLogOut
                    title="Logout"
                    onClick={() => setShowLogoutDialog(true)}
                    size={24}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex">
            <Sidebar />
            <div className="ml-16 w-full">
              <AppRoutes />
            </div>
          </div>
        </div>
      ) : (
        <AppRoutes />
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
