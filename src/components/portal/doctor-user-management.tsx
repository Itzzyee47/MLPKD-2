"use client";

import { useEffect, useState } from "react";

type Profile = {
  id: string;
  email?: string | null;
  username: string;
  full_name: string | null;
  role: string;
  created_at?: string | null;
};

type PredictionView = {
  id: string;
  created_at: string;
  risk_score: number;
  diagnosis: string;
  recommendation?: string;
};

const CACHE_KEY = "doctor_users_cache_v1";

function roleLabel(role: string) {
  if (role === "lab_tech") return "Lab Technician";
  if (role === "nurse") return "Nurse";
  if (role === "patient") return "Patient";
  return role;
}

export default function DoctorUserManagement() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [predictions, setPredictions] = useState<PredictionView[]>([]);
  const [predictionLoading, setPredictionLoading] = useState(false);

  async function loadUsers(forceRefresh = false) {
    setLoading(true);
    setError(null);

    if (!forceRefresh) {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as { users: Profile[]; timestamp: number };
        if (Array.isArray(parsed.users) && Date.now() - parsed.timestamp < 5 * 60 * 1000) {
          setUsers(parsed.users);
          setLoading(false);
          return;
        }
      }
    }

    try {
      const res = await fetch("/api/doctor/users", { method: "GET", cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Failed to load users");
      const list = (json?.users ?? []) as Profile[];
      setUsers(list);
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ users: list, timestamp: Date.now() }));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load users";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadUsers();
  }, []);

  async function loadPredictions(user: Profile) {
    setSelectedUser(user);
    setPredictionLoading(true);
    try {
      const res = await fetch(`/api/doctor/users?userId=${user.id}`, { method: "GET", cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Failed to load prediction data");
      setPredictions((json?.predictions ?? []) as PredictionView[]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load prediction data";
      setError(message);
      setPredictions([]);
    } finally {
      setPredictionLoading(false);
    }
  }

  async function deleteUser(id: string) {
    if (!confirm("Delete this account? This will remove both Auth user and profile.")) return;

    setDeletingId(id);
    try {
      const res = await fetch("/api/doctor/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Delete failed");
      const updated = users.filter((user) => user.id !== id);
      setUsers(updated);
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ users: updated, timestamp: Date.now() }));
      if (selectedUser?.id === id) {
        setSelectedUser(null);
        setPredictions([]);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Delete failed";
      setError(message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="health-panel">
      <div className="panel-heading">
        <div>
          <p>User Management</p>
          <h2>Medical Personnel & Patients</h2>
        </div>
        <button type="button" className="btn-primary" onClick={() => void loadUsers(true)}>
          Refresh users
        </button>
      </div>

      {loading && <p className="form-message">Loading users...</p>}
      {error && <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

      {!loading && !error && (
        <div className="overflow-auto">
          <table className="w-full text-left" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th className="px-3 py-2 text-xs text-[--color-muted]">User</th>
                <th className="px-3 py-2 text-xs text-[--color-muted]">Role</th>
                <th className="px-3 py-2 text-xs text-[--color-muted]">Created</th>
                <th className="px-3 py-2 text-xs text-[--color-muted]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-3 py-4">No users found.</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id}>
                    <td className="px-3 py-2">
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <strong>{u.full_name ?? u.username}</strong>
                        <span className="text-xs text-[--color-muted]">{u.email ?? u.username}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <span className={`rounded-full px-2 py-1 text-xs ${u.role === "nurse" ? "bg-blue-50 text-blue-700" : u.role === "lab_tech" ? "bg-purple-50 text-purple-700" : "bg-emerald-50 text-emerald-700"}`}>
                        {roleLabel(u.role)}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs text-[--color-muted]">{u.created_at ? new Date(u.created_at).toLocaleDateString() : "-"}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <button className="btn-primary" type="button" onClick={() => void loadPredictions(u)}>
                          View predictions
                        </button>
                        <button className="btn-danger" type="button" disabled={deletingId === u.id} onClick={() => void deleteUser(u.id)}>
                          {deletingId === u.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {selectedUser && (
        <div className="mt-4 rounded-xl border border-[rgba(10,138,116,0.2)] p-4">
          <h3 className="text-lg font-semibold text-[--color-primary]">
            {selectedUser.full_name ?? selectedUser.username} prediction records
          </h3>
          <p className="text-sm text-[--color-muted] mb-3">Role: {roleLabel(selectedUser.role)}</p>
          {predictionLoading ? (
            <p className="form-message">Loading prediction data...</p>
          ) : predictions.length === 0 ? (
            <p className="form-message">No prediction records found for this user.</p>
          ) : (
            <div className="space-y-2">
              {predictions.map((prediction) => (
                <div key={prediction.id} className="rounded-lg bg-[--color-bg] p-3">
                  <div className="flex justify-between items-center">
                    <strong>{prediction.diagnosis}</strong>
                    <span className="text-sm">Risk: {prediction.risk_score}%</span>
                  </div>
                  <p className="text-xs text-[--color-muted]">{new Date(prediction.created_at).toLocaleString()}</p>
                  <p className="text-sm">{prediction.recommendation ?? "No recommendation recorded."}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
