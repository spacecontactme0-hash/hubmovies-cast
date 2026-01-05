import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Notification from "@/models/notification";
import { getUserId } from "@/lib/auth-helpers";

/**
 * GET /api/notifications
 * Fetches notifications for the authenticated user
 * 
 * Query parameters:
 * - read: boolean (optional) - Filter by read status
 * 
 * Returns:
 * - 200: { notifications: Notification[] } - List of notifications
 * - 401: Unauthorized if user is not logged in
 */
export async function GET(req: Request) {
  // Get authenticated user ID
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized. Please log in to view notifications." },
      { status: 401 }
    );
  }

  // Get query parameters
  const { searchParams } = new URL(req.url);
  const readParam = searchParams.get("read");
  const read = readParam === "true" ? true : readParam === "false" ? false : undefined;

  // Connect to MongoDB
  await connectDB();

  try {
    // Build query
    const query: any = { userId };
    if (read !== undefined) {
      query.read = read;
    }

    // Fetch notifications, sorted by creation date (newest first)
    const notifications = await Notification.find(query).sort({ createdAt: -1 });

    // Format notifications for response
    const formattedNotifications = notifications.map((notif) => ({
      _id: notif._id.toString(),
      userId: notif.userId,
      type: notif.type,
      entityId: notif.entityId,
      read: notif.read,
      title: notif.title,
      message: notif.message,
      createdAt: notif.createdAt.toISOString(),
    }));

    return NextResponse.json({ notifications: formattedNotifications });
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/notifications
 * Marks notifications as read
 * 
 * Request body:
 * - notificationIds: string[] (optional) - Specific notification IDs to mark as read
 * - markAllRead: boolean (optional) - Mark all notifications as read
 * 
 * Returns:
 * - 200: { updated: number } - Number of notifications updated
 * - 401: Unauthorized if user is not logged in
 */
export async function PATCH(req: Request) {
  // Get authenticated user ID
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized. Please log in to update notifications." },
      { status: 401 }
    );
  }

  // Parse request body
  const body = await req.json();
  const { notificationIds, markAllRead } = body;

  // Connect to MongoDB
  await connectDB();

  try {
    let result;

    if (markAllRead) {
      // Mark all notifications as read for this user
      result = await Notification.updateMany(
        { userId, read: false },
        { $set: { read: true } }
      );
    } else if (notificationIds && Array.isArray(notificationIds)) {
      // Mark specific notifications as read
      result = await Notification.updateMany(
        { _id: { $in: notificationIds }, userId },
        { $set: { read: true } }
      );
    } else {
      return NextResponse.json(
        { error: "Missing required fields: notificationIds or markAllRead." },
        { status: 400 }
      );
    }

    return NextResponse.json({ updated: result.modifiedCount });
  } catch (error) {
    console.error("Failed to update notifications:", error);
    return NextResponse.json(
      { error: "Failed to update notifications. Please try again." },
      { status: 500 }
    );
  }
}

