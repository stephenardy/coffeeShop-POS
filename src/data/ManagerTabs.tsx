import { MdSpaceDashboard } from "react-icons/md";
import { FaUserCog } from "react-icons/fa";

const managerTabs = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: <MdSpaceDashboard />,
  },
  {
    title: "User Logs",
    url: "/admin/manage-user",
    icon: <FaUserCog />,
  },
];

export default managerTabs;
