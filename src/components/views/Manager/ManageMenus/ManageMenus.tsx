// This will be the manage menus view

import { Menus } from "@/pages/manager/manage-menus";
import MenusTable from "@/components/fragments/Manager/MenusTable";
import { useState } from "react";

import FormAddMenu from "@/components/fragments/Manager/FormAddMenu";
import PaginationElements from "@/components/elements/Pagination";
import SearchBar from "@/components/elements/SearchBar";

interface PropsTypes {
  menus: Menus[];
  fetchMenus: () => Promise<void>;
}

const ManageMenus = (props: PropsTypes) => {
  const { menus, fetchMenus } = props;

  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const filteredMenus = menus.filter((menu) => {
    const lowerQuery = query.toLowerCase();

    const nameMatch = menu.name.toLowerCase().includes(lowerQuery);
    const descriptionMatch = menu.description
      .toLowerCase()
      .includes(lowerQuery);

    const categoryMatch = menu.categories.some((cat) =>
      cat.toLowerCase().includes(lowerQuery)
    );

    return nameMatch || descriptionMatch || categoryMatch;
  });

  const itemsPerPage = 5;

  const lastItemIndex = itemsPerPage * currentPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;

  const currentItems = (query !== "" ? filteredMenus : menus).slice(
    firstItemIndex,
    lastItemIndex
  );
  const totalPages = Math.ceil(
    (query !== "" ? filteredMenus : menus).length / itemsPerPage
  );

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <div className="flex justify-between mb-2 items-center">
          <SearchBar
            query={query}
            setQuery={setQuery}
            setCurrentPage={setCurrentPage}
          />
          <FormAddMenu fetchMenus={fetchMenus} />
        </div>
        <div className="flex-grow">
          <MenusTable
            menus={currentItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            fetchMenus={fetchMenus}
          />
        </div>
        <div className="sticky bottom-0 w-full bg-background">
          <PaginationElements
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </>
  );
};

export default ManageMenus;
