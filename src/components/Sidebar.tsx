import { GrUserWorker } from "react-icons/gr";
import { BsFillPeopleFill } from "react-icons/bs";
import { RiDashboardLine } from "react-icons/ri";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isCurrent = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <aside
      aria-label="Main Navigation"
      className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-16 m-0 flex flex-col items-center py-4 bg-ocean-800 border-r border-ocean-700/50 shadow-header z-30 space-y-3"
    >
      <SidebarIcon
        icon={<RiDashboardLine size={20} />}
        text="Dashboard Overview"
        active={isCurrent("/")}
        onClick={() => navigate("/")}
      />
      <SidebarIcon
        icon={<BsFillPeopleFill size={20} />}
        text="Tourist Registrations"
        active={isCurrent("/tourist")}
        onClick={() => navigate("/tourist")}
      />
      <SidebarIcon
        icon={<GrUserWorker size={20} />}
        text="Labour Registrations"
        active={isCurrent("/labour")}
        onClick={() => navigate("/labour")}
      />
    </aside>
  );
};

const SidebarIcon = ({
  icon,
  text = "tooltip",
  active = false,
  onClick,
}: {
  icon: React.ReactNode;
  text?: string;
  active?: boolean;
  onClick?: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={text}
    className={`sidebar-icon group ${active ? "sidebar-icon-active" : ""}`}
  >
    {icon}
    <span className="sidebar-tooltip group-hover:scale-100">{text}</span>
  </button>
);

export default Sidebar;

