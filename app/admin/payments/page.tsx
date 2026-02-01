"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type PendingUser = {
  _id: string;
  email: string;
  name?: string;
  frozen: boolean;
  paymentConfirmed: boolean;
  createdAt: string;
};

type PaginationInfo = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export default function AdminPaymentsPage() {
  const [ethAddress, setEthAddress] = useState("");
  const [btcAddress, setBtcAddress] = useState("");
  const [ethPrice, setEthPrice] = useState("");
  const [btcPrice, setBtcPrice] = useState("");
  const [registrationPrice, setRegistrationPrice] = useState("300");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [bulkConfirming, setBulkConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [pagination.page]);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const [sRes, uRes] = await Promise.all([
        fetch("/api/admin/payment"),
        fetch(
          `/api/admin/users/awaiting-payment?page=${pagination.page}&limit=${pagination.limit}`
        ),
      ]);

      if (sRes.ok) {
        const sd = await sRes.json();
        const settings = sd.settings;
        if (settings) {
          setEthAddress(settings.ethAddress || "");
          setBtcAddress(settings.btcAddress || "");
          setEthPrice(settings.ethPrice ? settings.ethPrice.toString() : "");
          setBtcPrice(settings.btcPrice ? settings.btcPrice.toString() : "");
          setRegistrationPrice(settings.registrationPrice ? settings.registrationPrice.toString() : "300");
        }
      }

      if (uRes.ok) {
        const ud = await uRes.json();
        setUsers(ud.users || []);
        setPagination(ud.pagination || pagination);
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function saveAddresses() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ethAddress: ethAddress || null,
          btcAddress: btcAddress || null,
          ethPrice: ethPrice ? parseFloat(ethPrice) : null,
          btcPrice: btcPrice ? parseFloat(btcPrice) : null,
          registrationPrice: registrationPrice ? parseFloat(registrationPrice) : 300,
        }),
      });
      if (res.ok) {
        alert("Payment settings saved successfully.");
      } else {
        const d = await res.json();
        alert(d.error || "Failed to save");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function confirmPayment(userId: string) {
    const method = prompt("Enter payment method to confirm (ETH or BTC):");
    if (!method) return;
    const m = method.toUpperCase().trim();
    if (m !== "ETH" && m !== "BTC") {
      alert("Invalid method. Use ETH or BTC.");
      return;
    }
    const reference = prompt("Enter transaction reference (optional):");
    const reason = prompt("Optional note/reason for audit log:");

    try {
      const res = await fetch(`/api/admin/users/${userId}/confirm-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method: m, reference, reason }),
      });
      if (res.ok) {
        alert("Payment confirmed and user unlocked.");
        fetchData();
      } else {
        const d = await res.json();
        alert(d.error || "Failed to confirm payment");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    }
  }

  async function handleBulkConfirm() {
    if (selectedUsers.size === 0) {
      alert("No users selected.");
      return;
    }

    const method = prompt(
      `Confirm ${selectedUsers.size} payment(s). Enter method (ETH or BTC):`
    );
    if (!method) return;

    const m = method.toUpperCase().trim();
    if (m !== "ETH" && m !== "BTC") {
      alert("Invalid method. Use ETH or BTC.");
      return;
    }

    const reason = prompt(
      "Optional note/reason for audit log (applies to all):"
    );

    setBulkConfirming(true);
    try {
      const res = await fetch("/api/admin/users/bulk-confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userIds: Array.from(selectedUsers),
          method: m,
          reason,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        alert(
          `Successfully confirmed ${data.confirmed} payment(s). Users unlocked.`
        );
        setSelectedUsers(new Set());
        fetchData();
      } else {
        const d = await res.json();
        alert(d.error || "Failed to confirm payments");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    } finally {
      setBulkConfirming(false);
    }
  }

  function toggleUser(userId: string) {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  }

  function toggleAllUsers() {
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(users.map((u) => u._id)));
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-(--bg-main) flex items-center justify-center">
        <p className="text-(--text-secondary)">Loading payment settings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-4xl font-heading text-white">Admin: Payments</h1>
          <div className="flex gap-2">
            <Link
              href="/admin/payments/history"
              className="px-4 py-2 border border-white/20 text-white rounded hover:bg-white/10 transition"
            >
              View History →
            </Link>
            <Link
              href="/admin"
              className="px-4 py-2 border border-white/20 text-white rounded hover:bg-white/10 transition"
            >
              ← Back to Admin
            </Link>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500/20 rounded text-red-400">{error}</div>
        )}

        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h2 className="text-xl text-white mb-3">Payment Settings</h2>
          <div className="space-y-3">
            {/* Crypto Addresses Section */}
            <div className="border-b border-white/10 pb-4 mb-4">
              <h3 className="text-sm text-[var(--accent-gold)] font-medium mb-3">Cryptocurrency Addresses</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-[var(--text-secondary)] mb-1">
                    Ethereum (ETH) Address
                  </label>
                  <input
                    value={ethAddress}
                    onChange={(e) => setEthAddress(e.target.value)}
                    placeholder="0x..."
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white placeholder:text-white/30"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[var(--text-secondary)] mb-1">
                    Bitcoin (BTC) Address
                  </label>
                  <input
                    value={btcAddress}
                    onChange={(e) => setBtcAddress(e.target.value)}
                    placeholder="bc1q..."
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white placeholder:text-white/30"
                  />
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="border-b border-white/10 pb-4 mb-4">
              <h3 className="text-sm text-[var(--accent-gold)] font-medium mb-3">Pricing (in USD)</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-[var(--text-secondary)] mb-1">
                    Registration Price (USD)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-white">$</span>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      value={registrationPrice}
                      onChange={(e) => setRegistrationPrice(e.target.value)}
                      placeholder="300"
                      className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded text-white"
                    />
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">Default amount talents must pay to register</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-[var(--text-secondary)] mb-1">
                      ETH Price Equivalent (USD)
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-white">$</span>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={ethPrice}
                        onChange={(e) => setEthPrice(e.target.value)}
                        placeholder="Optional"
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm"
                      />
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">Amount in USD that equals registration price</p>
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--text-secondary)] mb-1">
                      BTC Price Equivalent (USD)
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-white">$</span>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={btcPrice}
                        onChange={(e) => setBtcPrice(e.target.value)}
                        placeholder="Optional"
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm"
                      />
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">Amount in USD that equals registration price</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={saveAddresses}
                disabled={saving}
                className="px-4 py-2 bg-(--accent-gold) text-black rounded font-medium hover:bg-[#d4b364] disabled:opacity-50 transition"
              >
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl text-white">
              Users Awaiting Payment Confirmation
              {pagination.total > 0 && (
                <span className="text-sm text-[var(--text-secondary)] ml-2">
                  ({pagination.total} total)
                </span>
              )}
            </h2>
            {selectedUsers.size > 0 && (
              <div className="flex gap-2">
                <span className="text-[var(--text-secondary)] text-sm">
                  {selectedUsers.size} selected
                </span>
                <button
                  onClick={handleBulkConfirm}
                  disabled={bulkConfirming}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {bulkConfirming ? "Confirming..." : "Confirm Selected"}
                </button>
              </div>
            )}
          </div>

          {users.length === 0 ? (
            <p className="text-[var(--text-secondary)]">
              No users awaiting payment confirmation.
            </p>
          ) : (
            <>
              <div className="space-y-3">
                {/* Select All Row */}
                <div className="flex items-center gap-3 bg-white/3 p-3 rounded">
                  <input
                    type="checkbox"
                    checked={selectedUsers.size === users.length && users.length > 0}
                    onChange={toggleAllUsers}
                    className="w-5 h-5 rounded"
                  />
                  <span className="text-sm text-[var(--text-secondary)]">
                    {selectedUsers.size === users.length && users.length > 0
                      ? "Deselect all"
                      : "Select all on this page"}
                  </span>
                </div>

                {/* User Rows */}
                {users.map((u) => (
                  <div
                    key={u._id}
                    className="flex items-center justify-between bg-white/3 p-3 rounded hover:bg-white/5 transition"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedUsers.has(u._id)}
                        onChange={() => toggleUser(u._id)}
                        className="w-5 h-5 rounded"
                      />
                      <div className="flex-1">
                        <div className="text-white font-medium">
                          {u.name || u.email}
                        </div>
                        <div className="text-sm text-[var(--text-secondary)]">
                          {u.email} • Registered{" "}
                          {new Date(u.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => confirmPayment(u._id)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
                    >
                      Confirm
                    </button>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                  <div className="text-sm text-[var(--text-secondary)]">
                    Page {pagination.page} of {pagination.pages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setPagination({ ...pagination, page: pagination.page - 1 })
                      }
                      disabled={pagination.page === 1}
                      className="px-3 py-1 border border-white/20 text-white rounded hover:bg-white/10 disabled:opacity-50"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={() =>
                        setPagination({ ...pagination, page: pagination.page + 1 })
                      }
                      disabled={pagination.page >= pagination.pages}
                      className="px-3 py-1 border border-white/20 text-white rounded hover:bg-white/10 disabled:opacity-50"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
