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

  // Search and Pagination
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
        <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4 items-center">
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
        <div className="sticky bottom-0 left-0 w-full bg-background px-4 py-3">
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
