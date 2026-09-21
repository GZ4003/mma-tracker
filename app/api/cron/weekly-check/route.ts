import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { readWeeklySummary } from "@/lib/weeklySummary";
import { getWeekStart, addDays, parseLocalDate } from "@/lib/weekUtils";

export const runtime = "nodejs";

const WEEKLY_MIN_SESSIONS = 2;
const WEEKLY_PENALTY_XP = 120;

// Inlined as a base64 data URI so the logo renders inside the email body
// without depending on external hosting.
const LOGO_DATA_URI = `data:image/svg+xml;base64,${fs
  .readFileSync(path.join(process.cwd(), "public", "email-avatar.svg"))
  .toString("base64")}`;

function buildEmailHtml(body: string) {
  return `
    <div style="background:#080C14; padding:32px 16px; font-family: Arial, Helvetica, sans-serif;">
      <table role="presentation" width="100%" style="max-width:480px; margin:0 auto;">
        <tr>
          <td style="text-align:center; padding-bottom:20px;">
            <img src="${LOGO_DATA_URI}" width="72" height="72" alt="MMA Mode" style="display:block; margin:0 auto;" />
          </td>
        </tr>
        <tr>
          <td style="background:#0D2040; border-radius:12px; padding:24px; color:#E8F4FF; font-size:15px; line-height:1.6; text-align:center;">
            ${body}
          </td>
        </tr>
      </table>
    </div>
  `;
}

// GET /api/cron/weekly-check - Triggered by the Vercel Cron Job defined in
// vercel.json (Saturdays at 12:00 UTC / 9am Argentina time). For each user,
// checks whether the current week has enough logged training sessions and,
// if not, emails a reminder (or a "you lost XP" notice if the week has
// already ended) to that user's own address.
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
    const weekHasEnded = now.getTime() >= weekEnd.getTime();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const results = [];
    for (const [userId, userData] of Object.entries(summary.users)) {
      if (!userData.email) continue;

      const sessionCount = userData.trainingDates.filter((dateStr) => {
        const d = parseLocalDate(dateStr);
        return d.getTime() >= weekStart.getTime() && d.getTime() < weekEnd.getTime();
      }).length;

      if (sessionCount >= WEEKLY_MIN_SESSIONS) {
        results.push({ userId, sessionCount, emailSent: false });
        continue;
      }

      const body = weekHasEnded
        ? `Perdiste ${WEEKLY_PENALTY_XP} XP esta semana por no completar el mínimo de ${WEEKLY_MIN_SESSIONS} clases.`
        : `Registraste ${sessionCount} clase(s) esta semana. Necesitas al menos ${WEEKLY_MIN_SESSIONS} para no perder ${WEEKLY_PENALTY_XP} XP. Entra a la app y registra tu entrenamiento.`;

      await transporter.sendMail({
        from: `"MMA Mode" <${process.env.GMAIL_USER}>`,
        to: userData.email,
        subject: "MMA Mode — Esta semana te falta entrenar",
        text: body,
        html: buildEmailHtml(body),
      });

      results.push({ userId, sessionCount, emailSent: true });
    }

    return NextResponse.json({ ok: true, results });
  } catch (error) {
    console.error("Error in GET /api/cron/weekly-check:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
