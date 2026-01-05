"use client";

import { motion } from "framer-motion";
import JobCard from "./job-card";

type Job = {
  id: string;
  title: string;
  type: string;
  location: string;
  budget: string;
  deadline: string;
  status: "open" | "closed";
  applicationCount: number;
};

type JobListProps = {
  jobs: Job[];
  onJobClick: (job: Job) => void;
  onJobEdit?: (job: Job) => void;
};

export default function JobList({ jobs, onJobClick, onJobEdit }: JobListProps) {
  if (jobs.length === 0) {
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
              "url('https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />

        <div className="relative z-10">
          <p className="text-[var(--text-secondary)] text-lg mb-4">
            No jobs posted yet
          </p>
          <p className="text-[var(--text-secondary)] text-sm">
            Create your first casting call to get started
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {jobs.map((job, index) => (
        <motion.div
          key={job.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
        >
          <JobCard
            job={job}
            onClick={() => onJobClick(job)}
            onEdit={onJobEdit ? () => onJobEdit(job) : undefined}
          />
        </motion.div>
      ))}
    </div>
  );
}
