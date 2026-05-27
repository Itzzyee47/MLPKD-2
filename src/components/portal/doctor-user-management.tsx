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

export default function DoctorUserManagement() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadUsers() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/doctor/users", { method: "GET" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Failed to load users");
      setUsers((json?.users ?? []) as Profile[]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load users";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Load on mount (avoid lint rule about cascading renders by not calling a bare stateful async directly)
    void (async () => {
      await loadUsers();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);




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
      await loadUsers();
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
          <h2>Medical Personnel Accounts</h2>
        </div>
      </div>

      {loading && <p className="form-message">Loading users...</p>}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 animate-rise">
          {error}
        </div>
      )}

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
                  <td colSpan={4} className="px-3 py-4">
                    No users found.
                  </td>
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
                    <td className="px-3 py-2">{u.role}</td>
                    <td className="px-3 py-2 text-xs text-[--color-muted]">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-3 py-2">
                      <button
                        className="btn-danger"
                        type="button"
                        disabled={deletingId === u.id}
                        onClick={() => deleteUser(u.id)}
                      >
                        {deletingId === u.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

