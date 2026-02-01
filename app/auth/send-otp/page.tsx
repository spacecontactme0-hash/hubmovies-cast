"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SendOtpPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [stage, setStage] = useState<"enter" | "sent">("enter");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const sendOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");
    if (!email || !email.includes("@")) {
      setError("Enter a valid email");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        console.log("✅ OTP sent successfully", { email });
        setStage("sent");
      } else {
        const data = await res.json();
        console.error("❌ Failed to send OTP", { status: res.status, error: data?.error, email });
        setError(data?.error || "Failed to send OTP");
      }
    } catch (err) {
      console.error("❌ Error sending OTP:", err, { email });
      setError("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");
    if (!otp || otp.length < 4) {
      setError("Enter the OTP");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok && data?.redirect) {
        console.log("✅ OTP verified successfully, redirecting", { email, redirect: data.redirect });
        // Redirect user to sign-in flow (password page) preserving redirect
        window.location.href = data.redirect;
        return;
      } else if (res.ok) {
        console.log("✅ OTP verified successfully", { email });
        router.push("/auth/password?email=" + encodeURIComponent(email));
        return;
      } else {
        console.error("❌ OTP verification failed", { status: res.status, error: data?.error, email });
        setError(data?.error || "Invalid OTP");
      }
    } catch (err) {
      console.error("❌ Error verifying OTP:", err, { email, otp: otp.substring(0, 2) + "***" });
      setError("Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] p-6">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded p-6">
        <h1 className="text-2xl text-white mb-3">Verify your email (OTP)</h1>
        <p className="text-[var(--text-secondary)] text-sm mb-4">Enter your email to receive a 6-digit OTP.</p>

        {error && <div className="mb-3 text-sm text-red-400">{error}</div>}

        {stage === "enter" ? (
          <form onSubmit={sendOtp} className="space-y-3">
            <input
              className="w-full p-3 bg-white/5 border border-white/10 rounded text-white"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-[var(--accent-gold)] text-black rounded" disabled={loading}>
                Send OTP
              </button>
              <button type="button" onClick={() => router.push("/")} className="px-4 py-2 border rounded text-white">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={verifyOtp} className="space-y-3">
            <p className="text-sm text-[var(--text-secondary)]">We sent an OTP to <strong className="text-white">{email}</strong>. Enter it below.</p>
            <input
              className="w-full p-3 bg-white/5 border border-white/10 rounded text-white"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-[var(--accent-gold)] text-black rounded" disabled={loading}>
                Verify OTP
              </button>
              <button type="button" onClick={() => setStage("enter")} className="px-4 py-2 border rounded text-white">
                Resend / Change Email
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
