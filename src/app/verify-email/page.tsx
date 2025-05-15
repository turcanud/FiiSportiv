import {verifyUserToken} from "@/auth/email/verifier.actions";
import Link from "next/link";

interface PageProps {
  searchParams?: Promise<{
    token?: string;
  }>;
}

export default async function VerifyEmailPage({searchParams}: PageProps) {
  const getSearchParams = await searchParams;
  const token = getSearchParams?.token;
  if (!token) {
    return "Something went wrong";
  }
  try {
    const isVerified = await verifyUserToken(token);
    return (
      <>
        {isVerified ? (
          <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Email Verified</h1>
            <p>
              Your email has been successfully verified. You can now log in.
            </p>
            <Link href="/sign-in" className="mt-4 inline-block text-blue-500">
              Go to Login
            </Link>
          </div>
        ) : (
          <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Already Verified</h1>
            <p>Your email has been already verified. You can now log in.</p>
            <Link href="/sign-in" className="mt-4 inline-block text-blue-500">
              Go to Login
            </Link>
          </div>
        )}
      </>
    );
  } catch (error) {
    return error;
  }
}
