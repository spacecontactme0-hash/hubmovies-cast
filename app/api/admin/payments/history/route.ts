import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import AuditLog from "@/models/audit-log";
import User from "@/models/user";
import { requireAdmin } from "@/lib/admin-helpers";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const method = searchParams.get("method"); // ETH or BTC
    const email = searchParams.get("email"); // Search by user email
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build query
    const query: any = {
      actionType: { $in: ["PAYMENT_CONFIRMED", "PAYMENT_CONFIRMED_BULK"] },
    };

    if (method && ["ETH", "BTC"].includes(method.toUpperCase())) {
      query["metadata.method"] = method.toUpperCase();
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    // Get total count
    const total = await AuditLog.countDocuments(query);

    // Fetch logs with pagination
    let logs = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Enrich with user email if we need to filter by it
    if (email) {
      const filteredLogs = [];
      for (const log of logs) {
        const user = await User.findById(log.targetUserId).select("email");
        if (user && user.email.toLowerCase().includes(email.toLowerCase())) {
          filteredLogs.push({
            ...log,
            userEmail: user.email,
          });
        }
      }
      logs = filteredLogs;
    } else {
      // Still need to fetch emails for display
      for (const log of logs) {
        const user = await User.findById(log.targetUserId).select("email");
        log.userEmail = user?.email || "Unknown";
      }
    }

    const mapped = logs.map((log: any) => ({
      _id: log._id?.toString(),
      targetUserId: log.targetUserId?.toString(),
      userEmail: log.userEmail,
      actionType: log.actionType,
      method: log.metadata?.method,
      bulkConfirmation: log.metadata?.bulkConfirmation,
      reason: log.reason,
      createdAt: log.createdAt,
    }));

    return NextResponse.json({
      success: true,
      payments: mapped,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN") {
      return NextResponse.json(
        { error: "Forbidden. Admin access required." },
        { status: 403 }
      );
    }
    console.error("Failed to fetch payment history:", err);
    return NextResponse.json(
      { error: "Failed to fetch payment history" },
      { status: 500 }
    );
  }
}
