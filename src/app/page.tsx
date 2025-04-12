import {getCurrentUser} from "@/auth/currentUser";
import LogOutBtn from "@/components/LogOutBtn";
import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import Link from "next/link";

export default async function Home() {
  const user = await getCurrentUser();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-100">
      <h1 className="text-3xl font-bold">Welcome</h1>
      {user == null ? (
        <div className="flex gap-4">
          <Button asChild variant="outline" className="w-32">
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button asChild className="w-32">
            <Link href="/sign-up">Sign Up</Link>
          </Button>
        </div>
      ) : (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl">{user.name}</CardTitle>

            <Separator orientation="horizontal" className="my-4" />

            <Button variant={"default"} asChild className="w-full">
              <Link href="/profile">My Profile</Link>
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <Separator orientation="horizontal" className="mb-4" />
            <Button variant={"outline"} asChild className="w-full">
              <Link href="/football">Football</Link>
            </Button>
            <Button variant={"outline"} asChild className="w-full">
              <Link href="/basketball">Basketball</Link>
            </Button>
            <Button variant={"outline"} asChild className="w-full">
              <Link href="/martial-arts">Martial Arts</Link>
            </Button>
          </CardContent>

          <Separator orientation="horizontal" />

          <CardFooter className="flex justify-between">
            <Button variant={"default"} asChild className="w-1/2">
              <Link href="/my-bookings">My Bookings</Link>
            </Button>
            <LogOutBtn />
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
