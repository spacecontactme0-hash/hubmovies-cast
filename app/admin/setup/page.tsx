"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AdminSetupPage() {
  const [email, setEmail] = useState("enjayjerey@gmail.com");
  const [password, setPassword] = useState("password@123");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSetup = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Admin user created successfully!");
      } else {
        setError(data.error || "Failed to create admin user");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-(--bg-main) flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/5 border border-white/10 rounded-lg p-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h1 className="text-2xl font-heading text-white mb-1">Admin Setup</h1>
            <p className="text-sm text-(--text-secondary)">Create the initial admin user account</p>
          </div>
          <div>
            <Link href="/admin" className="px-3 py-2 border border-white/20 text-white rounded hover:bg-white/10">← Back to Admin</Link>
          </div>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded text-sm text-green-400">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded text-white"
            />
          </div>

          <button
            onClick={handleSetup}
            disabled={loading}
            className="w-full px-6 py-3 bg-(--accent-gold) text-black font-medium rounded hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Admin User"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

