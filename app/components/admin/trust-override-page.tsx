"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import IdentityHeader from "./identity-header";
import TrustBreakdownPanel from "./trust-breakdown-panel";
import TimelinePanel from "./timeline-panel";
import TrustOverridePanel from "./trust-override-panel";
import ConfirmActionModal from "./confirm-action-modal";

type UserRole = "TALENT" | "DIRECTOR";

type TrustOverridePageProps = {
  userId: string;
  userRole: UserRole;
};

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
  createdAt: string;
};

type TrustBreakdown = {
  [key: string]: number;
};

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

type PendingAction = {
  actionType: string;
  beforeState: any;
  afterState: any;
  reason: string;
  metadata?: any;
} | null;

export default function TrustOverridePage({ userId, userRole }: TrustOverridePageProps) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);
  const [trustBreakdown, setTrustBreakdown] = useState<TrustBreakdown>({});
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const endpoint = userRole === "TALENT" 
          ? `/api/admin/trust/talent/${userId}`
          : `/api/admin/trust/director/${userId}`;
        
        const res = await fetch(endpoint);
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setTrustBreakdown(data.trustBreakdown);
          setHistory(data.history);
        } else {
          console.error("Failed to fetch trust data");
        }
      } catch (error) {
        console.error("Failed to fetch trust data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [userId, userRole]);

  const handleOverride = async (action: PendingAction) => {
    if (!action) return;

    try {
      const res = await fetch("/api/admin/trust/override", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId: userId,
          ...action,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        // Refresh data
        window.location.reload();
      } else {
        const error = await res.json();
        alert(`Failed: ${error.error}`);
      }
    } catch (error) {
      console.error("Failed to apply override:", error);
      alert("Failed to apply override");
    } finally {
      setPendingAction(null);
      setShowConfirmModal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center">
        <p className="text-[var(--text-secondary)]">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center">
        <p className="text-[var(--text-secondary)]">User not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Identity Header */}
        <IdentityHeader user={user} userRole={userRole} />

        {/* Trust Breakdown Panel */}
        <TrustBreakdownPanel 
          trustBreakdown={trustBreakdown} 
          userRole={userRole}
          trustScore={user.trustScore}
          verificationTier={user.verificationTier}
        />

        {/* Timeline Panel */}
        <TimelinePanel history={history} />

        {/* Trust Override Panel */}
        <TrustOverridePanel
          user={user}
          userRole={userRole}
          onAction={(action) => {
            setPendingAction(action);
            setShowConfirmModal(true);
          }}
        />

        {/* Confirmation Modal */}
        {showConfirmModal && pendingAction && (
          <ConfirmActionModal
            action={pendingAction}
            user={user}
            userRole={userRole}
            onConfirm={() => handleOverride(pendingAction)}
            onCancel={() => {
              setPendingAction(null);
              setShowConfirmModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
}

