import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/admin-helpers";
import Settings from "@/models/settings";

export async function GET() {
  try {
    await connectDB();
    const settings = await Settings.findOne({ key: "payment" });
    return NextResponse.json({ success: true, settings: settings || null });
  } catch (err: any) {
    console.error("Failed to fetch payment settings:", err);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();
    const { ethAddress, btcAddress } = body;

    await connectDB();
    const updated = await Settings.findOneAndUpdate(
      { key: "payment" },
      { $set: { ethAddress: ethAddress || null, btcAddress: btcAddress || null, updatedBy: admin._id.toString() } },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, settings: updated });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
    }
    console.error("Failed to update payment settings:", err);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
