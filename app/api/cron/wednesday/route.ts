import { NextRequest, NextResponse } from "next/server";
import { fetchCronUsers } from "@/lib/userProfiles";
import { getWeekStart, addDays, parseLocalDate } from "@/lib/weekUtils";
import { isAuthorizedCronRequest, createMailTransporter } from "@/lib/cronMail";
import { buildEmailHtml } from "@/lib/emailTemplate";
import { getLevelInfo } from "@/lib/xp";

export const runtime = "nodejs";

const WEDNESDAY_MIN_SESSIONS = 2;

const congratsMessage = (nextRank: string | null) =>
  nextRank
    ? `Ya cumpliste el mínimo semanal. Seguí entrenando para acercarte a ${nextRank}.`
    : "Ya cumpliste el mínimo semanal. Seguí entrenando, cada clase suma.";

const WARNING_MESSAGE =
  "Llegamos al miércoles y todavía no completaste 2 clases esta semana. Tenés hasta el sábado para evitar la penalización de -120 XP.";

// GET /api/cron/wednesday - Triggered by the Vercel Cron Job defined in
// vercel.json (Wednesdays at 22:00 UTC / 7pm Argentina time). Checks each
// user's session count for Mon–Wed and sends a congrats or a warning email.
export async function GET(request: NextRequest) {
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const users = await fetchCronUsers();

    const now = new Date();
    const weekStart = getWeekStart(now);
    const wedEnd = addDays(weekStart, 3); // exclusive upper bound (Thursday) — covers Mon–Wed

    const transporter = createMailTransporter();
    const results = [];

    for (const user of users) {
      const sessionCount = user.trainingSessions.filter((s) => {
        const d = parseLocalDate(s.date);
        return d.getTime() >= weekStart.getTime() && d.getTime() < wedEnd.getTime();
      }).length;

      const metMinimum = sessionCount >= WEDNESDAY_MIN_SESSIONS;
      const { name: rank, nextLevelName } = getLevelInfo(user.totalXP);

      const message = metMinimum ? congratsMessage(nextLevelName) : WARNING_MESSAGE;
      const subject = metMinimum
        ? "🔥 Ya cumpliste — MMA Mode"
        : "⚠️ Te falta una clase esta semana — MMA Mode";

      await transporter.sendMail({
        from: `"MMA Mode" <${process.env.GMAIL_USER}>`,
        to: user.email,
        subject,
        text: message,
        html: buildEmailHtml({
          name: user.name,
          heading: metMinimum ? "Ya cumpliste el mínimo 🔥" : "Te falta una clase ⚠️",
          message,
          stats: [
            { label: "Clases (L-M)", value: `${sessionCount}/${WEDNESDAY_MIN_SESSIONS}` },
            { label: "Rango", value: rank },
          ],
        }),
      });

      results.push({ userId: user.userId, sessionCount, metMinimum, emailSent: true });
    }

    return NextResponse.json({ ok: true, results });
  } catch (error) {
    console.error("Error in GET /api/cron/wednesday:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
