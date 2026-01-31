"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type PaymentRecord = {
  _id: string;
  email: string;
  name?: string;
  paymentMethod: string;
  paymentReference?: string;
  paymentAt: string;
  createdAt: string;
  auditLogs: Array<{
    _id: string;
    reason?: string;
    createdAt: string;
  }>;
};

type PaginationInfo = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

type Filters = {
  method: string | null;
  email: string | null;
  startDate: string | null;
  endDate: string | null;
};

export default function PaymentHistoryPage() {
  const [records, setRecords] = useState<PaymentRecord[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState<Filters>({
    method: null,
    email: null,
    startDate: null,
    endDate: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, [pagination.page, filters]);

  async function fetchHistory() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("page", pagination.page.toString());
      params.set("limit", pagination.limit.toString());
      if (filters.method) params.set("method", filters.method);
      if (filters.email) params.set("email", filters.email);
      if (filters.startDate) params.set("startDate", filters.startDate);
      if (filters.endDate) params.set("endDate", filters.endDate);

      const res = await fetch(`/api/admin/payments/history?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setRecords(data.users || []);
        setPagination(data.pagination || pagination);
      } else {
        setError("Failed to fetch payment history");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleFilterChange(key: keyof Filters, value: string) {
    setFilters({ ...filters, [key]: value || null });
    setPagination({ ...pagination, page: 1 });
  }

  async function exportToCSV() {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      params.set("page", "1");
      params.set("limit", "10000");
      if (filters.method) params.set("method", filters.method);
      if (filters.email) params.set("email", filters.email);
      if (filters.startDate) params.set("startDate", filters.startDate);
      if (filters.endDate) params.set("endDate", filters.endDate);

      const res = await fetch(`/api/admin/payments/history?${params.toString()}`);
      const data = await res.json();
      const users = data.users || [];

      // Build CSV
      const headers = [
        "Email",
        "Name",
        "Payment Method",
        "Transaction Reference",
        "Payment Date",
        "Registered Date",
      ];
      const rows = users.map((u: PaymentRecord) => [
        u.email,
        u.name || "",
        u.paymentMethod || "",
        u.paymentReference || "",
        new Date(u.paymentAt).toLocaleDateString(),
        new Date(u.createdAt).toLocaleDateString(),
      ]);

      const csv = [
        headers.join(","),
        ...rows.map((row: (string | null)[]) =>
          row
            .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
            .join(",")
        ),
      ].join("\n");

      // Download
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payment-history-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to export CSV");
    } finally {
      setExporting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-(--bg-main) flex items-center justify-center">
        <p className="text-(--text-secondary)">Loading payment history...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--bg-main) p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-heading text-white">Payment History</h1>
          <div className="flex gap-2">
            <button
              onClick={exportToCSV}
              disabled={exporting || records.length === 0}
              className="px-4 py-2 border border-white/20 text-white rounded hover:bg-white/10 disabled:opacity-50 transition"
            >
              {exporting ? "Exporting..." : "↓ Export CSV"}
            </button>
            <Link
              href="/admin/payments"
              className="px-4 py-2 border border-white/20 text-white rounded hover:bg-white/10 transition"
            >
              ← Back
            </Link>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500/20 rounded text-red-400">{error}</div>
        )}

        {/* Filters */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h2 className="text-lg text-white mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-(--text-secondary) mb-2">
                Payment Method
              </label>
              <select
                value={filters.method || ""}
                onChange={(e) => handleFilterChange("method", e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white"
              >
                <option value="">All Methods</option>
                <option value="ETH">Ethereum (ETH)</option>
                <option value="BTC">Bitcoin (BTC)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="Search email..."
                value={filters.email || ""}
                onChange={(e) => handleFilterChange("email", e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white placeholder:text-white/30"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate || ""}
                onChange={(e) => handleFilterChange("startDate", e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-2">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate || ""}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h2 className="text-xl text-white mb-4">
            Confirmed Payments
            {pagination.total > 0 && (
              <span className="text-sm text-[var(--text-secondary)] ml-2">
                ({pagination.total} total)
              </span>
            )}
          </h2>

          {records.length === 0 ? (
            <p className="text-[var(--text-secondary)]">No payment records found.</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-3 text-[var(--text-secondary)]">
                        Email
                      </th>
                      <th className="text-left py-3 px-3 text-[var(--text-secondary)]">
                        Name
                      </th>
                      <th className="text-left py-3 px-3 text-[var(--text-secondary)]">
                        Method
                      </th>
                      <th className="text-left py-3 px-3 text-[var(--text-secondary)]">
                        Transaction
                      </th>
                      <th className="text-left py-3 px-3 text-[var(--text-secondary)]">
                        Payment Date
                      </th>
                      <th className="text-left py-3 px-3 text-[var(--text-secondary)]">
                        Registered
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((r) => (
                      <tr key={r._id} className="border-b border-white/5 hover:bg-white/3">
                        <td className="py-3 px-3 text-white">{r.email}</td>
                        <td className="py-3 px-3 text-white">{r.name || "—"}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              r.paymentMethod === "ETH"
                                ? "bg-orange-500/20 text-orange-300"
                                : "bg-gray-500/20 text-gray-300"
                            }`}
                          >
                            {r.paymentMethod}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-white/60 font-mono text-xs">
                          {r.paymentReference?.substring(0, 16) || "—"}
                          {r.paymentReference && r.paymentReference.length > 16
                            ? "..."
                            : ""}
                        </td>
                        <td className="py-3 px-3 text-white">
                          {new Date(r.paymentAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-3 text-[var(--text-secondary)]">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
