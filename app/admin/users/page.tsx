"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type AdminUser = {
  _id: string;
  email: string;
  name?: string;
  role: string;
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

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, limit: 20, total: 0, pages: 0 });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, roleFilter]);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/users?page=${pagination.page}&limit=${pagination.limit}&search=${encodeURIComponent(
          search
        )}&role=${encodeURIComponent(roleFilter)}`
      );
      if (res.ok) {
        const d = await res.json();
        setUsers(d.users || []);
        setPagination(d.pagination || pagination);
      } else {
        const d = await res.json();
        setError(d.error || "Failed to fetch users");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function freezeUser(id: string) {
    const reason = prompt("Enter reason for freezing this account (required):");
    if (!reason) return;
    try {
      const res = await fetch(`/api/admin/users/${id}/freeze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (res.ok) {
        alert("User frozen.");
        fetchData();
      } else {
        const d = await res.json();
        alert(d.error || "Failed to freeze user");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    }
  }

  async function unfreezeUser(id: string) {
    const reason = prompt("Enter reason for unfreezing this account (required):");
    if (!reason) return;
    try {
      const res = await fetch(`/api/admin/users/${id}/unfreeze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (res.ok) {
        alert("User unfrozen.");
        fetchData();
      } else {
        const d = await res.json();
        alert(d.error || "Failed to unfreeze user");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    }
  }

  // Change user role (Admin only)
  async function changeRole(id: string, newRole: string) {
    if (!newRole) return;
    if (!confirm(`Change role of this user to ${newRole}?`)) return;
    try {
      const res = await fetch(`/api/admin/users/${id}/role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        alert("Role updated.");
        fetchData();
      } else {
        const d = await res.json();
        alert(d.error || "Failed to change role");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    }
  }

  // View profile modal state & helpers
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileData, setProfileData] = useState<any | null>(null);

  async function openProfile(id: string) {
    setShowProfileModal(true);
    setProfileLoading(true);
    setProfileData(null);
    try {
      const res = await fetch(`/api/admin/users/${id}/profile`);
      if (res.ok) {
        const d = await res.json();
        setProfileData(d.user || null);
      } else {
        const d = await res.json();
        alert(d.error || "Failed to load profile");
        setShowProfileModal(false);
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
      setShowProfileModal(false);
    } finally {
      setProfileLoading(false);
    }
  }

  function closeProfileModal() {
    setShowProfileModal(false);
    setProfileData(null);
  }

  async function confirmPayment(id: string) {
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
      const res = await fetch(`/api/admin/users/${id}/confirm-payment`, {
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

  return (
    <div className="min-h-screen bg-(--bg-main) p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-heading text-white">Admin: Users</h1>
          <div className="flex gap-2">
            <Link href="/admin" className="px-4 py-2 border border-white/20 text-white rounded hover:bg-white/10 transition">
              ← Back to Admin
            </Link>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <div className="flex gap-3 mb-4">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by email or name"
              className="px-3 py-2 bg-white/5 border border-white/10 rounded text-white w-full"
            />
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-3 py-2 bg-white/5 border border-white/10 rounded text-white">
              <option value="">All roles</option>
              <option value="TALENT">Talent</option>
              <option value="DIRECTOR">Director</option>
              <option value="ADMIN">Admin</option>
            </select>
            <button onClick={() => { setPagination({ ...pagination, page: 1 }); fetchData(); }} className="px-4 py-2 bg-(--accent-gold) text-black rounded">Search</button>
          </div>

          {loading ? (
            <p className="text-(--text-secondary)">Loading users...</p>
          ) : error ? (
            <div className="p-3 bg-red-500/20 rounded text-red-400">{error}</div>
          ) : (
            <>
              <div className="space-y-2">
                {users.length === 0 ? (
                  <p className="text-(--text-secondary)">No users found.</p>
                ) : (
                  users.map((u) => (
                    <div key={u._id} className="flex items-center justify-between bg-white/3 p-3 rounded">
                      <div>
                        <div className="text-white font-medium">{u.name || u.email}</div>
                        <div className="text-sm text-(--text-secondary)">{u.email} • {u.role} • Registered {new Date(u.createdAt).toLocaleDateString()}</div>
                      </div>

                      <div className="flex gap-2 items-center">
                        {/* Role selector */}
                        <select
                          value={u.role}
                          onChange={(e) => changeRole(u._id, e.target.value)}
                          className="px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm"
                        >
                          <option value="TALENT">Talent</option>
                          <option value="DIRECTOR">Director</option>
                          <option value="ADMIN">Admin</option>
                        </select>

                        <button onClick={() => openProfile(u._id)} className="px-3 py-1 border border-white/20 text-white rounded hover:bg-white/10">View</button>

                        {!u.frozen ? (
                          <button onClick={() => freezeUser(u._id)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Freeze</button>
                        ) : (
                          <button onClick={() => unfreezeUser(u._id)} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">Unfreeze</button>
                        )}

                        {!u.paymentConfirmed && (
                          <button onClick={() => confirmPayment(u._id)} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Confirm Payment</button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                  <div className="text-sm text-(--text-secondary)">Page {pagination.page} of {pagination.pages}</div>
                  <div className="flex gap-2">
                    <button onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })} disabled={pagination.page === 1} className="px-3 py-1 border border-white/20 text-white rounded hover:bg-white/10 disabled:opacity-50">← Previous</button>
                    <button onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })} disabled={pagination.page >= pagination.pages} className="px-3 py-1 border border-white/20 text-white rounded hover:bg-white/10 disabled:opacity-50">Next →</button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Profile Modal */}
          {showProfileModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="bg-(--bg-main) p-6 rounded-lg w-full max-w-2xl border border-white/10">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl text-white mb-2">{profileData?.name || profileData?.email || "Profile"}</h2>
                  <button onClick={closeProfileModal} className="text-(--text-secondary)">Close</button>
                </div>

                {profileLoading ? (
                  <p className="text-(--text-secondary)">Loading...</p>
                ) : profileData ? (
                  <div className="space-y-3 text-sm text-(--text-secondary)">
                    <div>Email: <span className="text-white">{profileData.email}</span></div>
                    <div>Role: <span className="text-white">{profileData.role}</span></div>
                    <div>Phone: <span className="text-white">{profileData.phone || '-'}</span></div>
                    <div>Bio: <span className="text-white">{profileData.bio || '-'}</span></div>
                    <div>Verification: <span className="text-white">{profileData.verificationData ? JSON.stringify(profileData.verificationData) : '-'}</span></div>
                    <div>Registered: <span className="text-white">{new Date(profileData.createdAt).toLocaleString()}</span></div>

                    <div className="flex gap-2 mt-4">
                      <select value={profileData.role} onChange={(e) => { if (confirm(`Change role to ${e.target.value}?`)) { changeRole(profileData._id, e.target.value); setProfileData({...profileData, role: e.target.value}); } }} className="px-3 py-1 bg-white/5 border border-white/10 rounded text-white text-sm">
                        <option value="TALENT">Talent</option>
                        <option value="DIRECTOR">Director</option>
                        <option value="ADMIN">Admin</option>
                      </select>

                      {!profileData.frozen ? (
                        <button onClick={() => { if (confirm('Freeze this user?')) { freezeUser(profileData._id); closeProfileModal(); } }} className="px-3 py-1 bg-red-600 text-white rounded">Freeze</button>
                      ) : (
                        <button onClick={() => { if (confirm('Unfreeze this user?')) { unfreezeUser(profileData._id); closeProfileModal(); } }} className="px-3 py-1 bg-green-600 text-white rounded">Unfreeze</button>
                      )}

                      {!profileData.paymentConfirmed && (
                        <button onClick={() => { confirmPayment(profileData._id); closeProfileModal(); }} className="px-3 py-1 bg-blue-600 text-white rounded">Confirm Payment</button>
                      )}

                      <button onClick={closeProfileModal} className="px-3 py-1 border border-white/20 rounded text-(--text-secondary)">Close</button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
