import {getCurrentUser} from "@/auth/currentUser";
import LogOutBtn from "@/components/LogOutBtn";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import ChangeEmailBtn from "./ChangeEmailBtn";
import {DialogPopup} from "./DialogPopup";
import {AlertDialogModal} from "./AlertDialogModal";

const UserProfile = async () => {
  const user = await getCurrentUser();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-100 p-4">
      <h1 className="text-3xl font-bold">Your Profile</h1>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Account Information
          </CardTitle>
          <CardDescription className="text-center">
            Manage your account details and preferences
          </CardDescription>
        </CardHeader>

        <Separator orientation="horizontal" />

        <CardContent className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Name</p>
            <div className="flex justify-between items-center">
              <p className="text-lg">{user.name}</p>
              <DialogPopup
                title="Change Name"
                type="name"
                description="Make changes to your name here. Click /Update/ when youre done."
              />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Email</p>
            <div className="flex justify-between items-center">
              <p className="text-lg">{user.email}</p>
              <ChangeEmailBtn />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Password</p>
            <div className="flex justify-between items-center">
              <p className="text-lg">•••••••••••••••</p>
              <DialogPopup
                title="Change Password"
                type="password"
                description="Make changes to your password here. Click /Update/ when youre done."
              />
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-2">
            <AlertDialogModal />
          </div>
        </CardContent>

        <Separator orientation="horizontal" />

        <CardFooter className="flex justify-between gap-2">
          <Button variant={"default"} asChild className="flex-1">
            <Link href="/my-bookings">My Bookings</Link>
          </Button>
          <Button variant={"outline"} asChild className="flex-1">
            <Link href="/">Home</Link>
          </Button>
          <LogOutBtn />
        </CardFooter>
      </Card>
    </div>
  );
};

export default UserProfile;
