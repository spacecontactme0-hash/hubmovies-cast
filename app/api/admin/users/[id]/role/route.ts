import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import AuditLog from "@/models/audit-log";
import { requireAdmin } from "@/lib/admin-helpers";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const { role } = body;

    if (!role || !["TALENT", "DIRECTOR", "ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const beforeState = { role: user.role };

    user.role = role;
    await user.save();

    await AuditLog.create({
      actorId: admin._id.toString(),
      actorRole: "ADMIN",
      targetUserId: id,
      targetUserRole: role as any,
      actionType: "ROLE_CHANGE",
      beforeState,
      afterState: { role },
      reason: `Role changed to ${role}`,
    });

    return NextResponse.json({ success: true, user: { _id: user._id.toString(), role: user.role } });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
    }
    console.error("Failed to change role:", err);
    return NextResponse.json({ error: "Failed to change role" }, { status: 500 });
  }
}
