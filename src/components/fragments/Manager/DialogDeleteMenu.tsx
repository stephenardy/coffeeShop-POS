import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Menus } from "@/pages/manager/manage-menus";
import { Dispatch } from "react";

interface PropsTypes {
  openDeleteDialog: boolean;
  setOpenDeleteDialog: Dispatch<React.SetStateAction<boolean>>;
  menu: Menus;
  onDelete: () => Promise<void>;
}

const DialogDeleteMenu = ({
  openDeleteDialog,
  setOpenDeleteDialog,
  menu,
  onDelete,
}: PropsTypes) => {
  return (
    <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure to delete {menu?.name}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the menu
            and its image from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DialogDeleteMenu;
