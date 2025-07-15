import { FaEye, FaRegEdit } from "react-icons/fa";
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
import DialogDeleteMenu from "./DialogDeleteMenu";
import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { createClient } from "@/utils/supabase/component";
import FormEditMenu from "./FormEditMenu";

interface PropsTypes {
  menus: Menus[];
  itemsPerPage: number;
  currentPage: number;
  fetchMenus: () => Promise<void>;
}

const MenusTable = (props: PropsTypes) => {
  const supabase = createClient();

  const { menus, itemsPerPage, currentPage, fetchMenus } = props;

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const [selectedMenu, setSelectedMenu] = useState<Menus | null>(null);

  const getImagePath = (publicUrl: string) => {
    let imagePath = publicUrl.replace(
      "https://hxjpymtjxigrxgtvchdv.supabase.co/storage/v1/object/public/menu-images/",
      ""
    );

    if (imagePath.startsWith("/")) {
      imagePath = imagePath.slice(1);
    }

    return imagePath;
  };

  const handleDeleteMenu = async () => {
    if (!selectedMenu) {
      return;
    }

    const image = getImagePath(selectedMenu?.image_url);
    console.log(image);

    if (image) {
      const { error: removeImageError } = await supabase.storage
        .from("menu-images")
        .remove([image]);

      if (removeImageError) {
        console.error(
          "failed removing image from bucket: ",
          removeImageError.message
        );
        return;
      }

      await supabase.from("menus").delete().eq("id", selectedMenu.id);
      await fetchMenus();
      setSelectedMenu(null);
    }
  };

  return (
    <>
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
                        <DropdownMenuItem
                          onClick={() => {
                            setOpenEditDialog(true);
                            setSelectedMenu(menu);
                          }}
                          className="cursor-pointer"
                        >
                          <FaRegEdit />
                          <p>Edit</p>
                        </DropdownMenuItem>
                        {/*  */}
                        <DropdownMenuItem
                          onClick={() => {
                            setOpenDeleteDialog(true);
                            setSelectedMenu(menu);
                          }}
                          className="cursor-pointer"
                        >
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

      {openDeleteDialog && selectedMenu && (
        <DialogDeleteMenu
          openDeleteDialog={openDeleteDialog}
          setOpenDeleteDialog={setOpenDeleteDialog}
          menu={selectedMenu}
          onDelete={handleDeleteMenu}
        />
      )}

      {openEditDialog && selectedMenu && (
        <FormEditMenu
          openEditDialog={openEditDialog}
          setOpenEditDialog={setOpenEditDialog}
          menu={selectedMenu}
          fetchMenus={fetchMenus}
        />
      )}
    </>
  );
};

export default MenusTable;
