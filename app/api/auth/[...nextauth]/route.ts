import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongooseAdapter } from "@/lib/auth-adapter";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthConfig = {
  adapter: MongooseAdapter(),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER || {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM || "noreply@hubmovies.com",
    }),
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Try to find user in DB; if DB is unreachable, we fall back to env-based admin
        let user: any = null;
        let dbError = null;
        try {
          await connectDB();
          user = await User.findOne({ email });
        } catch (err) {
          dbError = err;
          console.error("DB error during authorize:", err);
        }

        // If user exists and has a password hash, verify it
        if (user && user.passwordHash) {
          const isValid = await bcrypt.compare(password, user.passwordHash);
          if (!isValid) return null;

          return {
            id: user._id.toString(),
            email: user.email!,
            name: user.name,
            image: user.image,
            role: user.role,
            emailVerified: !!user.emailVerified,
            profileCompletion: user.profileCompletion || 0,
          };
        }

        // If user doesn't exist or has no password, check hardcoded admin credentials from env
        const adminList = (process.env.ADMIN_ACCOUNTS || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (adminList.includes(email.toLowerCase()) && adminPassword && password === adminPassword) {
          // Attempt to upsert admin user in DB if possible
          if (!dbError) {
            try {
              const passwordHash = await bcrypt.hash(password, 12);
              const update = {
                email,
                role: "ADMIN",
                emailVerified: new Date(),
                passwordHash,
                name: "Admin",
              } as any;

              const adminUser = await User.findOneAndUpdate({ email }, update, {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
              });

              if (adminUser) {
                return {
                  id: adminUser._id.toString(),
                  email: adminUser.email!,
                  name: adminUser.name,
                  image: adminUser.image,
                  role: adminUser.role,
                  emailVerified: !!adminUser.emailVerified,
                  profileCompletion: adminUser.profileCompletion || 0,
                };
              }
            } catch (err) {
              console.error("DB error upserting admin:", err);
            }
          }

          // If DB is unreachable or upsert failed, return an in-memory fallback admin user
          return {
            id: `anon-admin:${email}`,
            email,
            name: "Admin",
            role: "ADMIN",
            emailVerified: true,
            profileCompletion: 100,
          } as any;
        }

        // Otherwise deny access
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth",
    verifyRequest: "/auth/check-email",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in - user object is available
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || token.role;
        token.emailVerified = (user as any).emailVerified || false;
        token.name = (user as any).name;
        token.profileCompletion = (user as any).profileCompletion || 0;

        // Mark admin fallback tokens so we can skip DB refreshes later
        if (typeof token.id === "string" && token.id.startsWith("anon-admin:")) {
          (token as any).isAdminFallback = true;
        }
      } else if (token.id) {
        // If this is an anon-admin fallback token, skip DB refresh (DB may be unreachable)
        if (typeof token.id === "string" && token.id.startsWith("anon-admin:")) {
          (token as any).role = "ADMIN";
          token.emailVerified = true;
          return token;
        }

        // Otherwise attempt to refresh from DB, but don't throw on errors
        try {
          await connectDB();
          const dbUser = await User.findById(token.id as any);
          if (dbUser) {
            token.role = dbUser.role;
            token.emailVerified = !!dbUser.emailVerified;
            token.name = dbUser.name;
            token.profileCompletion = dbUser.profileCompletion || 0;
          }
        } catch (err) {
          console.error("JWT refresh error:", err);
          // Leave token as-is so user can remain signed in (best-effort)
        }
      }

      return token;
    },
    async session({ session, token }) {
      // Pass token data to session
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).emailVerified = token.emailVerified as boolean;
        (session.user as any).name = token.name as string;
        (session.user as any).profileCompletion = token.profileCompletion as number;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account && user.email) {
        await connectDB();
        const existingUser = await User.findOne({ email: user.email });
        
        // For email provider, set role if user is new
        if (account.provider === "email" && !existingUser) {
          // Role will be set when user completes signup via /auth/complete
          return true;
        }
      }
      return true;
    },
  },
};

const { handlers, auth } = NextAuth(authOptions);

// Export handlers
export const { GET, POST } = handlers;

// Export auth function for use in server components and API routes
export { auth };

