import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Application from "@/models/application";
import Job from "@/models/job";
import Notification from "@/models/notification";
import { sendApplicationStatusEmail } from "@/lib/email";
import { getDirectorId } from "@/lib/auth-helpers";

/**
 * PATCH /api/director/applications/[id]
 * Updates the status of an application (shortlist/reject)
 * Only allows updates for applications to jobs owned by the authenticated director
 * 
 * Request body:
 * - status: "shortlisted" | "rejected" (required)
 * 
 * Returns:
 * - 200: { application: Application } - Updated application
 * - 400: Missing or invalid status
 * - 401: Unauthorized if user is not logged in
 * - 403: Forbidden if director doesn't own the job
 * - 404: Application not found
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
  const { status } = body;

  // Validate status
  if (!status || !["shortlisted", "rejected"].includes(status)) {
    return NextResponse.json(
      { error: "Invalid status. Must be 'shortlisted' or 'rejected'." },
      { status: 400 }
    );
  }

  // Await params (Next.js 16+ requirement)
  const { id } = await params;

  // Connect to MongoDB
  await connectDB();

  try {
    // Find the application
    const application = await Application.findById(id);
    if (!application) {
      return NextResponse.json(
        { error: "Application not found." },
        { status: 404 }
      );
    }

    // Verify the job exists and belongs to this director
    const job = await Job.findById(application.jobId);
    if (!job) {
      return NextResponse.json(
        { error: "Job not found." },
        { status: 404 }
      );
    }

    // Check if director owns this job
    if (job.directorId.toString() !== directorId) {
      return NextResponse.json(
        { error: "Forbidden. You don't have access to this application." },
        { status: 403 }
      );
    }

    // Update application status
    application.status = status;
    await application.save();

    // Update director trust score incrementally (application reviewed: +10)
    try {
      const { incrementDirectorTrustScore } = await import("@/lib/profile-completion");
      await incrementDirectorTrustScore(directorId, 10);
    } catch (error) {
      console.error("Failed to update director trust score:", error);
      // Don't fail the request if trust score update fails
    }

    // Create notification for talent
    await Notification.create({
      userId: application.talentId,
      type: "application_status",
      entityId: application._id.toString(),
      title: `Application ${status === "shortlisted" ? "Shortlisted" : "Rejected"}`,
      message: `Your application for "${job.title}" has been ${status}.`,
      read: false,
    });

    // Send email notification (if talent email is available)
    // TODO: Get talent email from Talent model when available
    // For now, email sending will be skipped if email is not available
    try {
      // In production, fetch talent email from Talent model
      // const talent = await Talent.findById(application.talentId);
      // if (talent?.email) {
      //   await sendApplicationStatusEmail(talent.email, job.title, status);
      // }
      // For now, we'll attempt to send if we have a way to get the email
      // This is a placeholder - implement when Talent model has email field
    } catch (emailError) {
      // Don't fail the request if email fails
      console.error("Failed to send email notification:", emailError);
    }

    // Format application for response
    const formattedApplication = {
      _id: application._id.toString(),
      jobId: application.jobId,
      talentId: application.talentId,
      answer: application.answer,
      mediaUrl: application.mediaUrl,
      status: application.status,
      createdAt: application.createdAt.toISOString(),
    };

    return NextResponse.json({ application: formattedApplication });
  } catch (error) {
    console.error("Failed to update application:", error);
    return NextResponse.json(
      { error: "Failed to update application. Please try again." },
      { status: 500 }
    );
  }
}


