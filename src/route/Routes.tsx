import { Routes, Route } from "react-router-dom";
import TouristHome from "../tourist/TouristHome";
import LabourHome from "../labour/LabourHome";
import Home from "../home/Home";
import Login from "../Login";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/tourist" element={<TouristHome />} />
      <Route path="/labour" element={<LabourHome />} />
      {/* Optional: Add a 404 page */}
      <Route
        path="*"
        element={<div className="ml-20 p-4">Page Not Found</div>}
      />
    </Routes>
  );
};

export default AppRoutes;
