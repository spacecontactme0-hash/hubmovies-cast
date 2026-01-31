"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ApplicationDetailModal from "./components/application-detail-modal";
import MessageThreadModal from "./components/message-thread-modal";

function ProfileCompletionCard() {
  const [completion, setCompletion] = useState<{
    score: number;
    missing: string[];
    complete: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchCompletion() {
      try {
        const res = await fetch("/api/talent/profile/completion");
        if (res.ok) {
          const data = await res.json();
          setCompletion(data);
        }
      } catch (error) {
        console.error("Failed to fetch profile completion:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCompletion();
  }, []);

  if (loading || !completion) {
    return null;
  }

  // Only show if incomplete
  if (completion.complete) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 p-4 bg-white/5 border border-white/10 rounded"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <p className="text-white text-sm font-medium mb-1">
            Complete Your Profile
          </p>
          <p className="text-(--text-secondary) text-xs">
            Your profile is {completion.score}% complete. Complete your profile to apply for roles.
          </p>
        </div>
        <button
          onClick={() => router.push("/talent/profile")}
          className="px-4 py-2 bg-(--accent-gold) text-black text-sm font-medium rounded hover:opacity-90 transition"
        >
          Complete
        </button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-[var(--text-secondary)]">Progress</span>
          <span className="text-white">{completion.score}% / 70%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completion.score}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full bg-[var(--accent-gold)]"
          />
        </div>
      </div>

      {/* Missing Fields (if any) */}
      {completion.missing.length > 0 && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-[var(--text-secondary)] text-xs mb-2">Missing:</p>
          <div className="flex flex-wrap gap-2">
            {completion.missing.slice(0, 3).map((field, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-white/5 rounded text-[var(--text-secondary)] capitalize"
              >
                {field}
              </span>
            ))}
            {completion.missing.length > 3 && (
              <span className="text-xs px-2 py-1 bg-white/5 rounded text-[var(--text-secondary)]">
                +{completion.missing.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}

type Application = {
  _id: string;
  jobId: string;
  talentId: string;
  answer: string;
  mediaUrl: string;
  status: "submitted" | "shortlisted" | "rejected";
  createdAt: string;
  job: {
    id: string;
    title: string;
    type: string;
    location: string;
    budget: string;
    deadline: string;
    description?: string;
  } | null;
  hasMessages: boolean;
};

export default function TalentDashboard() {
  const router = useRouter();
  const sessionResult = useSession();
  const session = sessionResult?.data;
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showMessages, setShowMessages] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const emailVerified = session?.user ? ((session.user as any)?.emailVerified ?? false) : false;

  // Fetch applications for logged-in talent
  useEffect(() => {
    async function fetchApplications() {
      setLoading(true);
      try {
        const res = await fetch("/api/talent/applications");
        if (res.ok) {
          const data = await res.json();
          setApplications(data.applications || []);
        } else {
          const errorData = await res.json().catch(() => ({}));
          console.error("Failed to fetch applications:", errorData.error);
          if (res.status === 401) {
            alert("Please log in to view your applications.");
          }
        }
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchApplications();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "shortlisted":
        return "text-(--accent-gold) border-(--accent-gold)/30";
      case "rejected":
        return "text-[#8f1d18] border-[#8f1d18]/30";
      default:
        return "text-(--text-secondary) border-white/10";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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

      {/* Dashboard Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-12">
        {/* Dashboard Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-heading text-(--text-primary) mb-2">
            My Applications
          </h1>
          <p className="text-sm font-body text-(--text-secondary)">
            Track the status of roles you've applied for.
          </p>
        </motion.div>

        {/* Email Verification Notice */}
        {!emailVerified && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-white/5 border border-white/10 rounded text-sm text-[var(--text-secondary)]"
          >
            <span className="text-[var(--accent-gold)]">Email verification required</span> to continue applying to roles.
          </motion.div>
        )}

        {/* Profile Completion Progress */}
        {emailVerified && (
          <ProfileCompletionCard />
        )}

        {/* Applications List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-(--text-secondary) font-body">Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-[var(--text-secondary)] font-body mb-2">
              You haven't applied to any roles yet.
            </p>
            <p className="text-sm text-[var(--text-secondary)] font-body mb-6">
              Explore open casting calls and submit your first application.
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2 border border-white/20 text-white hover:border-white/40 transition font-body text-sm"
            >
              Browse Jobs
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {applications.map((app, index) => (
              <motion.div
                key={app._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3, ease: "easeOut" }}
                className="bg-[var(--bg-surface)] border border-white/8 rounded-xl p-5 hover:bg-[var(--bg-surface)]/80 transition-colors"
              >
                {/* Top Row: Job Title + Status Badge */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-heading text-[var(--text-primary)]">
                    {app.job?.title || "Job Application"}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs uppercase rounded border ${getStatusColor(
                      app.status
                    )} font-body`}
                  >
                    {app.status}
                  </span>
                </div>

                {/* Second Row: Role Type · Location */}
                {app.job && (
                  <p className="text-sm text-[var(--text-secondary)] font-body mb-2">
                    {app.job.type} · {app.job.location}
                  </p>
                )}

                {/* Third Row: Applied Date */}
                <p className="text-xs text-[#8a8a8c] font-body mb-4">
                  Applied on {formatDate(app.createdAt)}
                </p>

                {/* Divider */}
                <div className="border-t border-white/10 my-4" />

                {/* Actions Row */}
                <div className="flex items-center justify-end gap-3">
                  {app.hasMessages && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedApplication(app);
                        setShowMessages(true);
                      }}
                      className="px-4 py-2 border border-white/20 text-[var(--text-secondary)] hover:border-white/40 hover:text-white transition font-body text-sm relative"
                      aria-label="View Messages"
                    >
                      View Messages
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-[var(--accent-gold)] rounded-full" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedApplication(app);
                    }}
                    className="px-4 py-2 border border-white/20 text-white hover:border-white/40 transition font-body text-sm"
                    aria-label="View Details"
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Application Detail Modal */}
      <AnimatePresence>
        {selectedApplication && !showMessages && (
          <ApplicationDetailModal
            application={selectedApplication}
            onClose={() => setSelectedApplication(null)}
          />
        )}
      </AnimatePresence>

      {/* Message Thread Modal */}
      <AnimatePresence>
        {selectedApplication && showMessages && (
          <MessageThreadModal
            application={selectedApplication}
            onClose={() => {
              setShowMessages(false);
              setSelectedApplication(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
