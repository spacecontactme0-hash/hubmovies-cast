import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import AuditLog from "@/models/audit-log";
import { requireAdmin } from "@/lib/admin-helpers";

/**
 * POST /api/admin/restrictions/director/[id]
 * Apply or remove restrictions on a director account
 * 
 * Request body:
 * - action: "FREEZE_POSTING" | "UNFREEZE_POSTING" | "DISABLE_MESSAGING" | "ENABLE_MESSAGING" | "FLAG_HIGH_RISK" | "REMOVE_HIGH_RISK"
 * - reason: string (required)
 * - expiresAt?: string (optional ISO date, null = indefinite)
 * 
 * Returns:
 * - 200: { success: true, user }
 * - 400: Invalid request
 * - 401: Unauthorized
 * - 403: Forbidden (not admin)
 * - 404: User not found
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const { action, reason, expiresAt } = body;

    if (!action || !reason?.trim()) {
      return NextResponse.json(
        { error: "Missing required fields: action and reason" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(id);
    if (!user || user.role !== "DIRECTOR") {
      return NextResponse.json(
        { error: "Director user not found" },
        { status: 404 }
      );
    }

    const beforeState = {
      postingFrozen: user.postingFrozen,
      messagingDisabled: user.messagingDisabled,
      highRisk: user.highRisk,
    };

    let afterState = { ...beforeState };
    let actionType = "";

    switch (action) {
      case "FREEZE_POSTING":
        user.postingFrozen = true;
        user.restrictionReason = reason.trim();
        user.restrictionExpiresAt = expiresAt ? new Date(expiresAt) : null;
        user.restrictedBy = admin._id.toString();
        afterState.postingFrozen = true;
        actionType = "RESTRICTION_APPLIED";
        break;
      case "UNFREEZE_POSTING":
        user.postingFrozen = false;
        user.restrictionReason = null;
        user.restrictionExpiresAt = null;
        user.restrictedBy = null;
        afterState.postingFrozen = false;
        actionType = "RESTRICTION_REMOVED";
        break;
      case "DISABLE_MESSAGING":
        user.messagingDisabled = true;
        user.restrictionReason = reason.trim();
        user.restrictionExpiresAt = expiresAt ? new Date(expiresAt) : null;
        user.restrictedBy = admin._id.toString();
        afterState.messagingDisabled = true;
        actionType = "RESTRICTION_APPLIED";
        break;
      case "ENABLE_MESSAGING":
        user.messagingDisabled = false;
        user.restrictionReason = null;
        user.restrictionExpiresAt = null;
        user.restrictedBy = null;
        afterState.messagingDisabled = false;
        actionType = "RESTRICTION_REMOVED";
        break;
      case "FLAG_HIGH_RISK":
        user.highRisk = true;
        user.restrictionReason = reason.trim();
        user.restrictedBy = admin._id.toString();
        afterState.highRisk = true;
        actionType = "FLAG_ADDED";
        break;
      case "REMOVE_HIGH_RISK":
        user.highRisk = false;
        user.restrictionReason = null;
        user.restrictedBy = null;
        afterState.highRisk = false;
        actionType = "FLAG_REMOVED";
        break;
      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

    await user.save();

    await AuditLog.create({
      actorId: admin._id.toString(),
      actorRole: "ADMIN",
      targetUserId: id,
      targetUserRole: "DIRECTOR",
      actionType,
      beforeState,
      afterState,
      reason: reason.trim(),
      metadata: { expiresAt: expiresAt || null },
    });

    return NextResponse.json({
      success: true,
      user: {
        _id: user._id.toString(),
        postingFrozen: user.postingFrozen,
        messagingDisabled: user.messagingDisabled,
        highRisk: user.highRisk,
        restrictionReason: user.restrictionReason,
        restrictionExpiresAt: user.restrictionExpiresAt,
      },
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json(
        { error: error.message === "FORBIDDEN" ? "Forbidden. Admin access required." : "Unauthorized." },
        { status: error.message === "FORBIDDEN" ? 403 : 401 }
      );
    }
    console.error("Failed to apply director restriction:", error);
    return NextResponse.json(
      { error: "Failed to apply restriction." },
      { status: 500 }
    );
  }
}

