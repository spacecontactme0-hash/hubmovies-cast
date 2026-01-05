"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type UserData = {
  _id: string;
  email: string;
  name?: string;
  verificationTier?: string;
  trustScore?: number;
  trustLevel?: string;
};

type TrustOverridePanelProps = {
  user: UserData;
  userRole: "TALENT" | "DIRECTOR";
  onAction: (action: {
    actionType: string;
    beforeState: any;
    afterState: any;
    reason: string;
    metadata?: any;
  }) => void;
};

export default function TrustOverridePanel({
  user,
  userRole,
  onAction,
}: TrustOverridePanelProps) {
  const [selectedTier, setSelectedTier] = useState<string>("");
  const [trustScoreOverride, setTrustScoreOverride] = useState<string>("");
  const [reason, setReason] = useState("");
  const [restrictions, setRestrictions] = useState({
    freezeJobPosting: false,
    disableMessaging: false,
    reduceVisibility: false,
    shadowLimitApplications: false,
  });
  const [flags, setFlags] = useState({
    highRisk: false,
    underReview: false,
    repeatOffender: false,
  });

  const handleTierChange = () => {
    if (!selectedTier || !reason.trim()) {
      alert("Please select a tier and provide a reason");
      return;
    }

    const beforeState = userRole === "TALENT"
      ? { verificationTier: user.verificationTier }
      : { trustLevel: user.trustLevel };

    const afterState = userRole === "TALENT"
      ? { verificationTier: selectedTier }
      : { trustLevel: selectedTier };

    onAction({
      actionType: "TRUST_TIER_CHANGE",
      beforeState,
      afterState,
      reason: reason.trim(),
    });
  };

  const handleTrustScoreOverride = () => {
    const score = parseInt(trustScoreOverride);
    if (isNaN(score) || score < 0 || score > 100) {
      alert("Trust score must be between 0 and 100");
      return;
    }
    if (!reason.trim()) {
      alert("Please provide a reason");
      return;
    }

    onAction({
      actionType: "TRUST_SCORE_OVERRIDE",
      beforeState: { trustScore: user.trustScore },
      afterState: { trustScore: score },
      reason: reason.trim(),
    });
  };

  const talentTiers = ["BASIC", "COMPLETE", "VERIFIED", "FEATURED"];
  const directorTiers = ["NEW_DIRECTOR", "TRUSTED_DIRECTOR", "VERIFIED_STUDIO"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/10 rounded-lg p-6"
    >
      <h2 className="text-xl font-heading font-semibold text-white mb-4">
        Admin Override Actions
      </h2>

      {/* Change Trust Tier */}
      <div className="mb-6 p-4 bg-white/5 rounded border border-white/10">
        <h3 className="text-lg font-medium text-white mb-3">1. Change Trust Tier</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-2">
              Current Tier: {userRole === "TALENT" ? user.verificationTier : user.trustLevel}
            </label>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white"
            >
              <option value="">Select New Tier</option>
              {(userRole === "TALENT" ? talentTiers : directorTiers).map((tier) => (
                <option key={tier} value={tier} className="bg-[var(--bg-main)]">
                  {tier}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-2">
              Reason <span className="text-red-400">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why you're making this change..."
              className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white min-h-[80px]"
              required
            />
          </div>
          <button
            onClick={handleTierChange}
            disabled={!selectedTier || !reason.trim()}
            className="px-4 py-2 bg-[var(--accent-gold)] text-black font-medium rounded hover:bg-[var(--accent-gold)]/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Change Tier
          </button>
          <p className="text-xs text-[var(--text-secondary)]">
            This action is logged and affects user visibility.
          </p>
        </div>
      </div>

      {/* Trust Score Override (Directors only) */}
      {userRole === "DIRECTOR" && (
        <div className="mb-6 p-4 bg-white/5 rounded border border-white/10">
          <h3 className="text-lg font-medium text-white mb-3">2. Override Trust Score</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-2">
                Current Score: {user.trustScore || 0}%
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={trustScoreOverride}
                onChange={(e) => setTrustScoreOverride(e.target.value)}
                placeholder="Enter new trust score (0-100)"
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white"
              />
            </div>
            <button
              onClick={handleTrustScoreOverride}
              disabled={!trustScoreOverride || !reason.trim()}
              className="px-4 py-2 bg-[var(--accent-gold)] text-black font-medium rounded hover:bg-[var(--accent-gold)]/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Override Score
            </button>
          </div>
        </div>
      )}

      {/* Restrictions (Future implementation) */}
      <div className="mb-6 p-4 bg-white/5 rounded border border-white/10">
        <h3 className="text-lg font-medium text-white mb-3">3. Apply Restrictions</h3>
        <p className="text-sm text-[var(--text-secondary)] mb-3">
          Restrictions feature coming soon. Each restriction requires a reason and optional duration.
        </p>
      </div>

      {/* Flags (Future implementation) */}
      <div className="p-4 bg-white/5 rounded border border-white/10">
        <h3 className="text-lg font-medium text-white mb-3">4. Flags (Internal Only)</h3>
        <p className="text-sm text-[var(--text-secondary)] mb-3">
          Flags feature coming soon. These affect ranking logic, not UI.
        </p>
      </div>
    </motion.div>
  );
}

