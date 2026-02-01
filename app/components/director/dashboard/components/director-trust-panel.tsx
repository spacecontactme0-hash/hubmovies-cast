"use client";

import { motion } from "framer-motion";
import { getTrustBadge, getTrustImprovements, getTrustLevel, getDirectorCapabilities } from "@/lib/director-trust";

type DirectorTrustPanelProps = {
  trustScore: number;
  user: {
    emailVerified?: Date | null;
    [key: string]: any;
  };
};

export default function DirectorTrustPanel({
  trustScore,
  user,
}: DirectorTrustPanelProps) {
  const badge = getTrustBadge(trustScore);
  const improvements = getTrustImprovements(trustScore, user);
  const trustLevel = getTrustLevel(trustScore);
  const capabilities = getDirectorCapabilities(trustLevel);

  const getTrustLabel = (score: number) => {
    if (score >= 70) return "Verified Studio";
    if (score >= 30) return "Trusted Director";
    return "New Director";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
      className="p-4 sm:p-6 bg-white/5 border border-white/10 rounded"
    >
      <div className="mb-6">
        <h3 className="text-xl font-heading text-white mb-2">Trust Level</h3>
        <div className="flex items-center gap-3 mb-4">
          <span
            className={`px-3 py-1 text-sm rounded border ${badge.bgColor} ${badge.color} ${badge.borderColor} font-body`}
          >
            {getTrustLabel(trustScore)}
          </span>
          <span className="text-sm text-[var(--text-secondary)] font-body">
            Score: {trustScore} / 100
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${trustScore}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`h-full ${
              trustScore >= 70
                ? "bg-[var(--accent-gold)]"
                : trustScore >= 30
                ? "bg-green-400"
                : "bg-yellow-400"
            }`}
          />
        </div>
      </div>

      {/* Current Capabilities */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-white mb-3 font-body">
          Your Capabilities:
        </h4>
        <ul className="space-y-2 text-sm text-[var(--text-secondary)] font-body">
          <li className="flex items-center gap-2">
            <span className={capabilities.maxActiveJobs === Infinity ? "text-[var(--accent-gold)]" : "text-white"}>
              {capabilities.maxActiveJobs === Infinity ? "✓" : "•"}
            </span>
            <span>
              {capabilities.maxActiveJobs === Infinity
                ? "Unlimited active jobs"
                : `Up to ${capabilities.maxActiveJobs} active job${capabilities.maxActiveJobs === 1 ? "" : "s"}`}
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span className={capabilities.canBulkShortlist ? "text-[var(--accent-gold)]" : "text-white"}>
              {capabilities.canBulkShortlist ? "✓" : "•"}
            </span>
            <span>
              {capabilities.canBulkShortlist ? "Bulk actions enabled" : "Bulk actions locked"}
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span className={capabilities.visibilityWeight > 1.0 ? "text-[var(--accent-gold)]" : "text-white"}>
              {capabilities.visibilityWeight > 1.0 ? "✓" : "•"}
            </span>
            <span>
              {capabilities.visibilityWeight > 1.0
                ? `Jobs get ${Math.round((capabilities.visibilityWeight - 1) * 100)}% visibility boost`
                : "Standard job visibility"}
            </span>
          </li>
        </ul>
      </div>

      {improvements.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-white mb-3 font-body">
            Improve your trust:
          </h4>
          <ul className="space-y-2">
            {improvements.map((improvement, index) => (
              <li
                key={index}
                className="text-sm text-[var(--text-secondary)] flex items-start gap-2 font-body"
              >
                <span className="text-[var(--accent-gold)] mt-0.5">✓</span>
                <span>{improvement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}

