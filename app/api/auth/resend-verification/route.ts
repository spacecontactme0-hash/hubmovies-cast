import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import { sendOtpEmail } from "@/lib/email";
import VerificationToken from "@/models/verification-token";
import { getUserId } from "@/lib/auth-helpers";

/**
 * POST /api/auth/resend-verification
 * Resends email verification link to the user
 * 
 * Request body:
 * - email: string (optional) - If not provided, uses authenticated user's email
 * 
 * Returns:
 * - 200: { success: true, message: string }
 * - 400: Missing email or user already verified
 * - 401: Unauthorized if email not provided and user not logged in
 * - 404: User not found
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    let email = body.email;

    // If email not provided, try to get from authenticated user
    if (!email) {
      const userId = await getUserId();
      if (!userId) {
        return NextResponse.json(
          { error: "Email is required or you must be logged in" },
          { status: 401 }
        );
      }

      await connectDB();
      const user = await User.findById(userId);
      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      email = user.email;
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Return success even if user doesn't exist (prevent email enumeration)
      return NextResponse.json({
        success: true,
        message: "If an account exists with this email, a verification link has been sent.",
      });
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email is already verified" },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP and store token (align with /api/auth/send-otp behavior)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const randomSuffix = Math.random().toString(36).slice(2, 8);
    const token = `${otp}:${randomSuffix}`;
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    try {
      await VerificationToken.create({ identifier: email, token, expires });
    } catch (err: any) {
      if (err.code === 11000) {
        const altToken = `${otp}:${Math.random().toString(36).slice(2, 8)}`;
        await VerificationToken.create({ identifier: email, token: altToken, expires });
      } else {
        console.error("Failed to create verification token:", err);
        // Proceed without failing — still return success message to avoid enumeration
      }
    }

    // Send OTP email (best-effort)
    try {
      await sendOtpEmail(email, otp, 10);
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, a verification link has been sent.",
    });
  } catch (error) {
    console.error("Failed to resend verification email:", error);
    return NextResponse.json(
      { error: "Failed to resend verification email. Please try again." },
      { status: 500 }
    );
  }
}



