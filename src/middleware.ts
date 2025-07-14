import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export default async function middleware(request: NextRequest) {
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
