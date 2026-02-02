import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import AuditLog from "@/models/audit-log";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { paymentMethod, paymentReference } = body;

    if (!paymentMethod || !["ETH", "BTC"].includes(paymentMethod)) {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
    }

    if (!paymentReference || !paymentReference.trim()) {
      return NextResponse.json({ error: "Payment reference is required" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role !== "TALENT") {
      return NextResponse.json({ error: "Only talents can submit payments" }, { status: 403 });
    }

    // Record payment submission (not confirmed yet)
    const beforeState = {
      paymentConfirmed: user.paymentConfirmed,
      paymentMethod: user.paymentMethod,
      paymentReference: user.paymentReference,
      frozen: user.frozen,
    };

    user.paymentMethod = paymentMethod;
    user.paymentReference = paymentReference.trim();
    // Keep frozen = true until admin confirms payment
    // paymentConfirmed stays false until admin verifies

    await user.save();

    // Create audit log for payment submission
    await AuditLog.create({
      actorId: userId,
      actorRole: "SYSTEM",
      targetUserId: userId,
      targetUserRole: "TALENT",
      actionType: "OTHER",
      beforeState,
      afterState: {
        paymentMethod: user.paymentMethod,
        paymentReference: user.paymentReference,
        frozen: user.frozen,
      },
      reason: `Talent submitted ${paymentMethod} payment for profile registration`,
      metadata: {
        paymentMethod,
        paymentReference: paymentReference.trim(),
        submittedAt: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Payment submitted. An admin will verify and unlock your account shortly.",
    });
  } catch (err: any) {
    console.error("Failed to submit payment:", err);
    return NextResponse.json(
      { error: "Failed to submit payment. Please try again." },
      { status: 500 }
    );
  }
}
