import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import AuditLog from "@/models/audit-log";
import { requireAdmin } from "@/lib/admin-helpers";

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    await connectDB();

    const body = await req.json();
    const { userIds, reason } = body;

    // Validate input
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: "userIds must be a non-empty array" },
        { status: 400 }
      );
    }

    const reasonText = reason || "Payment confirmed by admin";

    // Fetch all users to be confirmed
    const users = await User.find({
      _id: { $in: userIds },
      role: "TALENT",
      paymentConfirmed: { $ne: true },
      paymentMethod: { $exists: true, $ne: null },
    });

    if (users.length === 0) {
      return NextResponse.json(
        { error: "No users found with pending payments" },
        { status: 404 }
      );
    }

    // Confirm payments and create audit logs
    const results = [];
    for (const user of users) {
      const beforeState = {
        frozen: user.frozen,
        paymentConfirmed: user.paymentConfirmed,
        paymentMethod: user.paymentMethod,
      };

      user.frozen = false;
      user.paymentConfirmed = true;
      user.restrictionReason = null;
      user.restrictionExpiresAt = null;
      user.restrictedBy = null;
      user.paymentAt = new Date();

      await user.save();

      // Create audit log
      await AuditLog.create({
        actorId: admin._id.toString(),
        actorRole: "ADMIN",
        targetUserId: user._id.toString(),
        targetUserRole: "TALENT",
        actionType: "OTHER",
        beforeState,
        afterState: {
          frozen: user.frozen,
          paymentConfirmed: user.paymentConfirmed,
          paymentMethod: user.paymentMethod,
        },
        reason: reasonText,
        metadata: {
          paymentMethod: user.paymentMethod,
          bulkConfirmation: true,
          totalConfirmed: users.length,
        },
      });

      results.push({
        userId: user._id.toString(),
        email: user.email,
        paymentMethod: user.paymentMethod,
        success: true,
      });
    }

    return NextResponse.json({
      success: true,
      confirmed: results.length,
      results,
    });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN") {
      return NextResponse.json(
        { error: "Forbidden. Admin access required." },
        { status: 403 }
      );
    }
    console.error("Failed to bulk confirm payments:", err);
    return NextResponse.json(
      { error: "Failed to confirm payments" },
      { status: 500 }
    );
  }
}
