import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { sendOtpEmail } from "@/lib/email";
import VerificationToken from "@/models/verification-token";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const { email, password, role } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const userRole = (role === "DIRECTOR" ? "DIRECTOR" : "TALENT") as "TALENT" | "DIRECTOR";

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user with password (email not verified yet)
    const user = await User.create({
      email,
      passwordHash,
      role: userRole,
      emailVerified: null, // Will be verified when they click the email link
      verificationTier: "BASIC",
    });

    // Generate 6-digit OTP and store token (same pattern as /api/auth/send-otp)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const randomSuffix = Math.random().toString(36).slice(2, 8);
    const token = `${otp}:${randomSuffix}`;
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minute expiry

    try {
      await VerificationToken.create({ identifier: email, token, expires });
    } catch (err: any) {
      if (err.code === 11000) {
        const altToken = `${otp}:${Math.random().toString(36).slice(2, 8)}`;
        await VerificationToken.create({ identifier: email, token: altToken, expires });
      } else {
        console.error("Failed to create verification token:", err);
        return NextResponse.json({ error: "Failed to create verification token" }, { status: 500 });
      }
    }

    // Send OTP email (best-effort)
    let emailSent = false;
    try {
      emailSent = await sendOtpEmail(email, otp, 10);
    } catch (err) {
      console.error("Failed to send OTP email:", err);
      emailSent = false;
    }

    return NextResponse.json({
      success: true,
      emailSent: !!emailSent,
      message: emailSent
        ? "Account created. Please check your email to verify your account."
        : "Account created but verification email could not be sent. Please contact support or re-request verification.",
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    
    // Handle duplicate email error
    if (error.code === 11000 || error.message?.includes("duplicate")) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}

