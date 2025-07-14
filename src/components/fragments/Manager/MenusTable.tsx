import { FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Menus } from "@/pages/manager/manage-menus";
import Image from "next/image";
import { Ellipsis } from "lucide-react";
import FormEditMenu from "./FormEditMenu";

interface PropsTypes {
  menus: Menus[];
  itemsPerPage: number;
  currentPage: number;
  fetchMenus: () => Promise<void>;
}

const MenusTable = (props: PropsTypes) => {
  const { menus, itemsPerPage, currentPage, fetchMenus } = props;

  return (
    <Table>
      <TableHeader>
        <TableRow className="text-foreground [&>th:first-child]:rounded-tl-md [&>th:last-child]:rounded-tr-md">
          <TableHead className="font-medium">No</TableHead>
          <TableHead></TableHead>
          <TableHead className="font-medium">Name</TableHead>
          <TableHead className="font-medium">Price</TableHead>
          <TableHead className="font-medium">Category</TableHead>
          <TableHead className="font-medium">Description</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {menus.length > 0 ? (
          menus.map((menu, index) => (
            <TableRow key={menu.id}>
              <TableCell>
                {itemsPerPage * currentPage - itemsPerPage + index + 1}
              </TableCell>
              <TableCell>
                <Image
                  src={menu.image_url}
                  alt={menu.name}
                  width={64}
                  height={48}
                  className="rounded-md object-cover border border-border"
                />
              </TableCell>
              <TableCell>{menu.name}</TableCell>
              <TableCell>$ {menu.price}</TableCell>
              <TableCell>
                <p className="text-wrap">{menu.categories.join(", ")}</p>
              </TableCell>
              <TableCell>
                <p className="w-64 text-wrap line-clamp-3">
                  {menu.description}
                </p>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="cursor-pointer">
                    <Ellipsis />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel className="font-bold">
                      Action
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem className="cursor-pointer">
                        <FaEye />
                        <p>Preview</p>
                      </DropdownMenuItem>
                      {/*  */}
                      <DropdownMenuItem className="cursor-pointer">
                        <FormEditMenu
                          fetchMenus={fetchMenus}
                          menuId={menu.id}
                        />
                      </DropdownMenuItem>
                      {/*  */}
                      <DropdownMenuItem className="cursor-pointer">
                        <MdDelete />
                        <p>Delete</p>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell>No data returned</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default MenusTable;
