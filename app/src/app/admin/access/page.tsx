import { supabaseAdmin } from "@/lib/supabase";
import { AdminAccessClient, type AdminAccessPass } from "./page-client";

export default async function AdminAccessPage() {
  if (!supabaseAdmin) {
    return (
      <section className="card space-y-2 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
          Admin - access
        </p>
        <h2 className="text-lg font-bold text-[var(--foreground)]">Configuracion pendiente</h2>
        <p className="text-sm text-[var(--muted)]">
          Faltan variables de Supabase para administrar el modulo de accesos.
        </p>
      </section>
    );
  }

  const result = await supabaseAdmin
    .from("access_passes")
    .select(
      "id,community_id,type,label,token,status,valid_from,valid_until,max_uses,used_count,last_used_at,created_at"
    )
    .order("created_at", { ascending: false })
    .limit(200);

  if (result.error) {
    return (
      <section className="card space-y-2 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
          Admin - access
        </p>
        <h2 className="text-lg font-bold text-[var(--foreground)]">No se pudo cargar accesos</h2>
        <p className="text-sm text-[var(--muted)]">
          {result.error.message.includes("access_passes")
            ? "La tabla access_passes no existe. Ejecuta la migracion 0002_access_passes.sql."
            : result.error.message}
        </p>
      </section>
    );
  }

  const initialPasses = (result.data ?? []) as AdminAccessPass[];

  return <AdminAccessClient initialPasses={initialPasses} />;
}
