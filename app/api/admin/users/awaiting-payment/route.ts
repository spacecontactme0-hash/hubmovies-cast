import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import { requireAdmin } from "@/lib/admin-helpers";

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();

    const users = await User.find({ role: "TALENT", paymentConfirmed: { $ne: true } }).select(
      "_id email name frozen paymentConfirmed createdAt"
    );

    const mapped = users.map((u: any) => ({
      _id: u._id.toString(),
      email: u.email,
      name: u.name,
      frozen: u.frozen,
      paymentConfirmed: u.paymentConfirmed,
      createdAt: u.createdAt,
    }));

    return NextResponse.json({ success: true, users: mapped });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
    }
    console.error("Failed to fetch awaiting payment users:", err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
