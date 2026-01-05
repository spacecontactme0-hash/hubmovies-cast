import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import AuditLog from "@/models/audit-log";
import { requireAdmin } from "@/lib/admin-helpers";
import { getTrustLevel } from "@/lib/director-trust";

/**
 * POST /api/admin/trust/override
 * Apply admin trust override (tier change, restrictions, flags)
 * 
 * Request body:
 * - targetUserId: string (required)
 * - actionType: "TRUST_TIER_CHANGE" | "RESTRICTION_APPLIED" | "FLAG_ADDED" | etc.
 * - beforeState: object (required)
 * - afterState: object (required)
 * - reason: string (required)
 * - metadata?: object (optional)
 * 
 * Returns:
 * - 200: { success: true, user }
 * - 400: Invalid request
 * - 401: Unauthorized
 * - 403: Forbidden (not admin)
 * - 404: User not found
 */
export async function POST(req: Request) {
  try {
    // Require admin authentication
    const admin = await requireAdmin();
    const body = await req.json();
    const {
      targetUserId,
      actionType,
      beforeState,
      afterState,
      reason,
      metadata = {},
    } = body;

    // Validate required fields
    if (!targetUserId || !actionType || !beforeState || !afterState || !reason) {
      return NextResponse.json(
        { error: "Missing required fields: targetUserId, actionType, beforeState, afterState, reason" },
        { status: 400 }
      );
    }

    if (!reason.trim()) {
      return NextResponse.json(
        { error: "Reason is required and cannot be empty" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find target user
    const user = await User.findById(targetUserId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Apply changes based on action type
    let updatedUser = user;

    if (actionType === "TRUST_TIER_CHANGE") {
      if (user.role === "TALENT" && afterState.verificationTier) {
        user.verificationTier = afterState.verificationTier;
      } else if (user.role === "DIRECTOR" && afterState.trustScore !== undefined) {
        user.trustScore = Math.max(0, Math.min(100, afterState.trustScore));
      }
    } else if (actionType === "TRUST_SCORE_OVERRIDE") {
      if (user.role === "DIRECTOR" && afterState.trustScore !== undefined) {
        user.trustScore = Math.max(0, Math.min(100, afterState.trustScore));
      }
    }

    // Save user changes
    await user.save();
    updatedUser = await User.findById(targetUserId);

    // Create audit log entry
    await AuditLog.create({
      actorId: admin._id.toString(),
      actorRole: "ADMIN",
      targetUserId,
      targetUserRole: user.role as "TALENT" | "DIRECTOR",
      actionType,
      beforeState,
      afterState: {
        ...afterState,
        // Include current state for reference
        verificationTier: updatedUser?.verificationTier,
        trustScore: updatedUser?.trustScore,
      },
      reason: reason.trim(),
      metadata,
    });

    return NextResponse.json({
      success: true,
      user: {
        _id: updatedUser?._id.toString(),
        email: updatedUser?.email,
        name: updatedUser?.name,
        role: updatedUser?.role,
        verificationTier: updatedUser?.verificationTier,
        trustScore: updatedUser?.trustScore,
        trustLevel: updatedUser?.role === "DIRECTOR" ? getTrustLevel(updatedUser.trustScore) : null,
      },
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }
    if (error.message === "FORBIDDEN") {
      return NextResponse.json(
        { error: "Forbidden. Admin access required." },
        { status: 403 }
      );
    }
    console.error("Failed to apply trust override:", error);
    return NextResponse.json(
      { error: "Failed to apply trust override." },
      { status: 500 }
    );
  }
}

