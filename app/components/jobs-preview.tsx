"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import JobDetailModal from "./job-detail-modal";

const jobs = [
  {
    id: "job-1",
    title: "Feature Film — Lead Actress",
    type: "Actor",
    location: "Global / Remote",
    budget: "$15,000 – $25,000",
    deadline: "Closes in 5 days",
  },
  {
    id: "job-2",
    title: "Netflix-Style Series — Cinematographer",
    type: "Crew",
    location: "Berlin, Germany",
    budget: "$8,000 – $12,000",
    deadline: "Closes in 9 days",
  },
  {
    id: "job-3",
    title: "Luxury Fashion Campaign — Models",
    type: "Model",
    location: "Paris, France",
    budget: "$4,000 – $7,000",
    deadline: "Closes in 3 days",
  },
  {
    id: "job-4",
    title: "Animated Short — Voice Actor",
    type: "Voice",
    location: "Remote",
    budget: "$2,500 – $4,000",
    deadline: "Closes in 6 days",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export default function JobsPreview() {
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());

  // Check applied status for all jobs on mount
  useEffect(() => {
    async function checkAppliedStatus() {
      const appliedSet = new Set<string>();
      
      for (const job of jobs) {
        try {
          const res = await fetch(`/api/apply/status?jobId=${job.id}`);
          const data = await res.json();
          if (data.applied) {
            appliedSet.add(job.id);
          }
        } catch (error) {
          // Silently fail - assume not applied
        }
      }
      
      setAppliedJobs(appliedSet);
    }

    checkAppliedStatus();
  }, []);

  return (
    <>
      <section className="relative py-28 bg-[var(--bg-surface)] overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-white/10" />

        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="max-w-3xl mb-16"
          >
            <p className="text-sm tracking-[0.25em] text-[var(--accent-gold)] mb-4">
              LIVE OPPORTUNITIES
            </p>
            <h2 className="text-white mb-6">
              Casting Calls From Verified Producers
            </h2>
            <p className="text-[var(--text-secondary)]">
              Explore real projects across film, television, advertising, and
              digital media — curated from trusted producers worldwide.
            </p>
          </motion.div>

          {/* Jobs */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="divide-y divide-white/10"
          >
            {jobs.map((job, index) => {
              const hasApplied = appliedJobs.has(job.id);
              
              return (
                <motion.div
                  key={job.id}
                  variants={item}
                  onClick={() => {
                    // Prevent opening modal if already applied
                    if (!hasApplied) {
                      setSelectedJob(job);
                    }
                  }}
                  className={`group py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 ${
                    hasApplied 
                      ? "cursor-not-allowed opacity-60" 
                      : "cursor-pointer"
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`text-xl text-white transition ${
                        hasApplied 
                          ? "" 
                          : "group-hover:text-[var(--accent-gold)]"
                      }`}>
                        {job.title}
                      </h3>
                      {hasApplied && (
                        <span className="px-2 py-1 text-xs bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] border border-[var(--accent-gold)]/30 rounded">
                          Applied
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {job.type} · {job.location}
                    </p>
                  </div>

                  <div className="flex items-center gap-10">
                    <div className="text-sm text-[var(--text-secondary)] hidden sm:block">
                      {job.budget}
                    </div>
                    <div className="text-sm text-[var(--text-secondary)]">
                      {job.deadline}
                    </div>
                    {!hasApplied && (
                      <span className="text-sm text-white group-hover:translate-x-1 transition">
                        →
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-16"
          >
            <Link
              href="/jobs"
              className="inline-flex items-center gap-3 text-[var(--accent-gold)] text-sm tracking-wide hover:gap-5 transition-all"
            >
              View all casting opportunities
              <span className="text-lg">→</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Modal */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => {
            setSelectedJob(null);
            // Refresh applied status when modal closes (in case user applied)
            async function refreshStatus() {
              try {
                const res = await fetch(`/api/apply/status?jobId=${selectedJob.id}`);
                const data = await res.json();
                if (data.applied) {
                  setAppliedJobs((prev) => new Set([...prev, selectedJob.id]));
                }
              } catch (error) {
                // Silently fail
              }
            }
            refreshStatus();
          }}
        />
      )}
    </>
  );
}
