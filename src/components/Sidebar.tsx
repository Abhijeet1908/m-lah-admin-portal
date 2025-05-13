import { GrUserWorker } from "react-icons/gr";
import { BsFillPeopleFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <div className="fixed top-12 left-0 h-screen w-16 m-0 flex flex-col bg-gray-200 text-white shadow-lg">
      <SidebarIcon
        icon={<BsFillPeopleFill size={"20"} />}
        text={"Tourist Registration"}
        onClick={() => navigate("/tourist")}
      />
      <SidebarIcon
        icon={<GrUserWorker size={"20"} />}
        text={"Labour Registration"}
        onClick={() => navigate("/labour")}
      />
    </div>
  );
};
const SidebarIcon = ({
  icon,
  text = "tooltip",
  onClick,
}: {
  icon: React.ReactNode;
  text?: string;
  onClick?: () => void;
}) => (
  <div className="sidebar-icon group" onClick={onClick}>
    {icon}
    <span className="sidebar-tooltip group-hover:scale-100">{text}</span>
  </div>
);

export default Sidebar;
