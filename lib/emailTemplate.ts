import fs from "fs";
import path from "path";

// Inlined as a base64 data URI so the logo renders inside the email body
// without depending on external hosting.
const LOGO_DATA_URI = `data:image/svg+xml;base64,${fs
  .readFileSync(path.join(process.cwd(), "public", "email-avatar.svg"))
  .toString("base64")}`;

// Shared base template for all cron emails (Monday/Wednesday/Saturday).
// Kept as plain, table-based HTML with inline styles since Gmail, Outlook
// and Apple Mail all strip <style> blocks and external fonts.
export function buildEmailHtml({
  message,
  ctaText = "Abrir MMA Mode",
}: {
  message: string;
  ctaText?: string;
}): string {
  const appUrl = process.env.APP_URL || "#";

  return `<!DOCTYPE html>
<html lang="es">
  <body style="margin:0; padding:0; background:#080C14;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#080C14; padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; font-family: 'Arial Black', Arial, sans-serif;">
            <tr>
              <td align="center" style="padding-bottom:12px;">
                <img src="${LOGO_DATA_URI}" width="80" height="80" alt="MMA Mode" style="display:block; border-radius:50%;" />
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-bottom:20px;">
                <span style="color:#00B4FF; font-weight:bold; font-size:20px; letter-spacing:2px;">MMA MODE</span>
              </td>
            </tr>
            <tr>
              <td style="border-top:2px solid #0066FF; padding-bottom:24px; font-size:0; line-height:0;">&nbsp;</td>
            </tr>
            <tr>
              <td style="background:#0D1525; border-radius:12px; padding:28px 24px;">
                <p style="margin:0 0 24px; color:#E8F4FF; font-family: Arial, sans-serif; font-size:16px; line-height:1.6;">
                  ${message}
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0" align="center">
                  <tr>
                    <td style="background:#0066FF; border-radius:8px;">
                      <a href="${appUrl}" style="display:inline-block; padding:12px 28px; color:#E8F4FF; font-family: Arial, sans-serif; font-size:15px; font-weight:bold; text-decoration:none;">${ctaText}</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-top:20px;">
                <span style="color:#6a95c4; font-family: Arial, sans-serif; font-size:12px;">MMA Mode — Personal Fight Tracker</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
