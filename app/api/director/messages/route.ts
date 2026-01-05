import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Message from "@/models/message";
import Application from "@/models/application";
import Job from "@/models/job";
import Notification from "@/models/notification";
import { sendMessageNotificationEmail } from "@/lib/email";
import { getDirectorId } from "@/lib/auth-helpers";

/**
 * POST /api/director/messages
 * Sends a message from director to talent
 * 
 * Request body:
 * - applicationId: string (required) - The application ID this message is linked to
 * - message: string (required) - The message content
 * - deliveryMethod: "in-app" | "email" | "phone" (optional, default: "in-app")
 * 
 * Returns:
 * - 201: { message: Message } - Created message
 * - 400: Missing required fields or invalid application
 * - 401: Unauthorized if user is not logged in
 * - 403: Forbidden if director doesn't own the job
 * - 404: Application not found
 */
export async function POST(req: Request) {
  // Get authenticated director ID
  const directorId = await getDirectorId();
  if (!directorId) {
    return NextResponse.json(
      { error: "Unauthorized. Please log in to send messages." },
      { status: 401 }
    );
  }

  // Parse request body
  const body = await req.json();
  const { applicationId, message, deliveryMethod = "in-app" } = body;

  // Validate required fields
  if (!applicationId || !message) {
    return NextResponse.json(
      { error: "Missing required fields: applicationId and message are required." },
      { status: 400 }
    );
  }

  // Validate delivery method
  if (!["in-app", "email", "phone"].includes(deliveryMethod)) {
    return NextResponse.json(
      { error: "Invalid delivery method. Must be 'in-app', 'email', or 'phone'." },
      { status: 400 }
    );
  }

  // Connect to MongoDB
  await connectDB();

  try {
    // Find the application
    const application = await Application.findById(applicationId);
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

    // Create message
    const newMessage = await Message.create({
      applicationId: application._id.toString(),
      jobId: application.jobId,
      directorId: directorId,
      talentId: application.talentId,
      senderId: directorId,
      senderRole: "director",
      message: message.trim(),
      deliveryMethod,
      sent: true,
      sentAt: new Date(),
    });

    // Create notification for talent
    await Notification.create({
      userId: application.talentId,
      type: "message",
      entityId: newMessage._id.toString(),
      title: "New Message from Casting Director",
      message: `You have a new message regarding your application for "${job.title}".`,
      read: false,
    });

    // Send email notification if delivery method is email
    if (deliveryMethod === "email") {
      try {
        // TODO: Get talent email from Talent model when available
        // const talent = await Talent.findById(application.talentId);
        // if (talent?.email) {
        //   await sendMessageNotificationEmail(talent.email, job.title);
        // }
        // For now, email sending will be skipped if email is not available
      } catch (emailError) {
        // Don't fail the request if email fails
        console.error("Failed to send email notification:", emailError);
      }
    }

    // Format message for response
    const formattedMessage = {
      _id: newMessage._id.toString(),
      applicationId: newMessage.applicationId,
      jobId: newMessage.jobId,
      directorId: newMessage.directorId,
      talentId: newMessage.talentId,
      senderId: newMessage.senderId,
      senderRole: newMessage.senderRole,
      message: newMessage.message,
      deliveryMethod: newMessage.deliveryMethod,
      sent: newMessage.sent,
      sentAt: newMessage.sentAt.toISOString(),
      createdAt: newMessage.createdAt.toISOString(),
    };

    // TODO: If deliveryMethod is "email" or "phone", trigger notification service
    // For now, all messages are stored in-app regardless of delivery method

    return NextResponse.json({ message: formattedMessage }, { status: 201 });
  } catch (error) {
    console.error("Failed to send message:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}

