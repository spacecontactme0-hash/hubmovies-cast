"use client";

import { motion } from "framer-motion";

type TrustBreakdownPanelProps = {
  trustBreakdown: { [key: string]: number };
  userRole: "TALENT" | "DIRECTOR";
  trustScore?: number;
  verificationTier?: string;
};

export default function TrustBreakdownPanel({
  trustBreakdown,
  userRole,
  trustScore,
  verificationTier,
}: TrustBreakdownPanelProps) {
  const totalScore = userRole === "DIRECTOR" 
    ? (trustScore || 0)
    : Object.values(trustBreakdown).reduce((sum, val) => sum + val, 0);

  const formatKey = (key: string) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  const getScoreColor = (score: number) => {
    if (score > 0) return "text-green-400";
    if (score < 0) return "text-red-400";
    return "text-[var(--text-secondary)]";
  };

  const getScoreIcon = (score: number) => {
    if (score > 0) return "✔";
    if (score < 0) return "⚠️";
    return "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/10 rounded-lg p-6"
    >
      <h2 className="text-xl font-heading font-semibold text-white mb-4">
        Trust Breakdown (Read Only)
      </h2>
      <p className="text-sm text-[var(--text-secondary)] mb-4">
        This explains the machine logic. No editing here.
      </p>

      <div className="space-y-3">
        <div className="flex items-center justify-between py-2 border-b border-white/10">
          <span className="text-white font-medium">
            {userRole === "DIRECTOR" ? "Trust Score" : "Profile Completion"}
          </span>
          <span className="text-white font-semibold text-lg">{totalScore}%</span>
        </div>

        {Object.entries(trustBreakdown).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <span className={getScoreColor(value)}>{getScoreIcon(value)}</span>
              <span className="text-[var(--text-secondary)]">{formatKey(key)}</span>
            </div>
            <span className={`font-medium ${getScoreColor(value)}`}>
              {value > 0 ? "+" : ""}{value}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

