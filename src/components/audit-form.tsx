"use client"

import { useState } from "react";
import AuditReport, { AuditData } from "./audit-report";

export default function AuditForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<AuditData | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setError(result.error?.message || "Something went wrong.");
        return;
      }
      setReport(result.data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto relative">
      {loading && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 backdrop-blur-sm px-4"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white px-5 py-4 text-slate-900 shadow-2xl">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
            <span className="text-sm font-medium">Fetching audit data...</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2" aria-busy={loading}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="flex-1 border rounded-lg px-4 py-2"
          required
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-5 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "Auditing..." : "Audit URL"}
        </button>
      </form>

      {error && (
        <p className="mt-4 text-red-600 text-sm border border-red-200 bg-red-50 rounded-lg p-3">
          {error}
        </p>
      )}

      {report && <AuditReport data={report} />}
    </div>
  );
}
