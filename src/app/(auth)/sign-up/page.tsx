import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {SignUpForm} from "@/components/SignUpForm";
import Link from "next/link";
export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
        <CardFooter>
          Already have an account?{" "}
          <Link href={"/sign-in"} className="text-blue-600">
            Sign In
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
