import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import { requireAdmin } from "@/lib/admin-helpers";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = (searchParams.get("search") || "").trim();
    const role = (searchParams.get("role") || "").trim().toUpperCase();

    const query: any = {};
    if (search) {
      // Simple text search on email or name
      query.$or = [
        { email: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ];
    }

    if (role && ["TALENT", "DIRECTOR", "ADMIN"].includes(role)) {
      query.role = role;
    }

    const total = await User.countDocuments(query);

    const users = await User.find(query)
      .select("_id email name role frozen paymentConfirmed createdAt")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const mapped = users.map((u: any) => ({
      _id: u._id.toString(),
      email: u.email,
      name: u.name,
      role: u.role,
      frozen: u.frozen,
      paymentConfirmed: u.paymentConfirmed,
      createdAt: u.createdAt,
    }));

    return NextResponse.json({
      success: true,
      users: mapped,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
    }
    console.error("Failed to fetch users:", err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
