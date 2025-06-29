/**
 Purpose: For static pages that don’t need cookies/session
- Good choice when generating static props or non-authenticated builds
- Likely useful for public or marketing pages
 */

import { createClient as createClientPrimitive } from "@supabase/supabase-js";

export function createClient() {
  const supabase = createClientPrimitive(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return supabase;
}
