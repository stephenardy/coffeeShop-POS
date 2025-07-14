import { MdSpaceDashboard } from "react-icons/md";
import { FaUserCog } from "react-icons/fa";

const crewTabs = [
  {
    title: "Menus",
    url: "/crew",
    icon: <MdSpaceDashboard />,
  },
  {
    title: "Create Orders",
    url: "/crew/create-orders",
    icon: <FaUserCog />,
  },
];

export default crewTabs;
