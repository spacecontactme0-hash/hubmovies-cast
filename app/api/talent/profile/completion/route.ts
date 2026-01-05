import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import { getUserId } from "@/lib/auth-helpers";
import { calculateTalentProfileCompletion } from "@/lib/profile-completion";

/**
 * GET /api/talent/profile/completion
 * Gets the current profile completion percentage for the authenticated talent
 * 
 * Returns:
 * - 200: { completion: number, missing: string[], complete: boolean }
 * - 401: Unauthorized if user is not logged in
 */
export async function GET() {
  const talentId = await getUserId();
  
  if (!talentId) {
    return NextResponse.json(
      { error: "Unauthorized. Please log in." },
      { status: 401 }
    );
  }

  await connectDB();

  try {
    const user = await User.findById(talentId);
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const completion = calculateTalentProfileCompletion(user);
    
    return NextResponse.json({
      completion: completion.score,
      missing: completion.missing,
      complete: completion.complete,
    });
  } catch (error) {
    console.error("Failed to get profile completion:", error);
    return NextResponse.json(
      { error: "Failed to get profile completion" },
      { status: 500 }
    );
  }
}

