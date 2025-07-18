import { Menus } from "@/pages/manager/manage-menus";
import { Dispatch } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  // DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

interface PropsTypes {
  openPreview: boolean;
  setOpenPreview: Dispatch<React.SetStateAction<boolean>>;
  menu: Menus;
}

const Preview = (props: PropsTypes) => {
  const { menu, openPreview, setOpenPreview } = props;
  return (
    <Dialog open={openPreview} onOpenChange={setOpenPreview}>
      <DialogContent className="max-w-md md:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg md:text-2xl font-semibold">
            {menu.name}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            ${menu.price} · {menu.categories.join(", ")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Image
            src={menu.image_url}
            alt={menu.name}
            width={800}
            height={600}
            className="rounded-md w-full max-h-[300px] object-cover border"
          />
          <p className="text-sm md:text-base leading-relaxed text-foreground">
            {menu.description}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Preview;
