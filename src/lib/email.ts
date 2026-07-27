/**
 * Resend 邮件发送
 *
 * MVP 阶段：用户付款后发送确认邮件，AI 生成报告后发送含 PDF 的交付邮件。
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const FROM_EMAIL = process.env.FROM_EMAIL || "Bazi Bliss <report@bazibliss.com>";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    content_type?: string;
  }>;
}

export async function sendEmail(params: SendEmailParams): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.warn("⚠ RESEND_API_KEY not set. Email not sent.");
    console.log("Would send to:", params.to);
    console.log("Subject:", params.subject);
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [params.to],
        subject: params.subject,
        html: params.html,
        attachments: params.attachments?.map((a) => ({
          filename: a.filename,
          content:
            typeof a.content === "string"
              ? Buffer.from(a.content).toString("base64")
              : a.content.toString("base64"),
        })),
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend error:", err);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Failed to send email:", err);
    return false;
  }
}

export function buildConfirmationEmail(name: string, productName: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: system-ui, sans-serif; background: #fafaf9; padding: 40px 20px;">
  <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; border: 1px solid #e7e5e4;">
    <h1 style="font-size: 24px; color: #1c1917; margin-bottom: 8px;">Order Confirmed!</h1>
    <p style="color: #78716c; margin-bottom: 24px;">Thank you for your order, ${name}.</p>

    <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <p style="font-weight: 600; color: #92400e; margin-bottom: 4px;">${productName}</p>
      <p style="color: #a16207; font-size: 14px; margin: 0;">Your personalized Bazi report is being crafted.</p>
    </div>

    <h2 style="font-size: 16px; color: #1c1917;">What happens next?</h2>
    <ol style="color: #78716c; padding-left: 20px; line-height: 1.8;">
      <li>We calculate your birth chart using your provided birth information.</li>
      <li>Our AI generates your comprehensive, personalized report.</li>
      <li>The report is reviewed for quality before delivery.</li>
      <li>You'll receive your PDF report within 24 hours (usually much sooner).</li>
    </ol>

    <p style="color: #78716c; font-size: 14px; margin-top: 24px;">
      If you have any questions, just reply to this email.
    </p>

    <hr style="border: none; border-top: 1px solid #e7e5e4; margin: 24px 0;" />
    <p style="font-size: 12px; color: #a8a29e; margin: 0;">
      Bazi Bliss — Ancient wisdom for modern clarity.<br>
      For entertainment purposes only.
    </p>
  </div>
</body>
</html>`;
}

export function buildReportDeliveryEmail(
  name: string,
  productName: string,
  reportMarkdown: string
): string {
  const reportHtml = reportMarkdown
    .replace(/^### (.+)$/gm, '<h3 style="color:#1c1917;margin-top:20px;">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="color:#1c1917;margin-top:28px;">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="color:#1c1917;">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n\n/g, "</p><p style='color:#44403c;line-height:1.8;margin-bottom:12px;'>")
    .replace(/^- (.+)$/gm, '<li style="color:#44403c;">$1</li>');

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: system-ui, sans-serif; background: #fafaf9; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; border: 1px solid #e7e5e4;">
    <h1 style="font-size: 24px; color: #b45309; margin-bottom: 4px;">Your ${productName} Is Ready!</h1>
    <p style="color: #78716c; margin-bottom: 24px;">Hi ${name}, your personalized Bazi report is attached as a PDF. Here's a preview:</p>

    <div style="border-left: 3px solid #d97706; padding-left: 16px; margin-bottom: 24px;">
      <p style="color: #44403c; line-height: 1.8;">${reportHtml}</p>
    </div>

    <div style="background: #fafaf9; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
      <p style="color: #1c1917; font-weight: 600; font-size: 14px; margin-bottom: 4px;">Want to go deeper?</p>
      <p style="color: #78716c; font-size: 14px; margin: 0;">Reply to this email with any follow-up questions about your report.</p>
    </div>

    <hr style="border: none; border-top: 1px solid #e7e5e4; margin: 24px 0;" />
    <p style="font-size: 12px; color: #a8a29e; margin: 0;">
      Remember: your chart reveals tendencies, not destiny. You always have free will.<br><br>
      Bazi Bliss — Ancient wisdom for modern clarity.<br>
      For entertainment purposes only.
    </p>
  </div>
</body>
</html>`;
}
