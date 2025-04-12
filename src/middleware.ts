import {NextResponse, type NextRequest} from "next/server";
import {getUserFromSession} from "./auth/core/session";

const authRoutes = ["/sign-up", "/sign-in"];
// const privateRoutes = ["/private"];
// const adminRoutes = ["/admin"];

export async function middleware(request: NextRequest) {
  const response = (await middlewareAuth(request)) ?? NextResponse.next();
  return response;
}

async function middlewareAuth(request: NextRequest) {
  if (authRoutes.includes(request.nextUrl.pathname)) {
    const user = await getUserFromSession(request.cookies);
    if (user) return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
