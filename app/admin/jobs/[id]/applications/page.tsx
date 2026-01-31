"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

type Application = {
  _id: string;
  jobId: string;
  talentId: string;
  answer: string;
  mediaUrl: string;
  status: string;
  createdAt: string;
};

type Job = {
  _id: string;
  title: string;
  type: string;
  location: string;
};

export default function AdminJobApplicationsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const [applications, setApplications] = useState<Application[]>([]);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // Fetch applications
        const appsRes = await fetch(`/api/admin/jobs/${jobId}/applications`);
        if (appsRes.ok) {
          const appsData = await appsRes.json();
          setApplications(appsData.applications || []);
        } else {
          const errorData = await appsRes.json();
          setError(errorData.error || "Failed to fetch applications");
        }

        // Fetch job details (from admin jobs endpoint)
        const jobsRes = await fetch(`/api/admin/jobs`);
        if (jobsRes.ok) {
          const jobsData = await jobsRes.json();
          const foundJob = jobsData.jobs?.find((j: any) => j._id === jobId);
          if (foundJob) {
            setJob(foundJob);
          }
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    if (jobId) {
      fetchData();
    }
  }, [jobId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-(--bg-main) flex items-center justify-center">
        <p className="text-(--text-secondary)">Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--bg-main) p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/admin/jobs"
              className="text-sm text-(--text-secondary) hover:text-white transition mb-2 inline-block"
            >
              ← Back to Jobs
            </Link>
            <h1 className="text-4xl font-heading text-white">
              Applications for: {job?.title || "Job"}
            </h1>
            {job && (
              <p className="text-sm text-(--text-secondary) mt-2">
                {job.type} · {job.location}
              </p>
            )}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500/30 rounded text-red-400">
            {error}
          </div>
        )}

        {applications.length === 0 ? (
          <div className="text-center py-16 bg-white/5 border border-white/10 rounded-lg">
            <p className="text-xl text-white/60 mb-4">No applications found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <motion.div
                key={app._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 border border-white/10 rounded-lg p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm text-[var(--text-secondary)]">
                        Talent ID: {app.talentId}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded border ${
                        app.status === "shortlisted"
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : app.status === "rejected"
                          ? "bg-red-500/20 text-red-400 border-red-500/30"
                          : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                      }`}>
                        {app.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-white mb-2">{app.answer}</p>
                    {app.mediaUrl && (
                      <p className="text-xs text-[var(--text-secondary)]">
                        Media: <a href={app.mediaUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--accent-gold)] hover:underline">View</a>
                      </p>
                    )}
                    <p className="text-xs text-[var(--text-secondary)] mt-2">
                      Applied {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <Link
                    href={`/admin/trust/talent/${app.talentId}`}
                    className="text-sm text-[var(--accent-gold)] hover:underline"
                  >
                    View Talent Profile →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

