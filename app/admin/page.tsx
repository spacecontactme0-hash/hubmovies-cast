"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      router.push("/auth");
      return;
    }

    const user = session.user as any;
    if (user.role !== "ADMIN") {
      router.push("/");
      return;
    }
  }, [router, session, status]);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-heading text-white">Admin Dashboard</h1>
          <div className="flex gap-2">
            <Link href="/" className="px-4 py-2 border border-white/20 text-white rounded hover:bg-white/10 transition">Home</Link>
          </div>
        </div>

        <p className="text-[var(--text-secondary)]">Quick links to all admin sections. Click a card to manage that area.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <Link href="/admin/jobs" className="block p-6 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition">
            <h3 className="text-xl text-white font-medium">Job Management</h3>
            <p className="text-(--text-secondary) mt-2">Create, edit and manage job postings and applications.</p>
          </Link>

          <Link href="/admin/users" className="block p-6 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition">
            <h3 className="text-xl text-white font-medium">User Management</h3>
            <p className="text-(--text-secondary) mt-2">Search users, view profiles, freeze/unfreeze accounts and confirm payments.</p>
          </Link>

          <Link href="/admin/payments" className="block p-6 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition">
            <h3 className="text-xl text-white font-medium">Payments & Pricing</h3>
            <p className="text-(--text-secondary) mt-2">Set registration price, add crypto addresses and confirm pending payments.</p>
          </Link>

          <Link href="/admin/payments/history" className="block p-6 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition">
            <h3 className="text-xl text-white font-medium">Payment History</h3>
            <p className="text-(--text-secondary) mt-2">View full payment history, filter and export records.</p>
          </Link>

          <Link href="/admin/setup" className="block p-6 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition">
            <h3 className="text-xl text-white font-medium">Setup / Admin</h3>
            <p className="text-(--text-secondary) mt-2">Create or update admin users and initial setup utilities.</p>
          </Link>

          <Link href="/admin/trust/talent" className="block p-6 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition">
            <h3 className="text-xl text-white font-medium">Trust & Verification</h3>
            <p className="text-(--text-secondary) mt-2">Review talent and director trust/verification cases.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

