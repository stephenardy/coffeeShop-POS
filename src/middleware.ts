import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

// This function can be marked `async` if using `await` inside
export default async function middleware(request: NextRequest) {
  // const res = NextResponse.next();
  // const { error: sessionError } = await supabase.auth.getSession();
  // if (sessionError) {
  //   console.error("Error fetching session:", sessionError.message);
  //   return NextResponse.redirect(new URL("/auth/login", request.url));
  // } else {
  //   return res;
  // }
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/:path*",
    "/manager/:path*",
    "/auth/onboarding/:path*",
    // "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
