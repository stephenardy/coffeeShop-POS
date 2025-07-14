import { MdSpaceDashboard, MdOutlineRestaurantMenu } from "react-icons/md";
import { FaUserCog } from "react-icons/fa";

const managerTabs = [
  {
    title: "Dashboard",
    url: "/manager",
    icon: <MdSpaceDashboard />,
  },
  {
    title: "Manage User",
    url: "/manager/manage-users",
    icon: <FaUserCog />,
  },
  {
    title: "Manage Menu",
    url: "/manager/manage-menus",
    icon: <MdOutlineRestaurantMenu />,
  },
];

export default managerTabs;
