import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import Job from "@/models/job";
import Application from "@/models/application";
import AuditLog from "@/models/audit-log";
import { requireAdmin } from "@/lib/admin-helpers";
import { getTrustLevel } from "@/lib/director-trust";

/**
 * GET /api/admin/trust/director/[id]
 * Get director trust data for admin override page
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

    if (user.role !== "DIRECTOR") {
      return NextResponse.json(
        { error: "User is not a director" },
        { status: 400 }
      );
    }

    // Calculate trust breakdown
    const jobsPosted = await Job.countDocuments({ directorId: id });
    const applicationsReviewed = await Application.countDocuments({
      jobId: { $in: await Job.find({ directorId: id }).distinct("_id") },
      status: { $in: ["shortlisted", "rejected"] },
    });
    const emailVerified = user.emailVerified ? 20 : 0;
    const profileComplete = user.name && user.email ? 20 : 0;
    const jobPosting = jobsPosted * 10;
    const applicationsReviewedScore = applicationsReviewed * 10;

    // Note: This is a simplified breakdown. In production, you'd track these separately.
    const trustBreakdown = {
      emailVerified,
      profileComplete,
      jobsPosted: jobPosting,
      applicationsReviewed: applicationsReviewedScore,
      reportedIssues: 0, // Would come from reports system
      lateResponses: 0, // Would come from messaging system
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
        trustScore: user.trustScore,
        trustLevel: getTrustLevel(user.trustScore),
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
    console.error("Failed to fetch director trust data:", error);
    return NextResponse.json(
      { error: "Failed to fetch director trust data." },
      { status: 500 }
    );
  }
}

