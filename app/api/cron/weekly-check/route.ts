import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { readWeeklySummary } from "@/lib/weeklySummary";
import { getWeekStart, addDays, parseLocalDate } from "@/lib/weekUtils";

export const runtime = "nodejs";

const WEEKLY_MIN_SESSIONS = 2;
const WEEKLY_PENALTY_XP = 120;

// GET /api/cron/weekly-check - Triggered by the Vercel Cron Job defined in
// vercel.json (Saturdays at 12:00 UTC / 9am Argentina time). Checks whether
// the current week has enough logged training sessions and, if not, emails
// a reminder (or a "you lost XP" notice if the week has already ended).
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const summary = await readWeeklySummary();

    const now = new Date();
    const weekStart = getWeekStart(now);
    const weekEnd = addDays(weekStart, 7); // exclusive upper bound (next Monday)

    const sessionCount = summary.trainingDates.filter((dateStr) => {
      const d = parseLocalDate(dateStr);
      return d.getTime() >= weekStart.getTime() && d.getTime() < weekEnd.getTime();
    }).length;

    if (sessionCount >= WEEKLY_MIN_SESSIONS) {
      return NextResponse.json({ ok: true, sessionCount, emailSent: false });
    }

    const weekHasEnded = now.getTime() >= weekEnd.getTime();
    const body = weekHasEnded
      ? `Perdiste ${WEEKLY_PENALTY_XP} XP esta semana por no completar el mínimo de ${WEEKLY_MIN_SESSIONS} clases.`
      : `Registraste ${sessionCount} clase(s) esta semana. Necesitas al menos ${WEEKLY_MIN_SESSIONS} para no perder ${WEEKLY_PENALTY_XP} XP. Entra a la app y registra tu entrenamiento.`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.NOTIFY_EMAIL || process.env.GMAIL_USER,
      subject: "MMA Mode — Esta semana te falta entrenar",
      text: body,
    });

    return NextResponse.json({ ok: true, sessionCount, emailSent: true });
  } catch (error) {
    console.error("Error in GET /api/cron/weekly-check:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
