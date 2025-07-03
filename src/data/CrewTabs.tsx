import { MdSpaceDashboard } from "react-icons/md";
import { FaUserCog } from "react-icons/fa";

const crewTabs = [
  {
    title: "Menus",
    url: "/admin/dashboard",
    icon: <MdSpaceDashboard />,
  },
  {
    title: "Create Orders",
    url: "/admin/manage-user",
    icon: <FaUserCog />,
  },
];

export default crewTabs;
