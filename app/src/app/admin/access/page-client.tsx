"use client";

import { useMemo, useState } from "react";
import { ShieldCheck, ShieldX } from "lucide-react";

type AccessPassType = "visitor" | "service";
type AccessPassStatus = "active" | "revoked" | "expired" | "used_up";

export type AdminAccessPass = {
  id: string;
  community_id: string;
  type: AccessPassType;
  label: string;
  token: string;
  status: AccessPassStatus;
  valid_from: string;
  valid_until: string;
  max_uses: number;
  used_count: number;
  last_used_at: string | null;
  created_at: string;
};

function statusStyle(status: AccessPassStatus) {
  if (status === "active") return "bg-green-50 text-green-700";
  if (status === "revoked") return "bg-red-50 text-red-700";
  if (status === "used_up") return "bg-amber-50 text-amber-700";
  return "bg-slate-100 text-slate-600";
}

function statusLabel(status: AccessPassStatus) {
  if (status === "active") return "Activo";
  if (status === "revoked") return "Revocado";
  if (status === "used_up") return "Usado";
  return "Expirado";
}

export function AdminAccessClient({ initialPasses }: { initialPasses: AdminAccessPass[] }) {
  const [passes, setPasses] = useState(initialPasses);
  const [statusFilter, setStatusFilter] = useState<"all" | AccessPassStatus>("all");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const now = Date.now();
  const mapped = useMemo(() => {
    return passes.map((item) => {
      const expired = item.status === "active" && new Date(item.valid_until).getTime() < now;
      const usedUp = item.status === "active" && item.used_count >= item.max_uses;
      const effectiveStatus: AccessPassStatus = expired ? "expired" : usedUp ? "used_up" : item.status;
      return { ...item, effectiveStatus };
    });
  }, [passes, now]);

  const filtered = useMemo(() => {
    return mapped.filter((item) => {
      const textMatch =
        item.label.toLowerCase().includes(search.toLowerCase()) ||
        item.token.toLowerCase().includes(search.toLowerCase());
      const statusMatch = statusFilter === "all" ? true : item.effectiveStatus === statusFilter;
      return textMatch && statusMatch;
    });
  }, [mapped, search, statusFilter]);

  const stats = useMemo(() => {
    const total = mapped.length;
    const active = mapped.filter((item) => item.effectiveStatus === "active").length;
    const expired = mapped.filter((item) => item.effectiveStatus === "expired").length;
    const revoked = mapped.filter((item) => item.effectiveStatus === "revoked").length;
    return { total, active, expired, revoked };
  }, [mapped]);

  async function updateStatus(id: string, status: "active" | "revoked") {
    setUpdatingId(id);
    setError(null);
    try {
      const response = await fetch(`/api/access/passes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error ?? "No se pudo actualizar el pase");
      setPasses((prev) => prev.map((item) => (item.id === id ? { ...item, status: data.pass.status } : item)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo actualizar el pase");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <section className="space-y-4">
      <header className="card space-y-3 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
          Admin · access
        </p>
        <h2 className="text-lg font-bold text-[var(--foreground)]">Control de accesos QR/token</h2>
        <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
          <Stat label="Total" value={stats.total} />
          <Stat label="Activos" value={stats.active} />
          <Stat label="Expirados" value={stats.expired} />
          <Stat label="Revocados" value={stats.revoked} />
        </div>
      </header>

      <div className="card grid gap-3 p-4 sm:grid-cols-3">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por nombre o token"
          className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:border-[var(--primary)] focus:outline-none sm:col-span-2"
        />
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as "all" | AccessPassStatus)}
          className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:border-[var(--primary)] focus:outline-none"
        >
          <option value="all">Todos</option>
          <option value="active">Activos</option>
          <option value="expired">Expirados</option>
          <option value="revoked">Revocados</option>
          <option value="used_up">Usados</option>
        </select>
      </div>

      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <article className="card p-4 text-sm text-[var(--muted)]">Sin registros para ese filtro.</article>
        ) : (
          filtered.map((item) => (
            <article key={item.id} className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-sm font-bold text-[var(--foreground)]">{item.label}</p>
                <p className="text-xs text-[var(--muted)]">
                  {item.type === "visitor" ? "Invitado" : "Servicio"} · comunidad {item.community_id}
                </p>
                <p className="font-mono text-[11px] text-[var(--muted)]">{item.token}</p>
                <p className="text-xs text-[var(--muted)]">
                  {new Date(item.valid_from).toLocaleString("es-MX")} - {new Date(item.valid_until).toLocaleString("es-MX")}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${statusStyle(item.effectiveStatus)}`}>
                  {statusLabel(item.effectiveStatus)}
                </span>

                {item.status === "active" ? (
                  <button
                    type="button"
                    disabled={updatingId === item.id}
                    onClick={() => void updateStatus(item.id, "revoked")}
                    className="inline-flex items-center gap-1 rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60"
                  >
                    <ShieldX size={14} />
                    Revocar
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={updatingId === item.id}
                    onClick={() => void updateStatus(item.id, "active")}
                    className="inline-flex items-center gap-1 rounded-full bg-[var(--primary)] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60"
                  >
                    <ShieldCheck size={14} />
                    Reactivar
                  </button>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-white px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">{label}</p>
      <p className="text-lg font-bold text-[var(--foreground)]">{value}</p>
    </div>
  );
}
