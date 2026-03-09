import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { cookies } from "next/headers";
import { dbConnect } from "@/lib/dbConnection";
import User from "@/models/user";
import { verifyJWT } from "@/lib/jwt";

const buildBulkEmailHtml = ({ customerName, message }) => {
  const siteUrl = "https://next-rabbit.vercel.app";
  const logoUrl = `${siteUrl}/images/RabbitHub.png`;
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>RabbitHub</title>
</head>
<body style="margin:0;padding:0;background-color:#f6f6f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f6f6f6;margin:0;padding:0;">
    <tr>
      <td align="center" style="padding:0;margin:0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border-collapse:collapse;">

          <!-- TOP ACCENT BAR -->
          <tr>
            <td style="background:#ff4500;height:5px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- HEADER -->
          <tr>
            <td style="background:#0f0f0f;padding:36px 48px;text-align:center;">
              <img src="${logoUrl}" alt="RabbitHub" width="64" height="64"
                style="display:block;margin:0 auto 16px;border-radius:14px;border:3px solid #ff4500;width:64px;height:64px;object-fit:cover;object-position:top;" />
              <p style="margin:0;font-size:26px;font-weight:800;letter-spacing:-0.5px;">
                <span style="color:#ffffff;">Rabbit</span><span style="color:#ff4500;">Hub</span>
              </p>
              <p style="margin:8px 0 0;font-size:11px;color:#a1a1aa;letter-spacing:0.14em;text-transform:uppercase;">
                Your Trusted Shopping Destination
              </p>
            </td>
          </tr>

          <!-- BADGE -->
          <tr>
            <td style="background:#fafafa;border-top:1px solid #e4e4e7;border-bottom:1px solid #e4e4e7;padding:14px 48px;text-align:center;">
              <span style="font-size:11px;font-weight:600;color:#71717a;letter-spacing:0.1em;text-transform:uppercase;">
                Message from &nbsp;·&nbsp;
                <span style="color:#ff4500;background:#fff4f0;border-radius:6px;padding:3px 12px;font-size:12px;font-weight:700;letter-spacing:0.08em;">
                  RabbitHub Team
                </span>
              </span>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:44px 48px 36px;text-align:center;background:#ffffff;">
              <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.1em;">Hello there,</p>
              <p style="margin:0 0 32px;font-size:28px;font-weight:800;color:#09090b;letter-spacing:-0.5px;line-height:1.2;">
                ${customerName} &#128075;
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr><td style="height:1px;background:#e4e4e7;font-size:0;line-height:0;">&nbsp;</td></tr>
              </table>

              <!-- Message bubble -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:36px;">
                <tr>
                  <td style="background:#fff8f6;border:1.5px solid #ffd5c8;border-radius:12px;padding:28px 32px;text-align:left;">
                    <p style="margin:0 0 10px;font-size:10px;font-weight:700;color:#ff4500;letter-spacing:0.16em;text-transform:uppercase;">Message from RabbitHub</p>
                    <p style="margin:0;font-size:15px;color:#374151;line-height:1.85;white-space:pre-wrap;">${message}</p>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" style="margin:0 auto 10px;">
                <tr>
                  <td style="background:#ff4500;border-radius:10px;">
                    <a href="${siteUrl}" style="display:inline-block;padding:14px 40px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.02em;">
                      Shop Now &nbsp;&#8594;
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:14px 0 0;font-size:12px;color:#a1a1aa;">
                Or visit &nbsp;<a href="${siteUrl}" style="color:#ff4500;font-weight:600;text-decoration:none;">next-rabbit.vercel.app</a>
              </p>
            </td>
          </tr>

          <!-- DIVIDER -->
          <tr>
            <td style="padding:0 48px;background:#ffffff;">
              <div style="height:1px;background:#e4e4e7;"></div>
            </td>
          </tr>

          <!-- TRUST BADGES -->
          <tr>
            <td style="padding:28px 48px;text-align:center;background:#fafafa;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="33%" style="text-align:center;padding:0 8px;">
                    <p style="margin:0 0 4px;font-size:20px;">&#128666;</p>
                    <p style="margin:0;font-size:11px;font-weight:600;color:#374151;">Fast Delivery</p>
                    <p style="margin:2px 0 0;font-size:10px;color:#a1a1aa;">3&#8211;5 business days</p>
                  </td>
                  <td width="33%" style="text-align:center;padding:0 8px;border-left:1px solid #e4e4e7;border-right:1px solid #e4e4e7;">
                    <p style="margin:0 0 4px;font-size:20px;">&#128274;</p>
                    <p style="margin:0;font-size:11px;font-weight:600;color:#374151;">Secure Payments</p>
                    <p style="margin:2px 0 0;font-size:10px;color:#a1a1aa;">100% protected</p>
                  </td>
                  <td width="33%" style="text-align:center;padding:0 8px;">
                    <p style="margin:0 0 4px;font-size:20px;">&#128172;</p>
                    <p style="margin:0;font-size:11px;font-weight:600;color:#374151;">24/7 Support</p>
                    <p style="margin:2px 0 0;font-size:10px;color:#a1a1aa;">Always here for you</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:28px 48px;text-align:center;background:#0f0f0f;">
              <p style="margin:0 0 8px;font-size:16px;font-weight:800;">
                <span style="color:#ffffff;">Rabbit</span><span style="color:#ff4500;">Hub</span>
              </p>
              <p style="margin:0 0 12px;font-size:11px;color:#a1a1aa;">
                Questions? &nbsp;<a href="mailto:inbox.rabbit@gmail.com" style="color:#ff4500;text-decoration:none;font-weight:600;">inbox.rabbit@gmail.com</a>
              </p>
              <p style="margin:0;font-size:10px;color:#71717a;line-height:1.7;">
                &copy; ${year} RabbitHub &nbsp;&middot;&nbsp; All rights reserved.<br/>
                You are receiving this email as a registered customer of RabbitHub.
              </p>
            </td>
          </tr>

          <!-- BOTTOM ACCENT BAR -->
          <tr>
            <td style="background:#ff4500;height:4px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
};

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "inbox.rabbit@gmail.com",
        pass: process.env.NEXT_PUBLIC_RABBIT_EMAIL_PASSWORD,
      },
    });
    await transporter.sendMail({
      from: '"RabbitHub" <inbox.rabbit@gmail.com>',
      to,
      subject,
      text,
      html,
    });
    return true;
  } catch (err) {
    console.error("Bulk email send error:", err);
    return false;
  }
};

