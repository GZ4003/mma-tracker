export interface EmailStat {
  label: string;
  value: string;
}

// Shared base template for all cron emails (Monday/Wednesday/Saturday/Sunday).
// Kept as plain, table-based HTML with inline styles since Gmail, Outlook
// and Apple Mail all strip <style> blocks, external fonts and often start
// with images blocked — hence the text wordmark instead of a logo image.
// Colors match the app's own palette (mma-bg/mma-surface/blue) instead of
// an unrelated one-off scheme, so the brand feels the same in-app and in
// email. Stats are per-user (name, sessions, XP, streak, etc.) rather than
// a single fixed message for everyone.
export function buildEmailHtml({
  name,
  heading,
  message,
  stats = [],
  ctaText = "Abrir MMA Mode",
}: {
  name: string;
  heading: string;
  message: string;
  stats?: EmailStat[];
  ctaText?: string;
}): string {
  const appUrl = process.env.APP_URL || "#";

  const statsHtml =
    stats.length === 0
      ? ""
      : `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;">
          <tr>
            ${stats
              .map(
                (stat, index) => `
            ${index > 0 ? '<td width="10"></td>' : ""}
            <td align="center" style="background:#0A0A0F; border:1px solid #23232E; border-radius:10px; padding:14px 6px;">
              <div style="color:#3B82F6; font-family:Arial, sans-serif; font-size:20px; font-weight:800; line-height:1.2;">${stat.value}</div>
              <div style="color:#6B7280; font-family:Arial, sans-serif; font-size:10px; text-transform:uppercase; letter-spacing:0.5px; margin-top:4px;">${stat.label}</div>
            </td>`
              )
              .join("")}
          </tr>
        </table>`;

  return `<!DOCTYPE html>
<html lang="es">
  <body style="margin:0; padding:0; background:#0A0A0F;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0F; padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
            <tr>
              <td align="center" style="padding-bottom:28px;">
                <span style="font-family:'Arial Black', Impact, Arial, sans-serif; font-size:26px; font-weight:900; letter-spacing:4px; color:#3B82F6;">MMA MODE</span>
              </td>
            </tr>
            <tr>
              <td style="background:#12121A; border:1px solid #23232E; border-radius:16px; padding:32px 28px;">
                <p style="margin:0 0 6px; color:#6B7280; font-family:Arial, sans-serif; font-size:12px; text-transform:uppercase; letter-spacing:1px;">
                  Hola, ${name}
                </p>
                <h1 style="margin:0 0 20px; color:#F5F5F5; font-family:Arial, sans-serif; font-size:21px; font-weight:800; line-height:1.35;">
                  ${heading}
                </h1>

                ${statsHtml}

                <p style="margin:0 0 24px; color:#D1D5DB; font-family:Arial, sans-serif; font-size:15px; line-height:1.6;">
                  ${message}
                </p>

                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="background:#2563EB; border-radius:8px;">
                      <a href="${appUrl}" style="display:inline-block; padding:13px 28px; color:#FFFFFF; font-family:Arial, sans-serif; font-size:14px; font-weight:bold; text-decoration:none;">${ctaText}</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-top:20px;">
                <span style="color:#6B7280; font-family:Arial, sans-serif; font-size:11px;">MMA Mode — Personal Fight Tracker</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
