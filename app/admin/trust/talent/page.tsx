"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type TalentRow = {
  _id: string;
  email: string;
  name?: string;
  verificationTier?: string;
  createdAt: string;
};

export default function AdminTrustTalentIndexPage() {
  const [talents, setTalents] = useState<TalentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/users?role=TALENT&limit=50`);
        if (res.ok) {
          const d = await res.json();
          setTalents(d.users || []);
        } else {
          const d = await res.json();
          setError(d.error || "Failed to fetch talents");
        }
      } catch (err) {
        console.error(err);
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-4xl font-heading text-white">Admin: Talent Trust</h1>
          <div className="flex gap-2">
            <Link href="/admin" className="px-4 py-2 border border-white/20 text-white rounded hover:bg-white/10 transition">← Back to Admin</Link>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500/30 rounded text-red-400">{error}</div>
        )}

        <div className="bg-white/5 border border-white/10 rounded-lg p-4 sm:p-6">
          {loading ? (
            <p className="text-[var(--text-secondary)]">Loading talents...</p>
          ) : talents.length === 0 ? (
            <p className="text-[var(--text-secondary)]">No talents found.</p>
          ) : (
            <div className="space-y-3">
              {talents.map((t) => (
                <Link key={t._id} href={`/admin/trust/talent/${t._id}`} className="block p-3 bg-white/3 rounded hover:bg-white/5 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">{t.name || t.email}</div>
                      <div className="text-sm text-[var(--text-secondary)]">{t.email} • Registered {new Date(t.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="text-sm text-[var(--text-secondary)]">{t.verificationTier || "—"}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
