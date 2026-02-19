import Link from "next/link";
import { Camera, Send } from "lucide-react";

export default function Page() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Incidencia</p>
          <h1 className="text-xl font-bold text-[var(--foreground)]">Reportar problema</h1>
        </div>
        <Link href="/app/incidents" className="text-sm font-semibold text-[var(--primary)]">Volver</Link>
      </div>

      <form className="space-y-4 card p-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[var(--foreground)]">Título</label>
          <input className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:border-[var(--primary)] focus:outline-none" placeholder="Ej. Ascensor averiado" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[var(--foreground)]">Descripción</label>
          <textarea rows={3} className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:border-[var(--primary)] focus:outline-none" placeholder="Describe el problema" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <select className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:border-[var(--primary)]">
            <option>Prioridad media</option>
            <option>Alta</option>
            <option>Baja</option>
          </select>
          <select className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:border-[var(--primary)]">
            <option>Ubicación</option>
            <option>Bloque A</option>
            <option>Gimnasio</option>
          </select>
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-dashed border-[var(--border)] px-3 py-3 text-sm">
          <div className="rounded-full bg-[var(--primary)]/10 p-2 text-[var(--primary)]"><Camera size={18} /></div>
          <div className="flex-1">
            <p className="font-semibold text-[var(--foreground)]">Adjuntar fotos/video</p>
            <p className="text-xs text-[var(--muted)]">Hasta 3 fotos y 1 video (mp4)</p>
          </div>
          <button type="button" className="rounded-full bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-white">Subir</button>
        </div>

        <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white shadow hover:opacity-90">
          Enviar reporte
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
