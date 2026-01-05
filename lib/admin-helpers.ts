import { auth } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";

/**
 * Check if the current user is an admin
 * Returns the admin user object if authenticated and is admin, null otherwise
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("UNAUTHORIZED");
  }

  const userId = (session.user as any).id;
  if (!userId) {
    throw new Error("UNAUTHORIZED");
  }

  await connectDB();
  const user = await User.findById(userId);
  
  if (!user || user.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }

  return user;
}

/**
 * Get admin ID from session
 * Returns null if not admin
 */
export async function getAdminId(): Promise<string | null> {
  try {
    const admin = await requireAdmin();
    return admin._id.toString();
  } catch {
    return null;
  }
}

