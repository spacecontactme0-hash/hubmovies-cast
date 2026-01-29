"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ApplyFlowModal from "./modals/apply-flow-modal";
import { getTrustBadge, getTrustStatusText } from "@/lib/director-trust";

type Job = {
  id?: string;
  _id?: string;
  title: string;
  type: string;
  location: string;
  budget: string;
  deadline: string;
  description?: string;
  directorTrustScore?: number;
};

export default function JobDetailModal({
  job,
  onClose,
}: {
  job: Job;
  onClose: () => void;
}) {
  const { data: session } = useSession();
  const [applyOpen, setApplyOpen] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);

  // Get job ID (support both id and _id for backward compatibility)
  const jobId = job._id || job.id || "";

  // Check if user is a talent and if they've paid
  const user = session?.user as any;
  const isTalent = user?.role === "TALENT";
  const hasNotPaid = isTalent && !user?.paymentConfirmed;

  // Check if user has already applied to this job
  useEffect(() => {
    if (!jobId) {
      setLoadingStatus(false);
      return;
    }

    async function checkApplied() {
      try {
        const res = await fetch(`/api/apply/status?jobId=${jobId}`);
        if (res.status === 403) {
          // Payment required
          setHasApplied(false);
        } else {
          const data = await res.json();
          setHasApplied(data.applied || false);
        }
      } catch (error) {
        // If error, assume not applied
        setHasApplied(false);
      } finally {
        setLoadingStatus(false);
      }
    }

    checkApplied();
  }, [jobId, hasNotPaid]);

  return (
    <AnimatePresence>
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-[var(--bg-surface)] border border-white/10 p-8"
          >
            {/* Header */}
            <div className="mb-6">
              <p className="text-xs tracking-[0.25em] text-[var(--accent-gold)] mb-2">
                CASTING OPPORTUNITY
              </p>
              <h3 className="text-2xl text-white mb-2">{job.title}</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                {job.type} · {job.location}
              </p>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-6 text-sm mb-8">
              <div>
                <p className="text-white mb-1">Budget</p>
                <p className="text-[var(--text-secondary)]">{job.budget}</p>
              </div>
              <div>
                <p className="text-white mb-1">Deadline</p>
                <p className="text-[var(--text-secondary)]">{job.deadline}</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-[var(--text-secondary)] leading-relaxed mb-8">
              {job.description ||
                "This is a professionally curated casting opportunity from a verified producer."}
            </p>

            {/* Trust Section */}
            {job.directorTrustScore !== undefined && (
              <div className="mb-8 p-4 bg-white/5 border border-white/10 rounded">
                {(() => {
                  const trustScore = job.directorTrustScore || 0;
                  const badge = getTrustBadge(trustScore);
                  const statusText = getTrustStatusText(badge.level);
                  
                  return (
                    <>
                      <div className="flex items-center gap-3 mb-4">
                        <h4 className="text-sm font-medium text-white font-body">
                          {statusText.title}
                        </h4>
                        <span
                          className={`px-2 py-1 text-xs rounded border ${badge.bgColor} ${badge.color} ${badge.borderColor} font-body`}
                        >
                          {badge.label}
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {statusText.items.map((item, index) => (
                          <li key={index} className="text-sm text-[var(--text-secondary)] font-body">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </>
                  );
                })()}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              {hasNotPaid ? (
                <>
                  <Link
                    href="/auth/payment-required"
                    className="px-6 py-3 bg-[var(--accent-gold)] text-black font-medium hover:opacity-90 transition text-center"
                  >
                    Complete Payment
                  </Link>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 border border-white/20 text-white hover:bg-white/10 transition"
                  >
                    Close
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setApplyOpen(true)}
                    disabled={hasApplied || loadingStatus}
                    className={`px-6 py-3 font-medium transition ${
                      hasApplied
                        ? "bg-gray-500 cursor-not-allowed text-gray-300"
                        : "bg-[var(--accent-gold)] text-black hover:opacity-90"
                    } ${loadingStatus ? "opacity-50 cursor-wait" : ""}`}
                  >
                    {loadingStatus ? "Checking..." : hasApplied ? "Applied" : "Apply Now"}
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 border border-white/20 text-white hover:bg-white/10 transition"
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* APPLY FLOW MODAL */}
        {applyOpen && jobId && (
          <ApplyFlowModal
            jobId={jobId}
            jobTitle={job.title}
            directorTrustScore={job.directorTrustScore}
            onClose={() => {
              setApplyOpen(false);
              // Refresh applied status after modal closes (in case application was successful)
              async function refreshStatus() {
                try {
                  const res = await fetch(`/api/apply/status?jobId=${jobId}`);
                  const data = await res.json();
                  setHasApplied(data.applied || false);
                } catch (error) {
                  // Silently fail
                }
              }
              refreshStatus();
            }}
          />
        )}
      </>
    </AnimatePresence>
  );
}
