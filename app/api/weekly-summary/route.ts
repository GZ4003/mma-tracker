import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { writeUserWeeklyData } from "@/lib/weeklySummary";

export const runtime = "nodejs";

// POST /api/weekly-summary - Called by the client whenever training sessions
// change, so the server has a record of them (keyed by user, with that
// user's own email) to check on the weekly cron. The client's localStorage
// isn't reachable from the server.
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const trainingDates: string[] = Array.isArray(body?.trainingDates)
      ? body.trainingDates.filter((d: unknown) => typeof d === "string")
      : [];

    await writeUserWeeklyData(user.id, user.email ?? "", trainingDates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in POST /api/weekly-summary:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
