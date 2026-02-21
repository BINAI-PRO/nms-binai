import { supabaseAdmin } from "@/lib/supabase";

type ClientRow = {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string | null;
};

type MembershipRow = {
  user_id: string;
  role: string;
};

export default async function AdminClientsPage() {
  if (!supabaseAdmin) {
    return (
      <section className="card space-y-2 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
          Admin - clientes
        </p>
        <h2 className="text-lg font-bold text-[var(--foreground)]">Configuracion pendiente</h2>
        <p className="text-sm text-[var(--muted)]">
          Faltan variables de Supabase para administrar altas y bajas de clientes.
        </p>
      </section>
    );
  }

  const [usersRes, membershipsRes] = await Promise.all([
    supabaseAdmin
      .from("users")
      .select("id,email,full_name,created_at")
      .order("created_at", { ascending: false })
      .limit(50),
    supabaseAdmin.from("memberships").select("user_id,role"),
  ]);

  if (usersRes.error) {
    return (
      <section className="card space-y-2 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
          Admin - clientes
        </p>
        <h2 className="text-lg font-bold text-[var(--foreground)]">No se pudo cargar clientes</h2>
        <p className="text-sm text-[var(--muted)]">{usersRes.error.message}</p>
      </section>
    );
  }

  const membershipByUser = new Map<string, string[]>();
  const memberships = (membershipsRes.data ?? []) as MembershipRow[];
  for (const membership of memberships) {
    const prev = membershipByUser.get(membership.user_id) ?? [];
    if (!prev.includes(membership.role)) prev.push(membership.role);
    membershipByUser.set(membership.user_id, prev);
  }

  const users = (usersRes.data ?? []) as ClientRow[];

  return (
    <section className="space-y-4">
      <header className="card space-y-2 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
          Admin - clientes
        </p>
        <h2 className="text-lg font-bold text-[var(--foreground)]">Altas, bajas y perfiles</h2>
        <p className="text-sm text-[var(--muted)]">
          Control de usuarios, roles y relacion con comunidades.
        </p>
      </header>

      <article className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.1em] text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Correo</th>
                <th className="px-4 py-3">Roles</th>
                <th className="px-4 py-3">Alta</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-[var(--border)]">
                  <td className="px-4 py-3 font-semibold text-[var(--foreground)]">
                    {user.full_name || "Sin nombre"}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">{user.email}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(membershipByUser.get(user.id) ?? ["resident"]).map((role) => (
                        <span
                          key={`${user.id}-${role}`}
                          className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {user.created_at ? new Date(user.created_at).toLocaleString("es-MX") : "--"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
