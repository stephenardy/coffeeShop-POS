import { FaPlus } from "react-icons/fa";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { useState } from "react";
import { AlertCircleIcon } from "lucide-react";
import Spinner from "@/components/elements/Spinner";

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
    ),
});

interface PropsTypes {
  fetchMenus: () => Promise<void>;
}

const FormAddMenu = ({ fetchMenus }: PropsTypes) => {
  const supabase = createClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const formInsert = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      categories: [],
      image: undefined,
    },
  });

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

  const handleAddMenu = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const path = await uploadImage(values.image);

      if (!path) {
        setError("Image upload failed");
        return;
      }

      const image_url = getPublicImageUrl(path);

      const newMenu = {
        name: values.name,
        price: values.price,
        description: values.description,
        categories: values.categories,
        image_url,
      };

      const { error: menusError } = await supabase
        .from("menus")
        .insert(newMenu);

      if (menusError) {
        setError(`Insert new menu failed, ${menusError.message}`);
      }

      toast("New menu added!");
      formInsert.reset();
      setDialogOpen(false);
      await fetchMenus();
    } catch (err) {
      console.error(`something went wrong. Please try again. ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2 h-9 px-4 py-2 rounded-md border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors cursor-pointer">
            <FaPlus />
            Add New Item
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Menu</DialogTitle>
            <DialogDescription>What{"'"}s the new menu?</DialogDescription>
          </DialogHeader>

          <Form {...formInsert}>
            <form
              className="space-y-4"
              onSubmit={formInsert.handleSubmit(handleAddMenu)}
            >
              <FormField
                control={formInsert.control}
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
                control={formInsert.control}
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
                control={formInsert.control}
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
                control={formInsert.control}
                name="categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categories</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. coffee, cold, sweet"
                        // value={field.value.join(", ") || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          const array = value
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
                control={formInsert.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Image</FormLabel>
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

export default FormAddMenu;