export async function POST(req) {
  try {
    // 1. Auth
    const cookieStore = await cookies();
    const token = cookieStore.get("cUser")?.value;
    const admin = await verifyJWT(token);
    if (!admin || admin.payload.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Validate body
    const { subject, message, excludedIds = [] } = await req.json();
    if (!subject?.trim() || !message?.trim()) {
      return NextResponse.json(
        { message: "Subject and message are required" },
        { status: 400 },
      );
    }

    // 3. Fetch customers and apply exclusions
    await dbConnect();
    const allCustomers = await User.find(
      { role: "customer" },
      "email name",
    ).lean();

    const excludedSet = new Set(excludedIds.map(String));
    const recipients = allCustomers.filter(
      (c) => !excludedSet.has(String(c._id)),
    );

    if (!recipients.length) {
      return NextResponse.json(
        { message: "No recipients — all customers are excluded" },
        { status: 400 },
      );
    }

    // 4. Send personalised email to each recipient
    const results = await Promise.allSettled(
      recipients.map((c) => {
        const html = buildBulkEmailHtml({
          customerName: c.name || "Valued Customer",
          message,
        });
        return sendEmail({ to: c.email, subject, text: message, html });
      }),
    );

    const sent = results.filter(
      (r) => r.status === "fulfilled" && r.value,
    ).length;
    const failed = results.length - sent;
    const skipped = allCustomers.length - recipients.length;

    return NextResponse.json(
      {
        message: [
          `Sent to ${sent} customer${sent !== 1 ? "s" : ""}`,
          skipped ? `${skipped} excluded` : null,
          failed ? `${failed} failed` : null,
        ]
          .filter(Boolean)
          .join(" · "),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("POST /api/admin/orders/email/bulk error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
