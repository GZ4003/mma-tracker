import { NextRequest, NextResponse } from "next/server";
import { fetchCronUsers } from "@/lib/userProfiles";
import { getWeekStart, addDays, parseLocalDate } from "@/lib/weekUtils";
import { isAuthorizedCronRequest, createMailTransporter } from "@/lib/cronMail";
import { buildEmailHtml } from "@/lib/emailTemplate";

export const runtime = "nodejs";

const SATURDAY_MIN_SESSIONS = 2;

const MESSAGE =
  "Mañana termina la semana y todavía no completaste el mínimo de 2 clases. Es tu última oportunidad antes de perder 120 XP. ¿Entrenamos hoy?";

// GET /api/cron/saturday - Triggered by the Vercel Cron Job defined in
// vercel.json (Saturdays at 22:00 UTC / 7pm Argentina time). Last-chance
// nudge: only emails users who are still under the weekly minimum going
// into the final day (Sunday) — no email if they already met it (Wednesday
// already congratulated them, and Sunday sends the final resumen either way).
export async function GET(request: NextRequest) {
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const users = await fetchCronUsers();

    const now = new Date();
    const weekStart = getWeekStart(now);
    const satEnd = addDays(weekStart, 6); // exclusive upper bound (Sunday) — covers Mon–Sat

    const transporter = createMailTransporter();
    const results = [];

    for (const user of users) {
      const sessionCount = user.trainingSessions.filter((s) => {
        const d = parseLocalDate(s.date);
        return d.getTime() >= weekStart.getTime() && d.getTime() < satEnd.getTime();
      }).length;

      if (sessionCount >= SATURDAY_MIN_SESSIONS) {
        results.push({ userId: user.userId, sessionCount, emailSent: false });
        continue;
      }

      await transporter.sendMail({
        from: `"MMA Mode" <${process.env.GMAIL_USER}>`,
        to: user.email,
        subject: "🚨 Última oportunidad — MMA Mode",
        text: MESSAGE,
        html: buildEmailHtml({ message: MESSAGE }),
      });

      results.push({ userId: user.userId, sessionCount, emailSent: true });
    }

    return NextResponse.json({ ok: true, results });
  } catch (error) {
    console.error("Error in GET /api/cron/saturday:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
