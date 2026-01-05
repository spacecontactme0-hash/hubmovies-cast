import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Application from "@/models/application";
import Job from "@/models/job";
import { getDirectorId } from "@/lib/auth-helpers";

/**
 * GET /api/director/applications
 * Fetches applications for a specific job
 * Only returns applications for jobs owned by the authenticated director
 * 
 * Query parameters:
 * - jobId: string (required) - The ID of the job
 * 
 * Returns:
 * - 200: { applications: Application[] } - List of applications
 * - 400: Missing jobId parameter
 * - 401: Unauthorized if user is not logged in
 * - 403: Forbidden if director doesn't own the job
 * - 404: Job not found
 */
export async function GET(req: Request) {
  // Get authenticated director ID
  const directorId = await getDirectorId();
  if (!directorId) {
    return NextResponse.json(
      { error: "Unauthorized. Please log in to view applications." },
      { status: 401 }
    );
  }

  // Get jobId from query parameters
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get("jobId");

  if (!jobId) {
    return NextResponse.json(
      { error: "Missing jobId parameter." },
      { status: 400 }
    );
  }

  // Connect to MongoDB
  await connectDB();

  try {
    // Verify the job exists and belongs to this director
    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json(
        { error: "Job not found." },
        { status: 404 }
      );
    }

    // Check if director owns this job
    if (job.directorId.toString() !== directorId) {
      return NextResponse.json(
        { error: "Forbidden. You don't have access to this job's applications." },
        { status: 403 }
      );
    }

    // Fetch all applications for this job
    const applications = await Application.find({ jobId }).sort({ createdAt: -1 });

    // Format applications for response
    const formattedApplications = applications.map((app) => ({
      _id: app._id.toString(),
      jobId: app.jobId,
      talentId: app.talentId,
      answer: app.answer,
      mediaUrl: app.mediaUrl,
      status: app.status,
      createdAt: app.createdAt.toISOString(),
    }));

    return NextResponse.json({ applications: formattedApplications });
  } catch (error) {
    console.error("Failed to fetch applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications. Please try again." },
      { status: 500 }
    );
  }
}


