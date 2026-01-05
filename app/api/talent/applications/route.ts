import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Application from "@/models/application";
import Job from "@/models/job";
import Message from "@/models/message";
import { getUserId } from "@/lib/auth-helpers";

/**
 * GET /api/talent/applications
 * Fetches all applications for the authenticated talent
 * 
 * Returns:
 * - 200: { applications: ApplicationWithJob[] } - List of applications with job details
 * - 401: Unauthorized if user is not logged in
 */
export async function GET() {
  // Get authenticated user ID
  const talentId = await getUserId();
  if (!talentId) {
    return NextResponse.json(
      { error: "Unauthorized. Please log in to view your applications." },
      { status: 401 }
    );
  }

  // Connect to MongoDB
  await connectDB();

  try {
    // Fetch all applications for this talent, sorted by most recent first
    const applications = await Application.find({ talentId }).sort({ createdAt: -1 });

    // Fetch job details and message counts for each application
    const applicationsWithDetails = await Promise.all(
      applications.map(async (app) => {
        // Get job details
        const job = await Job.findById(app.jobId);
        
        // Check if messages exist for this application
        const messageCount = await Message.countDocuments({
          applicationId: app._id.toString(),
        });

        return {
          _id: app._id.toString(),
          jobId: app.jobId,
          talentId: app.talentId,
          answer: app.answer,
          mediaUrl: app.mediaUrl,
          status: app.status,
          createdAt: app.createdAt.toISOString(),
          job: job
            ? {
                id: job._id.toString(),
                title: job.title,
                type: job.type,
                location: job.location,
                budget: job.budget,
                deadline: job.deadline,
                description: job.description,
              }
            : null,
          hasMessages: messageCount > 0,
        };
      })
    );

    return NextResponse.json({ applications: applicationsWithDetails });
  } catch (error) {
    console.error("Failed to fetch applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications. Please try again." },
      { status: 500 }
    );
  }
}

