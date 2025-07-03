import { MdSpaceDashboard } from "react-icons/md";
import { FaUserCog } from "react-icons/fa";
import { FaPersonCircleCheck } from "react-icons/fa6";

const adminTabs = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: <MdSpaceDashboard />,
  },
  {
    title: "Manage User Acoount",
    url: "/admin/manage-user",
    icon: <FaUserCog />,
  },
  {
    title: "View User Log",
    url: "#",
    icon: <FaPersonCircleCheck />,
  },
];

export default adminTabs;
