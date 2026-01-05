import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";

/**
 * POST /api/auth/forgot-password
 * Initiates password reset flow
 * 
 * Request body:
 * - email: string (required)
 * 
 * Returns:
 * - 200: Success (always returns success to prevent email enumeration)
 * - 400: Missing email
 */
export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user by email
    const user = await User.findOne({ email });

    // Always return success to prevent email enumeration
    // Even if user doesn't exist, we return the same response
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If an account exists with this email, a password reset link has been sent.",
      });
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Set token expiry (30 minutes)
    const resetPasswordExpires = new Date();
    resetPasswordExpires.setMinutes(resetPasswordExpires.getMinutes() + 30);

    // Save token to user document
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = resetPasswordExpires;
    await user.save();

    // Generate reset URL with token in path
    const resetUrl = `${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/reset-password/${resetToken}`;

    // Send password reset email
    try {
      await sendPasswordResetEmail(user.email!, resetUrl);
    } catch (emailError) {
      console.error("Failed to send password reset email:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Failed to process password reset request:", error);
    return NextResponse.json(
      { error: "Failed to process password reset request. Please try again." },
      { status: 500 }
    );
  }
}


