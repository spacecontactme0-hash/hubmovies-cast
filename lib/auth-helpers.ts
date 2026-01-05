import { auth } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";

/**
 * Get the current authenticated user's ID
 * Returns null if user is not authenticated
 */
export async function getUserId(): Promise<string | null> {
  const session = await auth();
  return (session?.user as any)?.id || null;
}

/**
 * Get the current authenticated user's role
 * Returns null if user is not authenticated
 */
export async function getUserRole(): Promise<"TALENT" | "DIRECTOR" | null> {
  const session = await auth();
  if (!session?.user) return null;

  const userId = (session.user as any).id;
  if (!userId) return null;

  await connectDB();
  const user = await User.findById(userId);
  return (user?.role as "TALENT" | "DIRECTOR") || null;
}

/**
 * Get the current authenticated user (full user object)
 * Returns null if user is not authenticated
 */
export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user) return null;

  const userId = (session.user as any).id;
  if (!userId) return null;

  await connectDB();
  const user = await User.findById(userId);
  if (!user) return null;

  return {
    id: user._id.toString(),
    email: user.email!,
    role: user.role,
    name: user.name,
    image: user.image,
  };
}

/**
 * Check if user is a director
 */
export async function isDirector(): Promise<boolean> {
  const role = await getUserRole();
  return role === "DIRECTOR";
}

/**
 * Check if user is a talent
 */
export async function isTalent(): Promise<boolean> {
  const role = await getUserRole();
  return role === "TALENT";
}

/**
 * Get director ID (only if user is a director)
 * Returns null if user is not authenticated or not a director
 */
export async function getDirectorId(): Promise<string | null> {
  const role = await getUserRole();
  if (role !== "DIRECTOR") return null;
  return await getUserId();
}

/**
 * Require verified user (defense-in-depth)
 * Throws error if user is not authenticated or email is not verified
 * Use this in API routes that require email verification
 */
export async function requireVerifiedUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  await connectDB();
  const dbUser = await User.findById(user.id);
  if (!dbUser || !dbUser.emailVerified) {
    throw new Error("EMAIL_NOT_VERIFIED");
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    image: user.image,
  };
}

