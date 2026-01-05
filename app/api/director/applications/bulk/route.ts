import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Application from "@/models/application";
import Job from "@/models/job";
import User from "@/models/user";
import Notification from "@/models/notification";
import { sendApplicationStatusEmail } from "@/lib/email";
import { getDirectorId } from "@/lib/auth-helpers";
import { getTrustLevel, getDirectorCapabilities } from "@/lib/director-trust";

/**
 * PATCH /api/director/applications/bulk
 * Updates the status of multiple applications (bulk action)
 * Only allows updates for applications to jobs owned by the authenticated director
 * 
 * Request body:
 * - applicationIds: string[] (required) - Array of application IDs
 * - status: "shortlisted" | "rejected" (required)
 * 
 * Returns:
 * - 200: { updated: number, applications: Application[] } - Number updated and updated applications
 * - 400: Missing or invalid parameters
 * - 401: Unauthorized if user is not logged in
 * - 403: Forbidden if director doesn't own any of the jobs
 */
export async function PATCH(req: Request) {
  // Get authenticated director ID
  const directorId = await getDirectorId();
  if (!directorId) {
    return NextResponse.json(
      { error: "Unauthorized. Please log in to update applications." },
      { status: 401 }
    );
  }

  // Parse request body
  const body = await req.json();
  const { applicationIds, status } = body;
  const action = status === "shortlisted" ? "shortlist" : "reject";

  // Validate required fields
  if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
    return NextResponse.json(
      { error: "Missing or invalid applicationIds. Must be a non-empty array." },
      { status: 400 }
    );
  }

  // Validate status
  if (!status || !["shortlisted", "rejected"].includes(status)) {
    return NextResponse.json(
      { error: "Invalid status. Must be 'shortlisted' or 'rejected'." },
      { status: 400 }
    );
  }

  // Connect to MongoDB
  await connectDB();

  try {
    // Get director trust level and capabilities
    const director = await User.findById(directorId);
    if (!director) {
      return NextResponse.json(
        { error: "Director not found" },
        { status: 404 }
      );
    }

    const trustScore = director.trustScore || 0;
    const trustLevel = getTrustLevel(trustScore);
    const capabilities = getDirectorCapabilities(trustLevel);

    // Enforce bulk action capabilities
    if (action === "shortlist" && !capabilities.canBulkShortlist) {
      return NextResponse.json(
        {
          error: "BULK_ACTION_NOT_ALLOWED",
          message: "Bulk shortlisting is not available at your current trust level. Build your trust to unlock this feature.",
        },
        { status: 403 }
      );
    }

    if (action === "reject" && !capabilities.canBulkReject) {
      return NextResponse.json(
        {
          error: "BULK_ACTION_NOT_ALLOWED",
          message: "Bulk rejection is not available at your current trust level. Build your trust to unlock this feature.",
        },
        { status: 403 }
      );
    }

    // Find all applications
    const applications = await Application.find({
      _id: { $in: applicationIds },
    });

    if (applications.length === 0) {
      return NextResponse.json(
        { error: "No applications found." },
        { status: 404 }
      );
    }

    // Verify all applications belong to jobs owned by this director
    const jobIds = [...new Set(applications.map((app) => app.jobId))];
    const jobs = await Job.find({ _id: { $in: jobIds } });

    for (const job of jobs) {
      if (job.directorId.toString() !== directorId) {
        return NextResponse.json(
          { error: "Forbidden. You don't have access to one or more of these applications." },
          { status: 403 }
        );
      }
    }

    // Update all applications
    const updateResult = await Application.updateMany(
      { _id: { $in: applicationIds } },
      { $set: { status } }
    );

    // Update director trust score incrementally (applications reviewed: +10 per application)
    try {
      const { incrementDirectorTrustScore } = await import("@/lib/profile-completion");
      await incrementDirectorTrustScore(directorId, 10 * applicationIds.length);
    } catch (error) {
      console.error("Failed to update director trust score:", error);
      // Don't fail the request if trust score update fails
    }

    // Fetch updated applications
    const updatedApplications = await Application.find({
      _id: { $in: applicationIds },
    });

    // Create notifications for all talents
    const notificationPromises = updatedApplications.map(async (app) => {
      const job = jobs.find((j) => j._id.toString() === app.jobId);
      if (!job) return;

      await Notification.create({
        userId: app.talentId,
        type: "application_status",
        entityId: app._id.toString(),
        title: `Application ${status === "shortlisted" ? "Shortlisted" : "Rejected"}`,
        message: `Your application for "${job.title}" has been ${status}.`,
        read: false,
      });

      // Send email notification (if talent email is available)
      // TODO: Get talent email from Talent model when available
      try {
        // In production, fetch talent email from Talent model
        // const talent = await Talent.findById(app.talentId);
        // if (talent?.email) {
        //   await sendApplicationStatusEmail(talent.email, job.title, status);
        // }
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
      }
    });

    await Promise.all(notificationPromises);

    // Format applications for response
    const formattedApplications = updatedApplications.map((app) => ({
      _id: app._id.toString(),
      jobId: app.jobId,
      talentId: app.talentId,
      answer: app.answer,
      mediaUrl: app.mediaUrl,
      status: app.status,
      createdAt: app.createdAt.toISOString(),
    }));

    return NextResponse.json({
      updated: updateResult.modifiedCount,
      applications: formattedApplications,
    });
  } catch (error) {
    console.error("Failed to update applications:", error);
    return NextResponse.json(
      { error: "Failed to update applications. Please try again." },
      { status: 500 }
    );
  }
}

