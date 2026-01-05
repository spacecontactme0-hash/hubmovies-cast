"use client";

import { motion, AnimatePresence } from "framer-motion";
import ModalShell from "@/app/components/modals/modal-shell";
import ApplicationsPanel from "../components/applications-panel";

type Application = {
  _id: string;
  talentId: string;
  talentName?: string;
  answer: string;
  mediaUrl: string;
  status: "submitted" | "shortlisted" | "rejected";
  createdAt: string;
};

type Job = {
  id: string;
  title: string;
};

type ManageApplicantsModalProps = {
  job: Job;
  applications: Application[];
  loading: boolean;
  onClose: () => void;
  onShortlist: (id: string) => void;
  onReject: (id: string) => void;
  onMessage: (id: string) => void;
  onBulkAction?: (ids: string[], action: "shortlist" | "reject") => void;
};

export default function ManageApplicantsModal({
  job,
  applications,
  loading,
  onClose,
  onShortlist,
  onReject,
  onMessage,
  onBulkAction,
}: ManageApplicantsModalProps) {
  return (
    <ModalShell onClose={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="space-y-6"
      >
        {/* Header */}
        <div>
          <p className="text-xs tracking-[0.3em] text-[var(--accent-gold)] mb-2">
            MANAGE APPLICANTS
          </p>
          <h2 className="text-2xl text-white mb-2">{job.title}</h2>
          <p className="text-sm text-[var(--text-secondary)]">
            {applications.length} {applications.length === 1 ? "application" : "applications"}
          </p>
        </div>

        {/* Applications List */}
        <ApplicationsPanel
          applications={applications}
          loading={loading}
          onShortlist={onShortlist}
          onReject={onReject}
          onMessage={onMessage}
          onBulkAction={onBulkAction}
        />
      </motion.div>
    </ModalShell>
  );
}


