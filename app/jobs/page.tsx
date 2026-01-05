"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import JobDetailModal from "@/app/components/job-detail-modal";

type Job = {
  _id: string;
  title: string;
  type: string;
  location: string;
  budget: string;
  deadline: string;
  description?: string;
  status: "open" | "closed";
  createdAt: string;
  directorTrustScore?: number;
};

type Filter = {
  type: string[];
  location: string;
  status: "all" | "open" | "closed";
};

export default function JobsListingPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<Filter>({
    type: [],
    location: "",
    status: "open",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  // Fetch jobs
  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      try {
        // TODO: Replace with actual API endpoint when available
        // For now, using mock data structure
        const res = await fetch("/api/jobs");
        if (res.ok) {
          const data = await res.json();
          setJobs(data.jobs || []);
        } else {
          // Fallback to empty array if API fails
          setJobs([]);
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  // Check applied status
  useEffect(() => {
    async function checkAppliedStatus() {
      const appliedSet = new Set<string>();
      for (const job of jobs) {
        try {
          const res = await fetch(`/api/apply/status?jobId=${job._id}`);
          const data = await res.json();
          if (data.applied) {
            appliedSet.add(job._id);
          }
        } catch (error) {
          // Silently fail
        }
      }
      setAppliedJobs(appliedSet);
    }

    if (jobs.length > 0) {
      checkAppliedStatus();
    }
  }, [jobs]);

  // Apply filters
  useEffect(() => {
    let filtered = [...jobs];

    // Filter by status
    if (filters.status !== "all") {
      filtered = filtered.filter((job) => job.status === filters.status);
    }

    // Filter by type
    if (filters.type.length > 0) {
      filtered = filtered.filter((job) => filters.type.includes(job.type));
    }

    // Filter by location
    if (filters.location) {
      filtered = filtered.filter((job) =>
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [jobs, filters]);

  const handleTypeFilter = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      type: prev.type.includes(type)
        ? prev.type.filter((t) => t !== type)
        : [...prev.type, type],
    }));
  };

  const jobTypes = ["Actor", "Crew", "Model", "Voice"];
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Closed";
    if (diffDays === 0) return "Closes today";
    if (diffDays === 1) return "Closes tomorrow";
    return `Closes in ${diffDays} days`;
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] relative">
      {/* Noise overlay */}
      <div
        className="fixed inset-0 opacity-[0.015] pointer-events-none z-0"
        style={{
          backgroundImage: "url('/noise.png')",
          backgroundRepeat: "repeat",
        }}
      />

      {/* Fixed Cinematic Header */}
      <div className="fixed top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 to-transparent z-20 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-12">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mb-12 relative overflow-hidden rounded-lg"
        >
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage:
                "url('https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1920')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />

          {/* Content */}
          <div className="relative z-10 p-8 md:p-12">
            <p className="text-xs tracking-[0.3em] text-[var(--accent-gold)] mb-3">
              CASTING OPPORTUNITIES
            </p>
            <h1 className="text-4xl md:text-5xl text-white mb-3 font-heading">
              Open Casting Calls
            </h1>
            <p className="text-[var(--text-secondary)] text-lg">
              Discover roles across film, television, and digital media
            </p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
          className="mb-8 bg-[var(--bg-surface)] border border-white/10 p-6 rounded-lg"
        >
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--text-secondary)] font-body">Type:</span>
              {jobTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => handleTypeFilter(type)}
                  className={`px-3 py-1 text-xs rounded border transition font-body ${
                    filters.type.includes(type)
                      ? "bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] border-[var(--accent-gold)]/30"
                      : "bg-white/5 text-[var(--text-secondary)] border-white/10 hover:border-white/20"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--text-secondary)] font-body">Status:</span>
              {(["all", "open", "closed"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilters((prev) => ({ ...prev, status }))}
                  className={`px-3 py-1 text-xs rounded border transition font-body ${
                    filters.status === status
                      ? "bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] border-[var(--accent-gold)]/30"
                      : "bg-white/5 text-[var(--text-secondary)] border-white/10 hover:border-white/20"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Search location..."
              value={filters.location}
              onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
              className="ml-auto px-4 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-[var(--text-secondary)] text-sm font-body focus:outline-none focus:border-white/20"
            />
          </div>
        </motion.div>

        {/* Jobs List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-[var(--text-secondary)] font-body">Loading jobs...</p>
          </div>
        ) : paginatedJobs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 relative overflow-hidden rounded-lg"
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-5"
              style={{
                backgroundImage:
                  "url('https://images.pexels.com/photos/3184302/pexels-photo-3184302.jpeg?auto=compress&cs=tinysrgb&w=800')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
            <div className="relative z-10">
              <p className="text-[var(--text-secondary)] text-lg mb-2 font-body">
                No jobs found
              </p>
              <p className="text-[var(--text-secondary)] text-sm font-body">
                Try adjusting your filters
              </p>
            </div>
          </motion.div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {paginatedJobs.map((job, index) => {
                const hasApplied = appliedJobs.has(job._id);
                return (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3, ease: "easeOut" }}
                    onClick={() => {
                      if (!hasApplied) {
                        setSelectedJob(job);
                      }
                    }}
                    className={`bg-[var(--bg-surface)] border border-white/8 rounded-xl p-6 hover:border-white/20 transition-all relative overflow-hidden group ${
                      hasApplied ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                    }`}
                  >
                    {/* Subtle background */}
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-5 group-hover:opacity-10 transition-opacity"
                      style={{
                        backgroundImage:
                          "url('https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800')",
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

                    <div className="relative z-10 flex items-start justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                          <h3 className="text-xl text-white group-hover:text-[var(--accent-gold)] transition font-heading">
                            {job.title}
                          </h3>
                          {hasApplied && (
                            <span className="px-3 py-1 text-xs bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] border border-[var(--accent-gold)]/30 rounded font-body">
                              Applied
                            </span>
                          )}
                          {job.directorTrustScore !== undefined && (() => {
                            // Dynamic import to avoid SSR issues
                            const { getTrustBadge } = require("@/lib/director-trust");
                            const badge = getTrustBadge(job.directorTrustScore || 0);
                            return (
                              <span
                                className={`px-2 py-1 text-xs rounded border ${badge.bgColor} ${badge.color} ${badge.borderColor} font-body`}
                              >
                                {badge.label}
                              </span>
                            );
                          })()}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                          <div>
                            <p className="text-[var(--text-secondary)] mb-1 font-body">Type</p>
                            <p className="text-white font-body">{job.type}</p>
                          </div>
                          <div>
                            <p className="text-[var(--text-secondary)] mb-1 font-body">Location</p>
                            <p className="text-white font-body">{job.location}</p>
                          </div>
                          <div>
                            <p className="text-[var(--text-secondary)] mb-1 font-body">Deadline</p>
                            <p className="text-white font-body">{formatDate(job.deadline)}</p>
                          </div>
                        </div>
                        {job.budget && (
                          <p className="text-sm text-[var(--text-secondary)] font-body">
                            Budget: <span className="text-white">{job.budget}</span>
                          </p>
                        )}
                      </div>
                      {!hasApplied && (
                        <span className="text-white group-hover:translate-x-1 transition">→</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-white/40 transition font-body text-sm"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-[var(--text-secondary)] font-body text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-white/40 transition font-body text-sm"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => {
            // Capture job ID before setting to null
            const jobId = selectedJob?._id;
            setSelectedJob(null);
            // Refresh applied status
            if (jobId) {
              async function refreshStatus() {
                try {
                  const res = await fetch(`/api/apply/status?jobId=${jobId}`);
                  const data = await res.json();
                  if (data.applied) {
                    setAppliedJobs((prev) => new Set([...prev, jobId]));
                  }
                } catch (error) {
                  // Silently fail
                }
              }
              refreshStatus();
            }
          }}
        />
      )}
    </div>
  );
}
