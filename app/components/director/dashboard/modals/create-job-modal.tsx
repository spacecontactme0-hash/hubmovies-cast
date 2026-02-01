"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ModalShell from "@/app/components/modals/modal-shell";

type CreateJobModalProps = {
  onClose: () => void;
  showDirectorSelector?: boolean; // when true, fetches list of directors and lets admin assign one
  onSubmit: (jobData: {
    title: string;
    type: string;
    location: string;
    budget: string;
    deadline: string;
    description: string;
    directorId?: string;
  }) => void;
};

export default function CreateJobModal({ onClose, onSubmit, showDirectorSelector = false }: CreateJobModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    location: "",
    budget: "",
    deadline: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  // Director selector states (used only when showDirectorSelector is true)
  const [directors, setDirectors] = useState<Array<{ id: string; name?: string; email?: string }>>([]);
  const [selectedDirectorId, setSelectedDirectorId] = useState<string>("");

  useEffect(() => {
    if (!showDirectorSelector) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/admin/directors');
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setDirectors(data.directors || []);
      } catch (err) {
        console.error('Failed to fetch directors for selector:', err);
      }
    })();

    return () => { cancelled = true; };
  }, [showDirectorSelector]);

  // Make inputs full width on mobile and arrange responsive grids
  // (mobile-first: single column, switch to two columns on sm+)
  const gridColsClass = "grid grid-cols-1 sm:grid-cols-2 gap-4";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.title || !formData.type || !formData.location) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      // Include directorId when set (admin flow)
      const payload = { ...formData, directorId: selectedDirectorId || undefined };
      await onSubmit(payload);
      // Reset form on success
      setFormData({
        title: "",
        type: "",
        location: "",
        budget: "",
        deadline: "",
        description: "",
      });
      setSelectedDirectorId("");
    } catch (error) {
      // Error handling is done in parent
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell onClose={onClose}>
      <div className="max-h-[72vh] overflow-y-auto pr-2">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="space-y-6 p-2 sm:p-0"
        >
        {/* Header */}
        <div>
          <p className="text-xs tracking-[0.3em] text-[var(--accent-gold)] mb-2">
            CREATE NEW JOB
          </p>
          <h2 className="text-2xl text-white">Post a Casting Call</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-(--text-secondary) mb-2">
              Job Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:outline-none focus:border-(--accent-gold)/50"
              required
            />
          </div>

          {/* Director selector (admins only) */}
          {showDirectorSelector && (
            <div>
              <label className="block text-sm text-(--text-secondary) mb-2">Assign to Director (optional)</label>
              <select
                value={selectedDirectorId}
                onChange={(e) => setSelectedDirectorId(e.target.value)}
                className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:outline-none"
              >
                <option value="">Post as Admin (default)</option>
                {directors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name ? `${d.name} (${d.email})` : d.email}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className={gridColsClass}>
            <div>
              <label className="block text-sm text-(--text-secondary) mb-2">
                Role Type *
              </label>
              <input
                type="text"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:outline-none focus:border-(--accent-gold)/50"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-(--text-secondary) mb-2">
                Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:outline-none focus:border-(--accent-gold)/50"
                required
              />
            </div>
          </div>

          <div className={gridColsClass}>
            <div>
              <label className="block text-sm text-(--text-secondary) mb-2">
                Budget
              </label>
              <input
                type="text"
                value={formData.budget}
                onChange={(e) =>
                  setFormData({ ...formData, budget: e.target.value })
                }
                placeholder="$5,000 - $10,000"
                className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:outline-none focus:border-(--accent-gold)/50"
              />
            </div>
            <div>
              <label className="block text-sm text-(--text-secondary) mb-2">
                Deadline
              </label>
              <input
                type="text"
                value={formData.deadline}
                onChange={(e) =>
                  setFormData({ ...formData, deadline: e.target.value })
                }
                placeholder="Closes in 7 days"
                className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:outline-none focus:border-(--accent-gold)/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-(--text-secondary) mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:outline-none focus:border-(--accent-gold)/50 resize-none max-h-40"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:flex-1 px-4 py-2 text-sm border border-white/20 text-white rounded hover:bg-white/10 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:flex-1 px-4 py-2 text-sm bg-(--accent-gold) text-black rounded hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Job"}
            </button>
          </div>
        </form>
      </motion.div>
      </div>
    </ModalShell>
  );
}
