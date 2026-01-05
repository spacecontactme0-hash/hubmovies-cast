import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import VerificationToken from "@/models/verification-token";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, password, role } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find and verify token
    const verificationToken = await VerificationToken.findOne({
      token,
      expires: { $gt: new Date() },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Find or create user
    let user = await User.findOne({ email: verificationToken.identifier });

    if (!user) {
      // Use provided role or default to TALENT
      const userRole = (role === "DIRECTOR" ? "DIRECTOR" : "TALENT") as "TALENT" | "DIRECTOR";
      
      user = await User.create({
        email: verificationToken.identifier,
        emailVerified: new Date(),
        role: userRole,
        verificationTier: "BASIC", // Initial tier for new users
      });
    }

    // Hash and set password
    const passwordHash = await bcrypt.hash(password, 10);
    user.passwordHash = passwordHash;
    user.emailVerified = new Date();
    await user.save();

    // Delete used token
    await VerificationToken.deleteOne({ token });

    return NextResponse.json({
      success: true,
      email: user.email,
    });
  } catch (error) {
    console.error("Failed to complete signup:", error);
    return NextResponse.json(
      { error: "Failed to complete signup. Please try again." },
      { status: 500 }
    );
  }
}

