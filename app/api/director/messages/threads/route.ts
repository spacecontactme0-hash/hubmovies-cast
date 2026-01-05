import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Message from "@/models/message";
import Application from "@/models/application";
import Job from "@/models/job";
import { getDirectorId } from "@/lib/auth-helpers";

/**
 * GET /api/director/messages/threads
 * Fetches message threads grouped by application for the authenticated director
 * 
 * Returns:
 * - 200: { threads: MessageThread[] } - List of message threads
 * - 401: Unauthorized if user is not logged in
 */
export async function GET() {
  // Get authenticated director ID
  const directorId = await getDirectorId();
  if (!directorId) {
    return NextResponse.json(
      { error: "Unauthorized. Please log in to view messages." },
      { status: 401 }
    );
  }

  // Connect to MongoDB
  await connectDB();

  try {
    // Fetch all messages for this director
    const messages = await Message.find({ directorId }).sort({ createdAt: -1 });

    // Group messages by applicationId
    const threadsMap = new Map<string, any>();

    for (const msg of messages) {
      const appId = msg.applicationId.toString();
      
      if (!threadsMap.has(appId)) {
        // Get application details
        const application = await Application.findById(msg.applicationId);
        if (!application) continue;

        // Get job details
        const job = await Job.findById(msg.jobId);
        if (!job) continue;

        threadsMap.set(appId, {
          applicationId: appId,
          jobId: msg.jobId.toString(),
          jobTitle: job.title,
          talentId: msg.talentId.toString(),
          talentName: null, // TODO: Fetch from Talent model if available
          talentRole: null, // TODO: Fetch from Talent model if available
          lastMessage: msg.message,
          lastMessageAt: msg.createdAt.toISOString(),
          messageCount: 1,
          status: application.status,
        });
      } else {
        const thread = threadsMap.get(appId);
        thread.messageCount += 1;
        // Update last message if this one is newer
        if (new Date(msg.createdAt) > new Date(thread.lastMessageAt)) {
          thread.lastMessage = msg.message;
          thread.lastMessageAt = msg.createdAt.toISOString();
        }
      }
    }

    // Convert map to array and sort by last message date (newest first)
    const threads = Array.from(threadsMap.values()).sort(
      (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    );

    return NextResponse.json({ threads });
  } catch (error) {
    console.error("Failed to fetch message threads:", error);
    return NextResponse.json(
      { error: "Failed to fetch message threads. Please try again." },
      { status: 500 }
    );
  }
}

