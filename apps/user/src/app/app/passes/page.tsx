"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Copy,
  Download,
  Eye,
  History,
  Loader2,
  QrCode,
  X,
} from "lucide-react";

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
  last_used_at: string | null;
  created_at: string;
  qr_image_url: string;
};

const defaultCommunityId = process.env.NEXT_PUBLIC_DEFAULT_COMMUNITY_ID ?? "";

function statusStyle(status: AccessPassStatus) {
  if (status === "active") return "bg-emerald-50 text-emerald-700";
  if (status === "revoked") return "bg-red-50 text-red-700";
  if (status === "used_up") return "bg-amber-50 text-amber-700";
  return "bg-slate-100 text-slate-600";
}

function statusLabel(status: AccessPassStatus) {
  if (status === "active") return "Activo";
  if (status === "revoked") return "Revocado";
  if (status === "used_up") return "Sin usos";
  return "Expirado";
}

function passTypeLabel(type: AccessPassType) {
  return type === "visitor" ? "Invitado" : "Servicio";
}

function parseApiError(errorPayload: unknown, fallback: string) {
  if (typeof errorPayload === "string" && errorPayload.trim()) return errorPayload;
  if (errorPayload && typeof errorPayload === "object") {
    const payload = errorPayload as {
      message?: unknown;
      formErrors?: unknown;
      fieldErrors?: unknown;
    };
    const maybeMessage = payload.message;
    if (typeof maybeMessage === "string" && maybeMessage.trim()) return maybeMessage;
    if (Array.isArray(payload.formErrors)) {
      const firstFormError = payload.formErrors.find(
        (item) => typeof item === "string" && item.trim()
      );
      if (typeof firstFormError === "string") return firstFormError;
    }
    if (payload.fieldErrors && typeof payload.fieldErrors === "object") {
      const firstFieldError = Object.values(payload.fieldErrors).find((item) =>
        Array.isArray(item) ? item.some((entry) => typeof entry === "string" && entry.trim()) : false
      );
      if (Array.isArray(firstFieldError)) {
        const firstEntry = firstFieldError.find(
          (entry) => typeof entry === "string" && entry.trim()
        );
        if (typeof firstEntry === "string") return firstEntry;
      }
    }
  }
  return fallback;
}

