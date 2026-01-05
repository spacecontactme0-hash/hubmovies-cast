"use client";

import { motion } from "framer-motion";

type HistoryEntry = {
  _id: string;
  actionType: string;
  beforeState: any;
  afterState: any;
  reason: string;
  actorId: string;
  actorRole: string;
  createdAt: string;
};

type TimelinePanelProps = {
  history: HistoryEntry[];
};

export default function TimelinePanel({ history }: TimelinePanelProps) {
  const formatActionType = (actionType: string) => {
    return actionType
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStateChange = (entry: HistoryEntry) => {
    if (entry.actionType === "TRUST_TIER_CHANGE") {
      const before = entry.beforeState.verificationTier || entry.beforeState.trustLevel;
      const after = entry.afterState.verificationTier || entry.afterState.trustLevel;
      if (before && after && before !== after) {
        return `${before} → ${after}`;
      }
    }
    if (entry.actionType === "TRUST_SCORE_OVERRIDE") {
      const before = entry.beforeState.trustScore;
      const after = entry.afterState.trustScore;
      if (before !== undefined && after !== undefined && before !== after) {
        return `${before} → ${after}`;
      }
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/10 rounded-lg p-6"
    >
      <h2 className="text-xl font-heading font-semibold text-white mb-4">
        Timeline / History
      </h2>

      {history.length === 0 ? (
        <p className="text-[var(--text-secondary)] text-sm">No history available</p>
      ) : (
        <div className="space-y-4">
          {history.map((entry) => {
            const stateChange = getStateChange(entry);
            return (
              <div
                key={entry._id}
                className="border-l-2 border-white/20 pl-4 py-2 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">
                    {formatActionType(entry.actionType)}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)]">
                    {formatDate(entry.createdAt)}
                  </span>
                </div>
                {stateChange && (
                  <p className="text-sm text-[var(--text-secondary)]">
                    {stateChange}
                  </p>
                )}
                <p className="text-sm text-[var(--text-secondary)]">
                  Reason: {entry.reason}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  {entry.actorRole === "ADMIN" ? "Admin" : "System"}: {entry.actorId}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

