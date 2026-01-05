import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Application from "@/models/application";
import { getUserId } from "@/lib/auth-helpers";

/**
 * GET /api/apply/status
 * Checks if the authenticated user has already applied to a specific job
 * 
 * Query parameters:
 * - jobId: string - The ID of the job to check
 * 
 * Returns:
 * - 200: { applied: boolean } - Whether the user has applied
 * - 401: Unauthorized if user is not logged in
 */
export async function GET(req: Request) {
  // Get jobId from query parameters
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get("jobId");

  // Return false if no jobId provided
  if (!jobId) {
    return NextResponse.json({ applied: false });
  }

  // Get authenticated user ID
  const talentId = await getUserId();

  // Return false if user is not authenticated
  if (!talentId) {
    return NextResponse.json({ applied: false });
  }

  // Connect to MongoDB database
  await connectDB();

  // Check if application exists for this job and user
  const existing = await Application.findOne({ jobId, talentId });

  // Return applied status
  return NextResponse.json({ applied: !!existing });
}
