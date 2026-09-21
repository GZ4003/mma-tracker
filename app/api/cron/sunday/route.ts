import { NextRequest, NextResponse } from "next/server";
import { fetchCronUsers } from "@/lib/userProfiles";
import { getWeekStart, addDays, parseLocalDate } from "@/lib/weekUtils";
import { isAuthorizedCronRequest, createMailTransporter } from "@/lib/cronMail";
import { buildEmailHtml, EmailStat } from "@/lib/emailTemplate";
import { getLevelInfo, getMasteryLevel } from "@/lib/xp";
import { getMasteryTitle } from "@/lib/masteries";
import { DISCIPLINES } from "@/lib/constants";

export const runtime = "nodejs";

const SUNDAY_MIN_SESSIONS = 2;

const CONGRATS_MESSAGE = "Semana completada. Mantuviste el mínimo. Seguí así.";

// The -120 XP penalty itself is applied client-side (see
// components/PenaltyChecker.tsx, which runs on app load) — this email is
// just the notification, not the thing that deducts the XP.
const PENALTY_MESSAGE =
  "Esta semana no llegaste al mínimo de 2 clases. Se descontaron 120 XP de tu perfil. La semana que viene es una nueva oportunidad.";

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
      const thisWeekSessions = user.trainingSessions.filter((s) => {
        const d = parseLocalDate(s.date);
        return d.getTime() >= weekStart.getTime() && d.getTime() < weekEnd.getTime();
      });
      const sessionCount = thisWeekSessions.length;
      const metMinimum = sessionCount >= SUNDAY_MIN_SESSIONS;

      // Rank change this week: compare XP before this week's sessions vs now.
      const xpEarnedThisWeek = thisWeekSessions.reduce(
        (sum, s) => sum + (s.xpEarned ?? 0),
        0
      );
      const rankBefore = getLevelInfo(Math.max(0, user.totalXP - xpEarnedThisWeek)).name;
      const rankAfter = getLevelInfo(user.totalXP).name;
      const rankedUp = rankAfter !== rankBefore;

      // Mastery level-ups this week: compare each discipline's mastery level
      // from session count before this week vs the up-to-date total.
      const masteryLevelUps = DISCIPLINES.map(({ value: discipline, label }) => {
        const allSessions = user.trainingSessions.filter(
          (s) => s.discipline === discipline
        ).length;
        const sessionsThisWeek = thisWeekSessions.filter(
          (s) => s.discipline === discipline
        ).length;
        const levelBefore = getMasteryLevel(allSessions - sessionsThisWeek);
        const levelAfter = getMasteryLevel(allSessions);
        if (levelAfter <= levelBefore) return null;
        return { label, title: getMasteryTitle(discipline, levelAfter) };
      }).filter((x): x is { label: string; title: string } => x !== null);

      const rankLine = rankedUp
        ? `Subiste de rango: ${rankBefore} → ${rankAfter}.`
        : `Rango actual: ${rankAfter}.`;
      const masteryLine =
        masteryLevelUps.length > 0
          ? `Subiste de maestría en ${masteryLevelUps
              .map((m) => `${m.label} (ahora ${m.title})`)
              .join(", ")}.`
          : null;

      const baseMessage = metMinimum ? CONGRATS_MESSAGE : PENALTY_MESSAGE;
      const message = [baseMessage, rankLine, masteryLine].filter(Boolean).join(" ");

      const heading = rankedUp
        ? `¡Subiste a ${rankAfter}! 🎉`
        : masteryLevelUps.length > 0
        ? "Nueva maestría desbloqueada 🥋"
        : metMinimum
        ? "Semana completada 🏆"
        : "Perdiste 120 XP ❌";

      const subject = metMinimum
        ? "🏆 Semana completada — MMA Mode"
        : "❌ Perdiste 120 XP esta semana — MMA Mode";

      const stats: EmailStat[] = [
        { label: "Clases (L-D)", value: `${sessionCount}` },
        { label: "XP Total", value: `${user.totalXP}` },
        { label: "Rango", value: rankAfter },
      ];
      if (masteryLevelUps.length > 0) {
        stats.push({
          label: "Maestría subida",
          value: masteryLevelUps.map((m) => m.label).join(", "),
        });
      }

      await transporter.sendMail({
        from: `"MMA Mode" <${process.env.GMAIL_USER}>`,
        to: user.email,
        subject,
        text: message,
        html: buildEmailHtml({
          name: user.name,
          heading,
          message,
          stats,
        }),
      });

      results.push({
        userId: user.userId,
        sessionCount,
        metMinimum,
        rankedUp,
        masteryLevelUps: masteryLevelUps.map((m) => m.label),
        emailSent: true,
      });
    }

    return NextResponse.json({ ok: true, results });
  } catch (error) {
    console.error("Error in GET /api/cron/sunday:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
