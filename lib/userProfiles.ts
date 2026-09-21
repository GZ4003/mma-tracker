import { createAdminClient } from "@/lib/supabase/admin";
import type { MmaModeData, Session } from "@/types";

export interface CronUser {
  userId: string;
  email: string;
  trainingSessions: Session[];
  totalXP: number;
}

// Reads every user's training sessions, XP and email server-side, for the
// cron routes (no logged-in session to read cookies from). Sessions/XP come
// from the user_data table (the same one the app itself reads/writes via
// /api/user-data — no separate summary file to keep in sync); email comes
// from Supabase Auth via the admin API, since user_data only has the id.
export async function fetchCronUsers(): Promise<CronUser[]> {
  const supabase = createAdminClient();

  const [{ data: rows, error: rowsError }, { data: usersPage, error: usersError }] =
    await Promise.all([
      supabase.from("user_data").select("user_id, data"),
      supabase.auth.admin.listUsers(),
    ]);

  if (rowsError) {
    console.error("Error fetching user_data for cron:", rowsError);
    return [];
  }
  if (usersError) {
    console.error("Error fetching auth users for cron:", usersError);
    return [];
  }

  const emailByUserId = new Map(usersPage.users.map((u) => [u.id, u.email]));

  const result: CronUser[] = [];
  for (const row of rows ?? []) {
    const email = emailByUserId.get(row.user_id);
    if (!email) continue;

    const parsed = row.data as MmaModeData;
    result.push({
      userId: row.user_id,
      email,
      trainingSessions: (parsed?.sessions ?? []).filter((s) => s.type === "training"),
      totalXP: parsed?.profile?.totalXP ?? 0,
    });
  }

  return result;
}
