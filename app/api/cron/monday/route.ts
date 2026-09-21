import { NextRequest, NextResponse } from "next/server";
import { fetchCronUsers } from "@/lib/userProfiles";
import { isAuthorizedCronRequest, createMailTransporter } from "@/lib/cronMail";
import { buildEmailHtml } from "@/lib/emailTemplate";

export const runtime = "nodejs";

const MESSAGE =
  "Arrancó la semana. Tenés 5 días para registrar al menos 2 clases y mantener tu racha. Cada sesión suma XP y te acerca al próximo rango. ¿Arrancamos?";

// GET /api/cron/monday - Triggered by the Vercel Cron Job defined in
// vercel.json (Mondays at 22:00 UTC / 7pm Argentina time). Sends every user
// a motivational kickoff email for the new week.
export async function GET(request: NextRequest) {
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const users = await fetchCronUsers();
    const transporter = createMailTransporter();

    const results = [];
    for (const user of users) {
      await transporter.sendMail({
        from: `"MMA Mode" <${process.env.GMAIL_USER}>`,
        to: user.email,
        subject: "💪 Nueva semana, nueva oportunidad — MMA Mode",
        text: MESSAGE,
        html: buildEmailHtml({ message: MESSAGE }),
      });

      results.push({ userId: user.userId, emailSent: true });
    }

    return NextResponse.json({ ok: true, results });
  } catch (error) {
    console.error("Error in GET /api/cron/monday:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
