"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PasswordLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else if (result?.ok) {
        // Fetch session to determine user role for redirect
        try {
          const sessionRes = await fetch("/api/auth/session");
          if (sessionRes.ok) {
            const session = await sessionRes.json();
            const userRole = session?.user?.role;
            
            // Redirect based on role
            if (userRole === "ADMIN") {
              router.push("/admin/jobs");
            } else if (userRole === "DIRECTOR") {
              router.push("/director/dashboard");
            } else if (userRole === "TALENT") {
              router.push("/talent/dashboard");
            } else {
              router.push("/");
            }
          } else {
            router.push("/");
          }
          router.refresh();
        } catch (sessionError) {
          // If session fetch fails, redirect to home
          router.push("/");
          router.refresh();
        }
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-3xl font-heading text-white mb-2">Sign In</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Enter your email and password
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-white/5 border border-red-500/30 rounded text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-2 font-body">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded text-white placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-gold)]/50 font-body"
            />
          </div>

          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-2 font-body">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded text-white placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-gold)]/50 font-body"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-white transition"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-[var(--accent-gold)] text-black font-medium rounded hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed font-body"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-[var(--text-secondary)]">
            Don't have an account?{" "}
            <Link href="/signup" className="text-[var(--accent-gold)] hover:underline font-body">
              Sign Up
            </Link>
          </p>
          <button
            onClick={() => router.push("/auth/forgot-password")}
            className="block w-full text-sm text-[var(--text-secondary)] hover:text-white transition font-body"
          >
            Forgot Password?
          </button>
          <button
            onClick={() => router.push("/auth")}
            className="block w-full text-sm text-[var(--text-secondary)] hover:text-white transition font-body"
          >
            ← Back to start
          </button>
        </div>
      </motion.div>
    </div>
  );
}
