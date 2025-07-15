// This is Manager Dashboard
import ManagerLayout from "@/components/layouts/ManagerLayout/index";
import ManageMenus from "@/components/views/Manager/ManageMenus";
import { createClient } from "@/utils/supabase/component";
import { useEffect, useState } from "react";

export interface Menus {
  id: string;
  name: string;
  description: string;
  price: number;
  categories: string[];
  image_url: string;
  created_at: string;
}

const ManagerManageMenusPage = () => {
  const supabase = createClient();

  const [menus, setMenus] = useState<Menus[]>([]);

  const fetchMenus = async () => {
    const { data, error } = await supabase
      .from("menus")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error(error.message);
    }

    if (data) {
      setMenus(data);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  return (
    <ManagerLayout username="John Thor">
      <ManageMenus menus={menus} fetchMenus={fetchMenus} />
    </ManagerLayout>
  );
};

export default ManagerManageMenusPage;
