"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--bg-main)] relative flex items-center justify-center p-8">
      {/* Noise overlay */}
      <div
        className="fixed inset-0 opacity-[0.015] pointer-events-none z-0"
        style={{
          backgroundImage: "url('/noise.png')",
          backgroundRepeat: "repeat",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-heading text-white mb-2">
            Welcome to <span className="text-[var(--accent-gold)]">HubMovies</span>
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Sign in or create an account to get started
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/auth/password"
            className="block w-full px-6 py-3 bg-[var(--accent-gold)] text-black font-medium rounded hover:opacity-90 transition text-center font-body"
          >
            Sign In with Email
          </Link>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[var(--bg-main)] text-[var(--text-secondary)]">
                New to HubMovies?
              </span>
            </div>
          </div>

          <Link
            href="/signup"
            className="block w-full px-6 py-3 border border-white/20 text-white font-medium rounded hover:bg-white/10 transition text-center font-body"
          >
            Create Account
          </Link>
        </div>

        <div className="mt-6 text-center space-y-2">
          <button
            onClick={() => router.push("/")}
            className="text-sm text-[var(--text-secondary)] hover:text-white transition font-body"
          >
            ← Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}

