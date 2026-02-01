import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import VerificationToken from "@/models/verification-token";
import { calculateTalentProfileCompletion } from "@/lib/profile-completion";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body.email || "").toLowerCase().trim();
    const otp = (body.otp || "").trim();

    if (!email || !otp) {
      return NextResponse.json({ error: "Missing email or OTP" }, { status: 400 });
    }

    await connectDB();

    // Find a token that starts with the otp (tokens are stored as `${otp}:${suffix}`)
    const verificationToken = await VerificationToken.findOne({
      identifier: email,
      token: { $regex: `^${otp}:` },
      expires: { $gt: new Date() },
    });

    if (!verificationToken) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Mark email verified
    user.emailVerified = new Date();
    await user.save();

    // Delete token
    await VerificationToken.deleteOne({ _id: verificationToken._id });

    // Prepare redirect similar to verify-email route
    let redirectUrl = "/";
    if (user.role === "TALENT") {
      const completion = calculateTalentProfileCompletion(user);
      redirectUrl = completion.complete && user.name ? "/talent/dashboard" : "/talent/profile";
    } else if (user.role === "DIRECTOR") {
      redirectUrl = "/director/dashboard";
    } else if (user.role === "ADMIN") {
      redirectUrl = "/admin/jobs";
    }

    const signInUrl = new URL("/auth/password", req.url);
    signInUrl.searchParams.set("email", email);
    signInUrl.searchParams.set("verified", "true");
    signInUrl.searchParams.set("redirect", redirectUrl);

    return NextResponse.json({ ok: true, redirect: signInUrl.toString() });
  } catch (err) {
    console.error("verify-otp error:", err);
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
  }
}
