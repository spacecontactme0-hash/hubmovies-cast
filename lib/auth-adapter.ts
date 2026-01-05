import { Adapter } from "next-auth/adapters";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import Session from "@/models/session";
import VerificationToken from "@/models/verification-token";
import { ObjectId } from "mongodb";

export function MongooseAdapter(): Adapter {
  return {
    async createUser(user) {
      await connectDB();
      const newUser = await User.create({
        email: user.email,
        name: user.name,
        image: user.image,
        emailVerified: user.emailVerified,
      });
      return {
        id: newUser._id.toString(),
        email: newUser.email!,
        emailVerified: newUser.emailVerified,
        name: newUser.name,
        image: newUser.image,
      };
    },

    async getUser(id) {
      await connectDB();
      const user = await User.findById(id);
      if (!user) return null;
      return {
        id: user._id.toString(),
        email: user.email!,
        emailVerified: user.emailVerified,
        name: user.name,
        image: user.image,
      };
    },

    async getUserByEmail(email) {
      await connectDB();
      const user = await User.findOne({ email });
      if (!user) return null;
      return {
        id: user._id.toString(),
        email: user.email!,
        emailVerified: user.emailVerified,
        name: user.name,
        image: user.image,
      };
    },

    async getUserByAccount({ providerAccountId, provider }) {
      await connectDB();
      // For email provider, we use email as the account identifier
      if (provider === "email") {
        const user = await User.findOne({ email: providerAccountId });
        if (!user) return null;
        return {
          id: user._id.toString(),
          email: user.email!,
          emailVerified: user.emailVerified,
          name: user.name,
          image: user.image,
        };
      }
      return null;
    },

    async updateUser(user) {
      await connectDB();
      const updated = await User.findByIdAndUpdate(
        user.id,
        {
          email: user.email,
          name: user.name,
          image: user.image,
          emailVerified: user.emailVerified,
        },
        { new: true }
      );
      if (!updated || !updated.email) {
        // Return user as-is if update failed or email is missing
        return {
          id: user.id,
          email: user.email || "",
          emailVerified: user.emailVerified,
          name: user.name,
          image: user.image,
        };
      }
      return {
        id: updated._id.toString(),
        email: updated.email,
        emailVerified: updated.emailVerified,
        name: updated.name,
        image: updated.image,
      };
    },

    async linkAccount(account) {
      // For email provider, account is already linked via email
      return account;
    },

    async createSession({ sessionToken, userId, expires }) {
      await connectDB();
      const session = await Session.create({
        sessionToken,
        userId: new ObjectId(userId),
        expires,
      });
      return {
        sessionToken: session.sessionToken,
        userId: session.userId.toString(),
        expires: session.expires,
      };
    },

    async getSessionAndUser(sessionToken) {
      await connectDB();
      const session = await Session.findOne({ sessionToken }).populate("userId");
      if (!session || !session.userId) return null;

      const user = session.userId as any;
      return {
        session: {
          sessionToken: session.sessionToken,
          userId: user._id.toString(),
          expires: session.expires,
        },
        user: {
          id: user._id.toString(),
          email: user.email!,
          emailVerified: user.emailVerified,
          name: user.name,
          image: user.image,
        },
      };
    },

    async updateSession({ sessionToken, ...data }) {
      await connectDB();
      const session = await Session.findOneAndUpdate(
        { sessionToken },
        data,
        { new: true }
      );
      if (!session) return null;
      return {
        sessionToken: session.sessionToken,
        userId: session.userId.toString(),
        expires: session.expires,
      };
    },

    async deleteSession(sessionToken) {
      await connectDB();
      await Session.deleteOne({ sessionToken });
    },

    async createVerificationToken({ identifier, token, expires }) {
      await connectDB();
      const verificationToken = await VerificationToken.create({
        identifier,
        token,
        expires,
      });
      return {
        identifier: verificationToken.identifier,
        token: verificationToken.token,
        expires: verificationToken.expires,
      };
    },

    async useVerificationToken({ identifier, token }) {
      await connectDB();
      const verificationToken = await VerificationToken.findOneAndDelete({
        identifier,
        token,
      });
      if (!verificationToken) return null;
      return {
        identifier: verificationToken.identifier,
        token: verificationToken.token,
        expires: verificationToken.expires,
      };
    },
  };
}

