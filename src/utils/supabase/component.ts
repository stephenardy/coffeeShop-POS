/**
 Purpose: Client-side Supabase usage in components (e.g. login forms, sign-outs)
- Nice and clean: uses createBrowserClient()
- Ideal for using supabase.auth.signInWithPassword() or signOut() in React components
 */

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return supabase;
}
