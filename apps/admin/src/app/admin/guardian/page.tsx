"use client";

import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";
import { CheckCircle2, CircleAlert, Loader2, RotateCcw, ScanLine } from "lucide-react";

type AccessPassType = "visitor" | "service";
type AccessPassStatus = "active" | "revoked" | "expired" | "used_up";
type VerifyStatus = AccessPassStatus | "invalid";

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

type VerifyResult = {
  valid: boolean;
  status: VerifyStatus;
  message: string;
  pass: AccessPass | null;
};

function passTypeLabel(type: AccessPassType) {
  return type === "visitor" ? "Invitado" : "Servicio";
}

function parseApiError(errorPayload: unknown, fallback: string) {
  if (typeof errorPayload === "string" && errorPayload.trim()) return errorPayload;

  if (errorPayload && typeof errorPayload === "object") {
    const asRecord = errorPayload as Record<string, unknown>;
    const maybeMessage = asRecord.message;
    if (typeof maybeMessage === "string" && maybeMessage.trim()) return maybeMessage;

    const formErrors = asRecord.formErrors;
    if (Array.isArray(formErrors)) {
      const first = formErrors.find((item) => typeof item === "string" && item.trim());
      if (typeof first === "string") return first;
    }
  }

  return fallback;
}

function statusBadge(status: VerifyStatus) {
  if (status === "active") return "bg-emerald-50 text-emerald-700";
  if (status === "invalid") return "bg-red-50 text-red-700";
  if (status === "revoked") return "bg-red-50 text-red-700";
  if (status === "used_up") return "bg-amber-50 text-amber-700";
  return "bg-slate-100 text-slate-600";
}

function statusLabel(status: VerifyStatus) {
  if (status === "active") return "Acceso permitido";
  if (status === "invalid") return "Token invalido";
  if (status === "revoked") return "Pase revocado";
  if (status === "used_up") return "Sin usos";
  return "Expirado";
}

export default function GuardianPage() {
  const [token, setToken] = useState("");
  const [consume, setConsume] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VerifyResult | null>(null);

  const normalizedToken = useMemo(() => token.trim().toUpperCase(), [token]);
  const canValidate = normalizedToken.length >= 6;

  async function onValidate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canValidate) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/access/passes/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: normalizedToken, consume }),
      });
      const data = (await response.json()) as VerifyResult & { error?: unknown };

      if (!response.ok) {
        throw new Error(parseApiError(data.error, "No se pudo validar el pase"));
      }

      setResult(data);
    } catch (validationError) {
      setResult(null);
      setError(
        validationError instanceof Error ? validationError.message : "No se pudo validar el pase"
      );
    } finally {
      setLoading(false);
    }
  }

  function onReset() {
    setToken("");
    setError(null);
    setResult(null);
  }

  return (
    <section className="space-y-4">
      <header className="card space-y-2 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
          Guardia de caseta
        </p>
        <h2 className="text-lg font-bold text-[var(--foreground)]">Validacion de entrada por QR o token</h2>
        <p className="text-sm text-[var(--muted)]">
          Escanea o pega el token del pase para autorizar o rechazar el acceso en porteria.
        </p>
      </header>

      <form onSubmit={onValidate} className="card space-y-4 p-5">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
            Token del pase
          </label>
          <input
            value={token}
            onChange={(event) => setToken(event.target.value.toUpperCase())}
            placeholder="Ej. INV-ABC123..."
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:border-[var(--primary)] focus:outline-none"
          />
        </div>

        <label className="inline-flex items-center gap-2 text-sm text-[var(--foreground)]">
          <input
            type="checkbox"
            checked={consume}
            onChange={(event) => setConsume(event.target.checked)}
            className="h-4 w-4 rounded border-[var(--border)]"
          />
          Consumir 1 uso al validar
        </label>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!canValidate || loading}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-3 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <ScanLine size={16} />}
            Validar acceso
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center justify-center gap-1 rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-semibold text-[var(--foreground)]"
          >
            <RotateCcw size={15} />
            Limpiar
          </button>
        </div>
      </form>

      {error ? (
        <article className="card border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error}
        </article>
      ) : null}

      {result ? (
        <article className="card space-y-4 p-5">
          <div className="flex items-center justify-between gap-2">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(result.status)}`}
            >
              {statusLabel(result.status)}
            </span>
            {result.valid ? (
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700">
                <CheckCircle2 size={16} />
                Permitido
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-red-700">
                <CircleAlert size={16} />
                Denegado
              </span>
            )}
          </div>

          <p className="text-sm text-[var(--foreground)]">{result.message}</p>

          {result.pass ? (
            <div className="rounded-xl border border-[var(--border)] p-3">
              <div className="flex items-start gap-3">
                <Image
                  src={result.pass.qr_image_url}
                  alt={`QR ${result.pass.label}`}
                  width={78}
                  height={78}
                  unoptimized
                  className="rounded-lg border border-slate-200 bg-white p-1"
                />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-[var(--foreground)]">{result.pass.label}</p>
                  <p className="text-xs text-[var(--muted)]">{passTypeLabel(result.pass.type)}</p>
                  <p className="font-mono text-[11px] text-[var(--muted)]">{result.pass.token}</p>
                  <p className="text-xs text-[var(--muted)]">
                    usos {result.pass.used_count}/{result.pass.max_uses}
                  </p>
                  <p className="text-xs text-[var(--muted)]">
                    expira {new Date(result.pass.valid_until).toLocaleString("es-MX")}
                  </p>
                  <p className="text-xs text-[var(--muted)]">comunidad {result.pass.community_id}</p>
                </div>
              </div>
            </div>
          ) : null}
        </article>
      ) : null}
    </section>
  );
}
