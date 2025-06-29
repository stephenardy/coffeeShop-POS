import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/elements/Spinner";

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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Ellipsis } from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/utils/supabase/component";
import { useState } from "react";
// import { User } from "@supabase/supabase-js";

const formSchema = z.object({
  email: z.string().email({ message: "Please input correct email" }),
});

// interface ManageUserViewProps {
//   user: User;
// }

const ManageUser = () => {
  const supabase = createClient();

  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError("");

    const { email } = values;

    // Handle Insert User Account
    try {
      // Use signInWithOtp
      // const { error: invitationError } = await supabase.auth.signInWithOtp({
      //   //reference: https://supabase.com/docs/reference/javascript/auth-signinwithotp
      //   email,
      //   options: {
      //     emailRedirectTo: "http://localhost:3000/auth/verification",
      //   },
      // });
      const { error: invitationError } = await supabase.auth.signUp({
        email,
        password: "12345678",
        options: {
          emailRedirectTo:
            "http://localhost:3000/auth/onboarding/setup-profile",
        },
      });

      setIsLoading(true);

      if (invitationError) {
        setError(invitationError.message);
        return;
      } else {
        console.log("email successfully sent");
      }

      setDialogOpen(false);
      toast("Invitation sent to the user!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="containter w-full pt-8 px-8">
      {/* Header */}
      <div className="w-full flex flex-row justify-between mb-4">
        <h1 className="font-bold text-2xl">Manage User Account</h1>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="cursor-pointer">Add User</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite New Crew</DialogTitle>
              <DialogDescription>
                Invite new worker wheter its Cashier, Barista, or Manager.
              </DialogDescription>
            </DialogHeader>

            {/* Content */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {error !== "" && (
                  <p className="text-red-500 font-semimed text-sm">{error}</p>
                )}
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="secondary"
                      className="cursor-pointer"
                    >
                      Close
                    </Button>
                  </DialogClose>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="cursor-pointer sm:ml-2"
                  >
                    {isLoading ? <Spinner /> : "Submit"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="w-full ">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>A</TableCell>
              <TableCell>B</TableCell>
              <TableCell>A</TableCell>
              <TableCell>C</TableCell>
              <TableCell>K</TableCell>
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
                      <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                      <DropdownMenuItem>Change Role</DropdownMenuItem>
                      <DropdownMenuItem>Change Status</DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ManageUser;
