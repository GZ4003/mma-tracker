import { NextRequest, NextResponse } from "next/server";
import { fetchCronUsers } from "@/lib/userProfiles";
import { isAuthorizedCronRequest, createMailTransporter } from "@/lib/cronMail";
import { buildEmailHtml } from "@/lib/emailTemplate";
import { getLevelInfo } from "@/lib/xp";

export const runtime = "nodejs";

const MESSAGE =
  "Tenés 5 días para registrar al menos 2 clases y mantener tu racha. Cada sesión suma XP y te acerca al próximo rango.";

// GET /api/cron/monday - Triggered by the Vercel Cron Job defined in
// vercel.json (Mondays at 23:15 UTC / 8:15pm Argentina time). Sends every
// user a personalized kickoff email for the new week.
export async function GET(request: NextRequest) {
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const users = await fetchCronUsers();
    const transporter = createMailTransporter();

    const results = [];
    for (const user of users) {
      const { name: rank } = getLevelInfo(user.totalXP);

      await transporter.sendMail({
        from: `"MMA Mode" <${process.env.GMAIL_USER}>`,
        to: user.email,
        subject: "💪 Nueva semana, nueva oportunidad — MMA Mode",
        text: MESSAGE,
        html: buildEmailHtml({
          name: user.name,
          heading: "Arrancó la semana 💪",
          message: MESSAGE,
          stats: [
            { label: "Racha", value: `${user.streak} 🔥` },
            { label: "XP Total", value: `${user.totalXP}` },
            { label: "Rango", value: rank },
          ],
        }),
      });

      results.push({ userId: user.userId, emailSent: true });
    }

    return NextResponse.json({ ok: true, results });
  } catch (error) {
    console.error("Error in GET /api/cron/monday:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
