"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Copy, History, Loader2, QrCode } from "lucide-react";

type AccessPassType = "visitor" | "service";
type AccessPassStatus = "active" | "revoked" | "expired" | "used_up";

type AccessPass = {
  id: string;
  community_id: string;
  type: AccessPassType;
  label: string;
  token: string;
  status: AccessPassStatus;
  effective_status: AccessPassStatus;
  valid_from: string;
  valid_until: string;
  max_uses: number;
  used_count: number;
  created_at: string;
  qr_image_url: string;
};

const defaultCommunityId = process.env.NEXT_PUBLIC_DEFAULT_COMMUNITY_ID ?? "";

function statusStyle(status: AccessPassStatus) {
  if (status === "active") return "bg-green-50 text-green-700";
  if (status === "revoked") return "bg-red-50 text-red-700";
  if (status === "used_up") return "bg-amber-50 text-amber-700";
  return "bg-slate-100 text-slate-600";
}

export default function AccessPassesPage() {
  const [passType, setPassType] = useState<AccessPassType>("visitor");
  const [label, setLabel] = useState("");
  const [communityId, setCommunityId] = useState(defaultCommunityId);
  const [validHours, setValidHours] = useState(2);
  const [maxUses, setMaxUses] = useState(1);

  const [creating, setCreating] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdPass, setCreatedPass] = useState<AccessPass | null>(null);
  const [history, setHistory] = useState<AccessPass[]>([]);

  const canCreate = useMemo(() => {
    return communityId.length > 0 && label.trim().length > 1;
  }, [communityId, label]);

  const loadHistory = useCallback(async () => {
    if (!communityId) return;
    setLoadingHistory(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/access/passes?community_id=${encodeURIComponent(communityId)}&limit=20`,
        { method: "GET", cache: "no-store" }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error ?? "No se pudo cargar el historial");
      setHistory(data.passes ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo cargar el historial");
    } finally {
      setLoadingHistory(false);
    }
  }, [communityId]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  async function createPass() {
    if (!canCreate) return;
    setCreating(true);
    setError(null);
    try {
      const response = await fetch("/api/access/passes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          community_id: communityId,
          type: passType,
          label: label.trim(),
          valid_hours: validHours,
          max_uses: maxUses,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error ?? "No se pudo generar el pase");
      setCreatedPass(data.pass as AccessPass);
      setLabel("");
      await loadHistory();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo generar el pase");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Pases</p>
          <h1 className="text-xl font-bold text-[var(--foreground)]">Generador QR de accesos</h1>
        </div>
        <button
          type="button"
          onClick={() => void loadHistory()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)]"
        >
          <History size={16} />
          Historial
        </button>
      </header>

      <div className="rounded-xl bg-slate-50 p-1.5 flex">
        <button
          type="button"
          onClick={() => setPassType("visitor")}
          className={`flex-1 rounded-lg py-3 text-xs font-bold transition-all ${
            passType === "visitor" ? "bg-white text-[var(--primary)] shadow-sm" : "text-[var(--muted)]"
          }`}
        >
          Invitado
        </button>
        <button
          type="button"
          onClick={() => setPassType("service")}
          className={`flex-1 rounded-lg py-3 text-xs font-bold transition-all ${
            passType === "service" ? "bg-white text-[var(--primary)] shadow-sm" : "text-[var(--muted)]"
          }`}
        >
          Servicio
        </button>
      </div>

      <section className="card space-y-4 p-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
            Community ID
          </label>
          <input
            value={communityId}
            onChange={(event) => setCommunityId(event.target.value)}
            placeholder="UUID de comunidad"
            className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm focus:border-[var(--primary)] focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
            {passType === "visitor" ? "Nombre del invitado" : "Tipo de servicio"}
          </label>
          <input
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder={passType === "visitor" ? "Ej. Juan Perez" : "Ej. Plomeria"}
            className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm focus:border-[var(--primary)] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
              Validez (horas)
            </label>
            <input
              type="number"
              min={1}
              max={168}
              value={validHours}
              onChange={(event) => setValidHours(Number(event.target.value || 1))}
              className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm focus:border-[var(--primary)] focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
              Max usos
            </label>
            <input
              type="number"
              min={1}
              max={50}
              value={maxUses}
              onChange={(event) => setMaxUses(Number(event.target.value || 1))}
              className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm focus:border-[var(--primary)] focus:outline-none"
            />
          </div>
        </div>

        <button
          type="button"
          disabled={!canCreate || creating}
          onClick={() => void createPass()}
          className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white shadow ${
            canCreate ? "bg-[var(--primary)] hover:opacity-90" : "bg-slate-300"
          }`}
        >
          {creating ? <Loader2 size={16} className="animate-spin" /> : <QrCode size={16} />}
          Generar token y QR
        </button>

        {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
      </section>

      {createdPass ? (
        <section className="card space-y-3 p-4">
          <h2 className="text-base font-bold text-[var(--foreground)]">Ultimo pase generado</h2>
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-[var(--border)] px-4 py-5 text-center">
            <Image src={createdPass.qr_image_url}
              alt="QR de acceso"
              width={220}
              height={220}
              unoptimized
              className="rounded-xl border border-slate-200 bg-white p-2"
            />
            <p className="text-sm font-semibold text-[var(--foreground)]">{createdPass.label}</p>
            <p className="text-xs text-[var(--muted)]">
              Expira: {new Date(createdPass.valid_until).toLocaleString("es-MX")}
            </p>
            <button
              type="button"
              onClick={() => void navigator.clipboard.writeText(createdPass.token)}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--foreground)]"
            >
              <Copy size={14} />
              {createdPass.token}
            </button>
          </div>
        </section>
      ) : null}

      <section className="card space-y-3 p-4">
        <h2 className="text-base font-bold text-[var(--foreground)]">Historial reciente</h2>
        {loadingHistory ? (
          <p className="text-sm text-[var(--muted)]">Cargando historial...</p>
        ) : history.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">No hay pases registrados.</p>
        ) : (
          <div className="space-y-2">
            {history.map((item) => (
              <article
                key={item.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-[var(--border)] px-3 py-3"
              >
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[var(--foreground)]">{item.label}</p>
                  <p className="text-xs text-[var(--muted)]">
                    {item.type === "visitor" ? "Invitado" : "Servicio"} · expira{" "}
                    {new Date(item.valid_until).toLocaleString("es-MX")}
                  </p>
                  <p className="font-mono text-[11px] text-[var(--muted)]">{item.token}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${statusStyle(item.effective_status)}`}>
                  {item.effective_status}
                </span>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
