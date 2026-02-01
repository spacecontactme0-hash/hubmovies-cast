"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function EmailClient() {
  const searchParams = useSearchParams();
  const queryEmail = (searchParams.get("email") || "").toLowerCase();
  const [email, setEmail] = useState(queryEmail || "");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (queryEmail) setStatus("OTP sent. Check your email.");
  }, [queryEmail]);

  const sendOtp = async () => {
    if (!email) return setStatus("Enter an email first");
    setLoading(true);
    setStatus("");
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus('OTP sent. Please check your email.');
      } else {
        const err = await res.json();
        setStatus(err.error || 'Failed to send OTP');
      }
    } catch (err) {
      console.error('Failed to send OTP:', err);
      setStatus('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    try {
      const result = await signIn('otp', { email, otp, redirect: false });
      if (result?.error) {
        setStatus('Invalid or expired code');
      } else if (result?.ok) {
        // Wait for session cookie and redirect based on role
        // A small reload to let session set is sufficient here
        window.location.href = '/';
      }
    } catch (err) {
      console.error('Failed to verify OTP:', err);
      setStatus('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--bg-main)">
      <div className="w-full max-w-md p-6">
        <h1 className="text-2xl text-white mb-4">Sign in with Code</h1>

        <p className="text-(--text-secondary) mb-4">Enter your email and we'll send a one-time code that you can paste here.</p>

        {status && <div className="mb-4 p-3 bg-white/5 border border-white/10 rounded text-sm text-(--text-secondary)">{status}</div>}

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-(--text-secondary) mb-2">Email</label>
            <input value={email} onChange={(e)=> setEmail(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded text-white" placeholder="you@example.com" />
            <div className="mt-2 flex gap-2">
              <button onClick={sendOtp} disabled={loading} className="px-4 py-2 bg-(--accent-gold) text-black rounded">{loading ? 'Sending...' : 'Send Code'}</button>
              <button onClick={()=>{ setOtp(''); setStatus(''); }} className="px-4 py-2 border border-white/10 text-(--text-secondary) rounded">Clear</button>
            </div>
          </div>

          <form onSubmit={verifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm text-(--text-secondary) mb-2">Enter Code</label>
              <input value={otp} onChange={(e)=> setOtp(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded text-white" placeholder="123456" />
            </div>

            <button type="submit" disabled={loading} className="w-full px-6 py-3 bg-(--accent-gold) text-black rounded">{loading ? 'Verifying...' : 'Verify Code'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}