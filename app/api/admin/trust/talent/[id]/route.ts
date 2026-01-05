import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import AuditLog from "@/models/audit-log";
import { requireAdmin } from "@/lib/admin-helpers";
import { calculateTalentProfileCompletion } from "@/lib/profile-completion";

/**
 * GET /api/admin/trust/talent/[id]
 * Get talent trust data for admin override page
 * 
 * Returns:
 * - 200: { user, trustBreakdown, history }
 * - 401: Unauthorized
 * - 403: Forbidden (not admin)
 * - 404: User not found
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require admin authentication
    const admin = await requireAdmin();
    const { id } = await params;

    await connectDB();

    // Find user
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.role !== "TALENT") {
      return NextResponse.json(
        { error: "User is not a talent" },
        { status: 400 }
      );
    }

    // Calculate trust breakdown (profile completion based)
    const completion = calculateTalentProfileCompletion(user);
    const trustBreakdown = {
      profileCompletion: completion.score,
      emailVerified: user.emailVerified ? 10 : 0,
      profilePhoto: user.image ? 15 : 0,
      fullName: user.name ? 10 : 0,
      bio: user.bio ? 15 : 0,
      primaryRole: user.primaryRole ? 10 : 0,
      skills: user.skills?.length > 0 ? 10 : 0,
      experience: user.experience?.length > 0 ? 5 : 0,
      portfolio: user.portfolio?.length > 0 ? 15 : 0,
    };

    // Get audit log history for this user
    const history = await AuditLog.find({ targetUserId: id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({
      user: {
        _id: user._id.toString(),
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role,
        verificationTier: user.verificationTier,
        profileCompletion: user.profileCompletion,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
      },
      trustBreakdown,
      history: history.map((log) => ({
        _id: log._id.toString(),
        actionType: log.actionType,
        beforeState: log.beforeState,
        afterState: log.afterState,
        reason: log.reason,
        actorId: log.actorId,
        actorRole: log.actorRole,
        createdAt: log.createdAt,
      })),
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
    console.error("Failed to fetch talent trust data:", error);
    return NextResponse.json(
      { error: "Failed to fetch talent trust data." },
      { status: 500 }
    );
  }
}

