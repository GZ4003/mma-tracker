import { createClient } from "@supabase/supabase-js";

// Service-role client for server-only contexts with no user session (the
// weekly cron routes, which need to read any user's profile to show their
// rank/XP in the email). Bypasses RLS — never import this into client code.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
