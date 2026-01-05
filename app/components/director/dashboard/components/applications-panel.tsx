"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApplicationRow from "./application-row";

type Application = {
  _id: string;
  talentId: string;
  talentName?: string;
  answer: string;
  mediaUrl: string;
  status: "submitted" | "shortlisted" | "rejected";
  createdAt: string;
};

type ApplicationsPanelProps = {
  applications: Application[];
  loading: boolean;
  onShortlist: (id: string) => void;
  onReject: (id: string) => void;
  onMessage: (id: string) => void;
  onBulkAction?: (ids: string[], action: "shortlist" | "reject") => void;
};

export default function ApplicationsPanel({
  applications,
  loading,
  onShortlist,
  onReject,
  onMessage,
  onBulkAction,
}: ApplicationsPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "submitted" | "shortlisted" | "rejected">("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Filter applications
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      // Status filter
      if (statusFilter !== "all" && app.status !== statusFilter) {
        return false;
      }

      // Search filter (searches in talent name and answer)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = app.talentName?.toLowerCase().includes(query);
        const matchesAnswer = app.answer.toLowerCase().includes(query);
        if (!matchesName && !matchesAnswer) {
          return false;
        }
      }

      return true;
    });
  }, [applications, statusFilter, searchQuery]);

  const handleSelectAll = () => {
    if (selectedIds.size === filteredApplications.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredApplications.map((app) => app._id)));
    }
  };

  const handleToggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkShortlist = () => {
    if (onBulkAction && selectedIds.size > 0) {
      onBulkAction(Array.from(selectedIds), "shortlist");
      setSelectedIds(new Set());
    }
  };

  const handleBulkReject = () => {
    if (onBulkAction && selectedIds.size > 0) {
      onBulkAction(Array.from(selectedIds), "reject");
      setSelectedIds(new Set());
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--text-secondary)]">Loading applications...</p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16 relative overflow-hidden rounded-lg"
      >
        {/* Subtle background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-5"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/3184302/pexels-photo-3184302.jpeg?auto=compress&cs=tinysrgb&w=800')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />

        <div className="relative z-10">
          <p className="text-[var(--text-secondary)] text-lg mb-2">
            No applications yet
          </p>
          <p className="text-[var(--text-secondary)] text-sm">
            Applications will appear here when talents apply to this job
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search by name or answer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-[var(--text-secondary)] text-sm font-body focus:outline-none focus:border-white/20"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded text-white text-sm font-body focus:outline-none focus:border-white/20"
          >
            <option value="all">All Status</option>
            <option value="submitted">Submitted</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {onBulkAction && filteredApplications.length > 0 && (
          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
            <button
              onClick={handleSelectAll}
              className="text-xs text-[var(--text-secondary)] hover:text-white transition font-body"
            >
              {selectedIds.size === filteredApplications.length ? "Deselect All" : "Select All"}
            </button>
            {selectedIds.size > 0 && (
              <>
                <span className="text-xs text-[var(--text-secondary)]">
                  {selectedIds.size} selected
                </span>
                <button
                  onClick={handleBulkShortlist}
                  className="px-3 py-1 text-xs bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] border border-[var(--accent-gold)]/30 rounded hover:bg-[var(--accent-gold)]/30 transition font-body"
                >
                  Bulk Shortlist
                </button>
                <button
                  onClick={handleBulkReject}
                  className="px-3 py-1 text-xs bg-white/5 text-[var(--text-secondary)] border border-white/10 rounded hover:border-white/20 transition font-body"
                >
                  Bulk Reject
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Applications List */}
      <div className="max-h-[60vh] overflow-y-auto space-y-4">
        <AnimatePresence>
          {filteredApplications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[var(--text-secondary)] text-sm font-body">
                No applications match your filters
              </p>
            </div>
          ) : (
            filteredApplications.map((app) => (
              <ApplicationRow
                key={app._id}
                application={app}
                onShortlist={onShortlist}
                onReject={onReject}
                onMessage={onMessage}
                selected={selectedIds.has(app._id)}
                onToggleSelect={onBulkAction ? () => handleToggleSelect(app._id) : undefined}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
