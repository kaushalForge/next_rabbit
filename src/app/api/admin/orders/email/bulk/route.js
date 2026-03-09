import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { cookies } from "next/headers";
import { dbConnect } from "@/lib/dbConnection";
import User from "@/models/user";
import { verifyJWT } from "@/lib/jwt";

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "inbox.rabbit@gmail.com",
        pass: process.env.RABBIT_EMAIL_PASSWORD,
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
    const cookieStore = await cookies();
    const token = cookieStore.get("cUser")?.value;
    const admin = await verifyJWT(token);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { subject, message } = await req.json();
    if (!subject?.trim() || !message?.trim()) {
      return NextResponse.json(
        { message: "Subject and message are required" },
        { status: 400 },
      );
    }

    await dbConnect();
    const customers = await User.find({ role: "customer" }, "email name");
    if (!customers.length) {
      return NextResponse.json(
        { message: "No customers found" },
        { status: 404 },
      );
    }

    const html = `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#374151;">
        <div style="font-size:15px;line-height:1.7;white-space:pre-wrap;">${message}</div>
        <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb;" />
        <p style="font-size:12px;color:#9ca3af;">RabbitHub Team</p>
      </div>
    `;

    // Send to all customers — fires concurrently
    const results = await Promise.allSettled(
      customers.map((c) =>
        sendEmail({ to: c.email, subject, text: message, html }),
      ),
    );

    const sent = results.filter(
      (r) => r.status === "fulfilled" && r.value,
    ).length;
    const failed = results.length - sent;

    return NextResponse.json(
      {
        message: `Sent to ${sent} customer(s)${failed ? `, ${failed} failed` : ""}`,
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
