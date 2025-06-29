/**
 Purpose: For getServerSideProps() in protected pages.
- This one is your ⭐ go-to for pages like setup-profile.tsx or dashboard.tsx
- Reads and writes Supabase cookies cleanly
- Plugs directly into the getServerSideProps example I gave earlier
 */

import { type GetServerSidePropsContext } from "next";
import { createServerClient, serializeCookieHeader } from "@supabase/ssr";

export function createClient({ req, res }: GetServerSidePropsContext) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return Object.keys(req.cookies).map((name) => ({
            name,
            value: req.cookies[name] || "",
          }));
        },
        setAll(cookiesToSet) {
          res.setHeader(
            "Set-Cookie",
            cookiesToSet.map(({ name, value, options }) =>
              serializeCookieHeader(name, value, options)
            )
          );
        },
      },
    }
  );

  return supabase;
}
