"use client";

import { motion } from "framer-motion";

type UserData = {
  _id: string;
  email: string;
  name?: string;
  image?: string;
  role: string;
  verificationTier?: string;
  trustScore?: number;
  trustLevel?: string;
  profileCompletion?: number;
  emailVerified?: Date;
};

type IdentityHeaderProps = {
  user: UserData;
  userRole: "TALENT" | "DIRECTOR";
};

export default function IdentityHeader({ user, userRole }: IdentityHeaderProps) {
  const getStatusBadges = () => {
    const badges = [];
    
    if (user.emailVerified) {
      badges.push({ label: "Verified", color: "bg-green-500/20 text-green-400 border-green-500/30" });
    }
    
    if (userRole === "DIRECTOR" && user.trustScore && user.trustScore < 30) {
      badges.push({ label: "High Risk", color: "bg-red-500/20 text-red-400 border-red-500/30" });
    }
    
    if (userRole === "TALENT" && user.verificationTier === "FEATURED") {
      badges.push({ label: "Featured", color: "bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] border-[var(--accent-gold)]/30" });
    }

    return badges;
  };

  const getCurrentTier = () => {
    if (userRole === "TALENT") {
      return user.verificationTier || "BASIC";
    } else {
      return user.trustLevel || "NEW_DIRECTOR";
    }
  };

  const getTrustScore = () => {
    if (userRole === "DIRECTOR") {
      return user.trustScore || 0;
    } else {
      return user.profileCompletion || 0;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/10 rounded-lg p-6"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
          {user.image ? (
            <img src={user.image} alt={user.name || "User"} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl text-[var(--text-secondary)]">
              {(user.name || user.email)[0].toUpperCase()}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <h1 className="text-2xl font-heading font-semibold text-white mb-2">
            {user.name || "Unnamed User"}
          </h1>
          <div className="space-y-1 text-sm text-[var(--text-secondary)]">
            <p><span className="text-white">Email:</span> {user.email}</p>
            <p><span className="text-white">Role:</span> {userRole}</p>
            <p>
              <span className="text-white">Current Tier:</span>{" "}
              <span className="text-white font-medium">{getCurrentTier()}</span>
            </p>
            <p>
              <span className="text-white">
                {userRole === "DIRECTOR" ? "Trust Score" : "Profile Completion"}:
              </span>{" "}
              <span className="text-white font-medium">{getTrustScore()}%</span>
            </p>
            <p>
              <span className="text-white">Status:</span>{" "}
              <span className="text-green-400">Active</span>
            </p>
          </div>

          {/* Badges */}
          <div className="flex gap-2 mt-4">
            {getStatusBadges().map((badge, idx) => (
              <span
                key={idx}
                className={`px-3 py-1 rounded border text-xs font-medium ${badge.color}`}
              >
                {badge.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

