import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import AuditLog from "@/models/audit-log";
import { requireAdmin } from "@/lib/admin-helpers";

/**
 * POST /api/admin/restrictions/talent/[id]
 * Apply or remove restrictions on a talent account
 * 
 * Request body:
 * - action: "FREEZE" | "UNFREEZE" | "SHADOW_LIMIT" | "REMOVE_SHADOW_LIMIT"
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
    if (!user || user.role !== "TALENT") {
      return NextResponse.json(
        { error: "Talent user not found" },
        { status: 404 }
      );
    }

    const beforeState = {
      frozen: user.frozen,
      shadowLimited: user.shadowLimited,
    };

    let afterState = { ...beforeState };

    switch (action) {
      case "FREEZE":
        user.frozen = true;
        user.restrictionReason = reason.trim();
        user.restrictionExpiresAt = expiresAt ? new Date(expiresAt) : null;
        user.restrictedBy = admin._id.toString();
        afterState.frozen = true;
        break;
      case "UNFREEZE":
        user.frozen = false;
        user.restrictionReason = null;
        user.restrictionExpiresAt = null;
        user.restrictedBy = null;
        afterState.frozen = false;
        break;
      case "SHADOW_LIMIT":
        user.shadowLimited = true;
        user.restrictionReason = reason.trim();
        user.restrictionExpiresAt = expiresAt ? new Date(expiresAt) : null;
        user.restrictedBy = admin._id.toString();
        afterState.shadowLimited = true;
        break;
      case "REMOVE_SHADOW_LIMIT":
        user.shadowLimited = false;
        user.restrictionReason = null;
        user.restrictionExpiresAt = null;
        user.restrictedBy = null;
        afterState.shadowLimited = false;
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
      targetUserRole: "TALENT",
      actionType: action === "FREEZE" || action === "UNFREEZE" 
        ? (action === "FREEZE" ? "ACCOUNT_FROZEN" : "ACCOUNT_UNFROZEN")
        : (action === "SHADOW_LIMIT" ? "RESTRICTION_APPLIED" : "RESTRICTION_REMOVED"),
      beforeState,
      afterState,
      reason: reason.trim(),
      metadata: { expiresAt: expiresAt || null },
    });

    return NextResponse.json({
      success: true,
      user: {
        _id: user._id.toString(),
        frozen: user.frozen,
        shadowLimited: user.shadowLimited,
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
    console.error("Failed to apply talent restriction:", error);
    return NextResponse.json(
      { error: "Failed to apply restriction." },
      { status: 500 }
    );
  }
}

