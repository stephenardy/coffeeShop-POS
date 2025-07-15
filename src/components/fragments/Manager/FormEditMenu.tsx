import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/utils/supabase/component";
import { toast } from "sonner";
import { Dispatch, useEffect, useState } from "react";
import { AlertCircleIcon } from "lucide-react";
import Spinner from "@/components/elements/Spinner";
import { Menus } from "@/pages/manager/manage-menus";

const formSchema = z.object({
  name: z.string().transform((val) => val.trim().replace(/\s+/g, " ")),
  price: z.coerce
    .number()
    .min(0, "Price must be a valid number and not negative"),
  description: z.string().transform((val) => val.trim().replace(/\s+/g, " ")),
  categories: z.array(z.string()).min(1, "Please enter at least one category"),
  image: z
    .instanceof(File)
    .refine((file) => file.size > 0, { message: "Image is required" })
    .refine(
      (file) => file && file.type.startsWith("image/"),
      "Only image files are allowed"
    )
    .optional(),
});

interface PropsTypes {
  openEditDialog: boolean;
  setOpenEditDialog: Dispatch<React.SetStateAction<boolean>>;
  menu: Menus;
  fetchMenus: () => Promise<void>;
}

const FormEditMenu = ({
  openEditDialog,
  setOpenEditDialog,
  menu,
  fetchMenus,
}: PropsTypes) => {
  const supabase = createClient();

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [categoryInput, setCategoryInput] = useState(
    menu.categories?.join(", ") || ""
  );

  const formEdit = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: menu.name,
      price: menu.price,
      description: menu.description,
      categories: menu.categories || [],
      image: undefined,
    },
  });

  useEffect(() => {
    setCategoryInput(menu.categories?.join(", ") || "");
    formEdit.setValue("categories", menu.categories || []);
  }, [menu]);

  const uploadImage = async (file: File) => {
    const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
    const extension = file.name.split(".").pop();
    const filePath = `${nameWithoutExtension}_${Date.now()}.${extension}`;

    const { data, error } = await supabase.storage
      .from("menu-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false, //true means you will overwrite if there is existing file with the same name (means you need an "update"   policy for the user)
      });

    if (error) {
      setError(`Upload image to bucket failed: ${error.message}`);
      return;
    }

    return data.path;
  };

  const getPublicImageUrl = (path: string) => {
    const { data } = supabase.storage.from("menu-images").getPublicUrl(path);

    return data.publicUrl;
  };

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

  const handleEditMenu = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      setError("");

      let imageUrl = menu.image_url;

      if (values.image) {
        // upload new image
        const imagePath = await uploadImage(values.image);
        if (imagePath) {
          imageUrl = getPublicImageUrl(imagePath);

          // delete old image
          const old_image = getImagePath(menu.image_url);

          const { error: removeImageError } = await supabase.storage
            .from("menu-images")
            .remove([old_image]);

          if (removeImageError) {
            console.error(
              "failed removing image from bucket: ",
              removeImageError.message
            );
            return;
          }
        } else {
          setError("Failed to upload image.");
        }
      }

      const updatedMenu = {
        name: values.name,
        price: values.price,
        description: values.description,
        categories: values.categories,
        image_url: imageUrl,
      };

      const { data, error } = await supabase
        .from("menus")
        .update(updatedMenu)
        .eq("id", menu.id);

      if (error) {
        setError(error.message);
        return;
      }
      console.log(data);

      await fetchMenus();
      toast.success("Menu updated successfully!");
      setOpenEditDialog(false);
    } catch (err) {
      setError(`Something went wrong. Please try again! -> ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Menu</DialogTitle>
            <DialogDescription>
              What{"'"}s new about this menu?
            </DialogDescription>
          </DialogHeader>

          <Form {...formEdit}>
            <form
              className="space-y-4"
              onSubmit={formEdit.handleSubmit(handleEditMenu)}
            >
              <FormField
                control={formEdit.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="menu's name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formEdit.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01" // allow for decimal inputs
                        placeholder="e.g. 4.50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formEdit.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="menu's description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formEdit.control}
                name="categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categories</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. coffee, cold, sweet"
                        value={categoryInput}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          setCategoryInput(inputValue);

                          const array = inputValue
                            .split(",")
                            .map((item) => item.trim())
                            .filter((item) => item !== "");

                          field.onChange(array);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formEdit.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Image (optional)</FormLabel>
                    <FormControl>
                      <>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              field.onChange(file);
                            }
                          }}
                        />
                        <div className="text-accent text-sm">
                          <h4>
                            Make sure the image is in landscape (horizontal)
                            orientation
                          </h4>
                        </div>
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                {isLoading ? (
                  <Spinner />
                ) : (
                  <>
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="secondary"
                        className="cursor-pointer"
                      >
                        Close
                      </Button>
                    </DialogClose>
                    <Button type="submit" className="cursor-pointer sm:ml-2">
                      Submit
                    </Button>
                  </>
                )}
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      {error !== "" && (
        <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm">
          <Alert variant="destructive">
            <AlertCircleIcon className="h-5 w-5" />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}
    </>
  );
};

export default FormEditMenu;