export default function AccessPassesPage() {
  const [passType, setPassType] = useState<AccessPassType>("visitor");
  const [label, setLabel] = useState("");
  const communityId = defaultCommunityId.trim();
  const [validHoursInput, setValidHoursInput] = useState("2");
  const [maxUsesInput, setMaxUsesInput] = useState("1");

  const [creating, setCreating] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdPass, setCreatedPass] = useState<AccessPass | null>(null);
  const [history, setHistory] = useState<AccessPass[]>([]);
  const [selectedPass, setSelectedPass] = useState<AccessPass | null>(null);

  const validHours = useMemo(() => {
    const value = Number(validHoursInput);
    if (!Number.isInteger(value)) return null;
    if (value < 1 || value > 168) return null;
    return value;
  }, [validHoursInput]);

  const maxUses = useMemo(() => {
    const value = Number(maxUsesInput);
    if (!Number.isInteger(value)) return null;
    if (value < 1 || value > 50) return null;
    return value;
  }, [maxUsesInput]);

  const canCreate = useMemo(() => {
    return communityId.length > 0 && label.trim().length > 1 && validHours !== null && maxUses !== null;
  }, [communityId, label, validHours, maxUses]);

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
      if (!response.ok) throw new Error(parseApiError(data?.error, "No se pudo cargar el historial"));
      setHistory((data.passes ?? []) as AccessPass[]);
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
    if (validHours === null || maxUses === null) {
      setError("Validez y max usos deben ser numeros validos.");
      return;
    }
    if (!communityId) {
      setError("Falta NEXT_PUBLIC_DEFAULT_COMMUNITY_ID en .env.local");
      return;
    }
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
      if (!response.ok) throw new Error(parseApiError(data?.error, "No se pudo generar el pase"));
      const pass = data.pass as AccessPass;
      setCreatedPass(pass);
      setLabel("");
      await loadHistory();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo generar el pase");
    } finally {
      setCreating(false);
    }
  }

  function copyToken(token: string) {
    void navigator.clipboard.writeText(token);
  }

  function downloadQr(pass: AccessPass) {
    const anchor = document.createElement("a");
    anchor.href = pass.qr_image_url;
    anchor.download = `acceso-${pass.token}.png`;
    anchor.click();
  }

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Pases</p>
          <h1 className="text-xl font-bold text-[var(--foreground)]">Generacion QR de acceso</h1>
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

      <section className="card space-y-4 p-4">
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

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
            {passType === "visitor" ? "Nombre del invitado" : "Tipo de servicio"}
          </label>
          <input
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder={passType === "visitor" ? "Ej. Juan Perez" : "Ej. Mantenimiento"}
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
              value={validHoursInput}
              onChange={(event) => setValidHoursInput(event.target.value)}
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
              value={maxUsesInput}
              onChange={(event) => setMaxUsesInput(event.target.value)}
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
      </section>

      {createdPass ? (
        <section className="card space-y-3 p-4">
          <h2 className="text-base font-bold text-[var(--foreground)]">Ultimo pase generado</h2>
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-[var(--border)] px-4 py-5 text-center">
            <Image
              src={createdPass.qr_image_url}
              alt="QR de acceso"
              width={220}
              height={220}
              unoptimized
              className="rounded-xl border border-slate-200 bg-white p-2"
            />
            <p className="text-sm font-semibold text-[var(--foreground)]">{createdPass.label}</p>
            <p className="text-xs text-[var(--muted)]">
              {passTypeLabel(createdPass.type)} ? usos {createdPass.used_count}/{createdPass.max_uses}
            </p>
            <p className="text-xs text-[var(--muted)]">
              Expira: {new Date(createdPass.valid_until).toLocaleString("es-MX")}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => copyToken(createdPass.token)}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--foreground)]"
              >
                <Copy size={14} />
                {createdPass.token}
              </button>
              <button
                type="button"
                onClick={() => downloadQr(createdPass)}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--primary)]"
              >
                <Download size={14} /> Descargar QR
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

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
                <div className="flex items-start gap-3">
                  <Image
                    src={item.qr_image_url}
                    alt={`QR ${item.label}`}
                    width={56}
                    height={56}
                    unoptimized
                    className="rounded-lg border border-slate-200 bg-white p-1"
                  />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-[var(--foreground)]">{item.label}</p>
                    <p className="text-xs text-[var(--muted)]">
                      {passTypeLabel(item.type)} ? expira {new Date(item.valid_until).toLocaleString("es-MX")}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      usos {item.used_count}/{item.max_uses}
                    </p>
                    <p className="font-mono text-[11px] text-[var(--muted)]">{item.token}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${statusStyle(item.effective_status)}`}>
                    {statusLabel(item.effective_status)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedPass(item)}
                    className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-2.5 py-1 text-xs font-semibold text-[var(--foreground)]"
                  >
                    <Eye size={13} /> Ver QR
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {selectedPass ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
          <div className="card w-full max-w-sm space-y-3 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-[var(--foreground)]">{selectedPass.label}</p>
                <p className="text-xs text-[var(--muted)]">{passTypeLabel(selectedPass.type)}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPass(null)}
                className="rounded-full bg-slate-100 p-1.5 text-slate-600"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex justify-center">
              <Image
                src={selectedPass.qr_image_url}
                alt="QR seleccionado"
                width={260}
                height={260}
                unoptimized
                className="rounded-xl border border-slate-200 bg-white p-2"
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => copyToken(selectedPass.token)}
                className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--foreground)]"
              >
                <Copy size={13} /> Copiar token
              </button>
              <button
                type="button"
                onClick={() => downloadQr(selectedPass)}
                className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-white"
              >
                <Download size={13} /> Descargar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
