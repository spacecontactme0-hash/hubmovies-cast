import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import VerificationToken from "@/models/verification-token";
import { sendOtpEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body.email || "").toLowerCase().trim();

    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const randomSuffix = Math.random().toString(36).slice(2, 8);
    const token = `${otp}:${randomSuffix}`;
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await connectDB();

    // Create verification token
    try {
      await VerificationToken.create({ identifier: email, token, expires });
    } catch (err: any) {
      // Handle duplicate key by retrying once with a new suffix
      if (err.code === 11000) {
        const altToken = `${otp}:${Math.random().toString(36).slice(2, 8)}`;
        await VerificationToken.create({ identifier: email, token: altToken, expires });
      } else {
        console.error("Failed to create verification token:", err);
        return NextResponse.json({ error: "Failed to create OTP" }, { status: 500 });
      }
    }

    // Send OTP email (best-effort) and return diagnostic
    let emailSent = false;
    try {
      emailSent = await sendOtpEmail(email, otp, 10);
    } catch (err) {
      console.error("Failed to send OTP email:", err);
      emailSent = false;
    }

    return NextResponse.json({ ok: true, emailSent });
  } catch (err) {
    console.error("send-otp error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
