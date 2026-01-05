import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Job from "@/models/job";
import { getDirectorId } from "@/lib/auth-helpers";

/**
 * PATCH /api/director/jobs/[id]
 * Updates an existing job posting
 * Only allows updates for jobs owned by the authenticated director
 * 
 * Request body:
 * - title: string (optional)
 * - type: string (optional)
 * - location: string (optional)
 * - budget: string (optional)
 * - deadline: string (optional)
 * - description: string (optional)
 * - status: "open" | "closed" (optional)
 * 
 * Returns:
 * - 200: { job: Job } - Updated job
 * - 401: Unauthorized if user is not logged in
 * - 403: Forbidden if director doesn't own the job
 * - 404: Job not found
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Get authenticated director ID
  const directorId = await getDirectorId();
  if (!directorId) {
    return NextResponse.json(
      { error: "Unauthorized. Please log in to update jobs." },
      { status: 401 }
    );
  }

  // Parse request body
  const body = await req.json();
  const { title, type, location, budget, deadline, description, status } = body;

  // Await params (Next.js 16+ requirement)
  const { id } = await params;

  // Connect to MongoDB
  await connectDB();

  try {
    // Find the job
    const job = await Job.findById(id);
    if (!job) {
      return NextResponse.json(
        { error: "Job not found." },
        { status: 404 }
      );
    }

    // Check if director owns this job
    if (job.directorId.toString() !== directorId) {
      return NextResponse.json(
        { error: "Forbidden. You don't have access to this job." },
        { status: 403 }
      );
    }

    // Update only provided fields
    if (title !== undefined) job.title = title;
    if (type !== undefined) job.type = type;
    if (location !== undefined) job.location = location;
    if (budget !== undefined) job.budget = budget;
    if (deadline !== undefined) job.deadline = deadline;
    if (description !== undefined) job.description = description;
    if (status !== undefined) {
      if (!["open", "closed"].includes(status)) {
        return NextResponse.json(
          { error: "Invalid status. Must be 'open' or 'closed'." },
          { status: 400 }
        );
      }
      job.status = status;
    }

    await job.save();

    // Format job for response
    const formattedJob = {
      id: job._id.toString(),
      title: job.title,
      type: job.type,
      location: job.location,
      budget: job.budget,
      deadline: job.deadline,
      description: job.description,
      status: job.status,
    };

    return NextResponse.json({ job: formattedJob });
  } catch (error) {
    console.error("Failed to update job:", error);
    return NextResponse.json(
      { error: "Failed to update job. Please try again." },
      { status: 500 }
    );
  }
}

