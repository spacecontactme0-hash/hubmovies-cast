import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Job from "@/models/job";
import User from "@/models/user";
import { getTrustLevel, getDirectorCapabilities } from "@/lib/director-trust";

/**
 * GET /api/jobs
 * Fetches all open jobs (public listing)
 * 
 * Returns:
 * - 200: { jobs: Job[] } - List of jobs
 */
export async function GET() {
  await connectDB();

  try {
    // Fetch all open jobs, sorted by deadline (soonest first)
    const jobs = await Job.find({ status: "open" })
      .sort({ deadline: 1, createdAt: -1 })
      .limit(100); // Limit to prevent performance issues

    // Fetch director trust scores for all jobs
    const directorIds = [...new Set(jobs.map((job) => job.directorId))];
    const directors = await User.find({
      _id: { $in: directorIds },
      role: "DIRECTOR",
    });

    const directorTrustMap = new Map(
      directors.map((dir) => [dir._id.toString(), dir.trustScore || 0])
    );

    // Format jobs for response with director trust information and visibility weights
    const jobsWithTrust = jobs.map((job) => {
      const directorTrustScore = directorTrustMap.get(job.directorId) || 0;
      const trustLevel = getTrustLevel(directorTrustScore);
      const capabilities = getDirectorCapabilities(trustLevel);
      
      return {
        _id: job._id.toString(),
        title: job.title,
        type: job.type,
        location: job.location,
        budget: job.budget,
        deadline: job.deadline,
        description: job.description,
        status: job.status,
        createdAt: job.createdAt.toISOString(),
        directorTrustScore,
        visibilityWeight: capabilities.visibilityWeight, // For sorting/ranking
      };
    });

    // Sort by visibility weight (higher = priority) then by deadline
    jobsWithTrust.sort((a, b) => {
      // First sort by visibility weight (descending)
      if (b.visibilityWeight !== a.visibilityWeight) {
        return b.visibilityWeight - a.visibilityWeight;
      }
      // Then by deadline (soonest first)
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });

    return NextResponse.json({ jobs: jobsWithTrust });
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs. Please try again." },
      { status: 500 }
    );
  }
}



