"use client";

import { motion } from "framer-motion";

type Application = {
  _id: string;
  talentId: string;
  talentName?: string;
  answer: string;
  mediaUrl: string;
  status: "submitted" | "shortlisted" | "rejected";
  createdAt: string;
};

type ApplicationRowProps = {
  application: Application;
  onShortlist: (id: string) => void;
  onReject: (id: string) => void;
  onMessage: (id: string) => void;
  onViewProfile?: (talentId: string) => void;
  selected?: boolean;
  onToggleSelect?: () => void;
};

export default function ApplicationRow({
  application,
  onShortlist,
  onReject,
  onMessage,
  selected = false,
  onToggleSelect,
}: ApplicationRowProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "shortlisted":
        return "bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] border-[var(--accent-gold)]/30";
      case "rejected":
        return "bg-white/10 text-[var(--text-secondary)] border-white/10";
      default:
        return "bg-white/5 text-white border-white/10";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Generate consistent portrait based on talentId
  const portraitIndex = parseInt(application.talentId.slice(-1) || "0", 16) % 4;
  const portraits = [
    "https://images.pexels.com/photos/1540977/pexels-photo-1540977.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
    "https://images.pexels.com/photos/1540978/pexels-photo-1540978.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
    "https://images.pexels.com/photos/1540979/pexels-photo-1540979.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
    "https://images.pexels.com/photos/1540980/pexels-photo-1540980.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white/5 border border-white/10 p-4 rounded relative overflow-hidden group"
    >
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-5"
        style={{ backgroundImage: `url('${portraits[portraitIndex]}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

      <div className="relative z-10 flex items-start gap-4">
        {/* Checkbox for bulk selection */}
        {onToggleSelect && (
          <div className="flex-shrink-0 pt-1">
            <input
              type="checkbox"
              checked={selected}
              onChange={onToggleSelect}
              className="w-4 h-4 rounded border-white/20 bg-white/5 text-[var(--accent-gold)] focus:ring-[var(--accent-gold)]"
            />
          </div>
        )}
        {/* Portrait thumbnail */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20">
            <img
              src={portraits[portraitIndex]}
              alt={application.talentName || "Talent"}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="text-white font-medium">
                  {application.talentName || `Talent ${application.talentId.slice(0, 8)}`}
                </h4>
                <span
                  className={`px-2 py-1 text-xs rounded border ${getStatusColor(
                    application.status
                  )}`}
                >
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                Submitted {formatDate(application.createdAt)}
              </p>
            </div>
          </div>

          <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2">
            {application.answer}
          </p>

          <div className="flex items-center gap-3">
            <a
              href={application.mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--accent-gold)] hover:underline"
            >
              View Media
            </a>
            <div className="flex gap-2 ml-auto">
            <button
              onClick={() => onViewProfile && onViewProfile(application.talentId)}
              className="px-3 py-1 text-sm border border-white/20 text-white rounded hover:bg-white/10 transition mr-2"
            >
              View Profile
            </button>
              {application.status === "submitted" && (
                <>
                  <button
                    onClick={() => onShortlist(application._id)}
                    className="px-4 py-2 text-sm bg-[var(--accent-gold)] text-black rounded hover:opacity-90 transition"
                  >
                    Shortlist
                  </button>
                  <button
                    onClick={() => onReject(application._id)}
                    className="px-4 py-2 text-sm border border-white/20 text-white rounded hover:bg-white/10 transition"
                  >
                    Reject
                  </button>
                </>
              )}
              <button
                onClick={() => onMessage(application._id)}
                className="px-4 py-2 text-sm border border-white/20 text-white rounded hover:bg-white/10 transition"
              >
                Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
