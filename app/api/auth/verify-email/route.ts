import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import VerificationToken from "@/models/verification-token";
import { calculateTalentProfileCompletion } from "@/lib/profile-completion";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      return NextResponse.redirect(new URL("/auth/error?error=InvalidVerification", req.url));
    }

    await connectDB();

    // Find and verify token
    const verificationToken = await VerificationToken.findOne({
      token,
      identifier: email,
      expires: { $gt: new Date() },
    });

    if (!verificationToken) {
      return NextResponse.redirect(new URL("/auth/error?error=InvalidOrExpiredToken", req.url));
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.redirect(new URL("/auth/error?error=UserNotFound", req.url));
    }

    // Verify email
    user.emailVerified = new Date();
    await user.save();

    // Delete used token
    await VerificationToken.deleteOne({ token });

    // Check profile completion to determine redirect
    let redirectUrl = "/";
    
    if (user.role === "TALENT") {
      const completion = calculateTalentProfileCompletion(user);
      if (completion.complete && user.name) {
        // Profile complete, go to dashboard
        redirectUrl = "/talent/dashboard";
      } else {
        // Profile incomplete, go to profile completion
        redirectUrl = "/talent/profile";
      }
    } else if (user.role === "DIRECTOR") {
      if (user.name) {
        // Has name, go to dashboard
        redirectUrl = "/director/dashboard";
      } else {
        // No name, go to dashboard (directors can complete profile later)
        redirectUrl = "/director/dashboard";
      }
    } else if (user.role === "ADMIN") {
      redirectUrl = "/admin";
    }

    // Redirect to password sign-in page with verified status
    // User will sign in with their password after email verification
    const signInUrl = new URL("/auth/password", req.url);
    signInUrl.searchParams.set("email", email);
    signInUrl.searchParams.set("verified", "true");
    signInUrl.searchParams.set("redirect", redirectUrl);

    return NextResponse.redirect(signInUrl);
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.redirect(new URL("/auth/error?error=VerificationFailed", req.url));
  }
}

