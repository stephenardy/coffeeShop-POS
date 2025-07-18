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
import Preview from "../Preview";

interface PropsTypes {
  menus: Menus[];
  itemsPerPage: number;
  currentPage: number;
  fetchMenus: () => Promise<void>;
}

const MenusTable = (props: PropsTypes) => {
  const supabase = createClient();

  const { menus, itemsPerPage, currentPage, fetchMenus } = props;

  const [openPreview, setOpenPreview] = useState(false);
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
    <div className="w-full overflow-x-auto rounded-md bg-background">
      <Table className="min-w-[800px] text-sm md:text-base">
        <TableHeader>
          <TableRow className="text-foreground [&>th:first-child]:rounded-tl-md [&>th:last-child]:rounded-tr-md">
            <TableHead className="font-medium whitespace-nowrap">No</TableHead>
            <TableHead className="w-[72px]"></TableHead>
            <TableHead className="font-medium whitespace-nowrap">
              Name
            </TableHead>
            <TableHead className="font-medium whitespace-nowrap">
              Price
            </TableHead>
            <TableHead className="font-medium whitespace-nowrap">
              Category
            </TableHead>
            <TableHead className="font-medium w-[280px]">Description</TableHead>
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
                <TableCell className="whitespace-nowrap">{menu.name}</TableCell>
                <TableCell>$ {menu.price}</TableCell>
                <TableCell>
                  <p className="whitespace-normal">
                    {menu.categories.join(", ")}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="text-wrap line-clamp-3">{menu.description}</p>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className="cursor-pointer">
                      <Ellipsis />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-45">
                      <DropdownMenuLabel className="font-bold">
                        Action
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => {
                            setOpenPreview(true);
                            setSelectedMenu(menu);
                          }}
                        >
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
              <TableCell colSpan={7}>No data returned</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {openPreview && selectedMenu && (
        <Preview
          menu={selectedMenu}
          openPreview={openPreview}
          setOpenPreview={setOpenPreview}
        />
      )}

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
    </div>
  );
};

export default MenusTable;
