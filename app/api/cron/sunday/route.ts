import { NextRequest, NextResponse } from "next/server";
import { fetchCronUsers } from "@/lib/userProfiles";
import { getWeekStart, addDays, parseLocalDate } from "@/lib/weekUtils";
import { isAuthorizedCronRequest, createMailTransporter } from "@/lib/cronMail";
import { buildEmailHtml } from "@/lib/emailTemplate";
import { getLevelInfo } from "@/lib/xp";

export const runtime = "nodejs";

const SUNDAY_MIN_SESSIONS = 2;

const congratsMessage = (count: number, totalXP: number, rank: string) =>
  `Semana completada. Registraste ${count} clases y mantuviste el mínimo. Tu XP total es ${totalXP} y tu rango actual es ${rank}. Seguí así.`;

// The -120 XP penalty itself is applied client-side (see
// components/PenaltyChecker.tsx, which runs on app load) — this email is
// just the notification, not the thing that deducts the XP.
const PENALTY_MESSAGE =
  "Esta semana no llegaste al mínimo de 2 clases. Se descontaron 120 XP de tu perfil. La semana que viene es una nueva oportunidad. No te rindas.";

// GET /api/cron/sunday - Triggered by the Vercel Cron Job defined in
// vercel.json (Sundays at 22:00 UTC / 7pm Argentina time). Weeks run
// Monday–Sunday (see lib/weekUtils.ts), so Sunday — not Saturday — is the
// last day of the week: this is the final congrats/penalty resumen for the
// week that just ended, checking the full Mon–Sun range.
export async function GET(request: NextRequest) {
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const users = await fetchCronUsers();

    const now = new Date();
    const weekStart = getWeekStart(now);
    const weekEnd = addDays(weekStart, 7); // exclusive upper bound (next Monday) — covers Mon–Sun

    const transporter = createMailTransporter();
    const results = [];

    for (const user of users) {
      const sessionCount = user.trainingSessions.filter((s) => {
        const d = parseLocalDate(s.date);
        return d.getTime() >= weekStart.getTime() && d.getTime() < weekEnd.getTime();
      }).length;

      const metMinimum = sessionCount >= SUNDAY_MIN_SESSIONS;
      const { name: rank } = getLevelInfo(user.totalXP);

      const message = metMinimum
        ? congratsMessage(sessionCount, user.totalXP, rank)
        : PENALTY_MESSAGE;
      const subject = metMinimum
        ? "🏆 Semana completada — MMA Mode"
        : "❌ Perdiste 120 XP esta semana — MMA Mode";

      await transporter.sendMail({
        from: `"MMA Mode" <${process.env.GMAIL_USER}>`,
        to: user.email,
        subject,
        text: message,
        html: buildEmailHtml({ message }),
      });

      results.push({ userId: user.userId, sessionCount, metMinimum, emailSent: true });
    }

    return NextResponse.json({ ok: true, results });
  } catch (error) {
    console.error("Error in GET /api/cron/sunday:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
