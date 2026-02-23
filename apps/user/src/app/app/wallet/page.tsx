import Image from "next/image";
import { PlusCircle } from "lucide-react";
import { mockMyBookings, mockTransactions } from "@/data/mock";

export default function Page() {
  const balance = mockTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  const reservationCredit = Math.max(balance, 0);
  const pendingReservations = mockMyBookings.filter((booking) => booking.status === "Pendiente").length;
  const totalConfirmed = mockMyBookings.filter((booking) => booking.status === "Confirmada").length;
  const nextMaintenanceDate = "15 Mar 2026";
  const maintenanceAmount = 2150;

  return (
    <div className="space-y-4">
      <div className="card overflow-hidden text-white">
        <div className="relative">
          <Image
            src="/encino/portada_mt.webp"
            alt="Portada financiera de Residencial Encino"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-slate-900/70 to-[var(--primary)]/75" />

          <div className="relative space-y-3 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/80">Resumen de billetera</p>
            <h1 className="text-3xl font-bold">
              {balance.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
            </h1>
            <p className="text-sm text-white/90">Saldo disponible para pagos, cuotas y reservas.</p>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-2">
                <p className="text-[11px] uppercase tracking-wide text-white/75">Mantenimiento</p>
                <p className="text-sm font-semibold">Al corriente</p>
                <p className="text-[11px] text-white/75">
                  Proximo {nextMaintenanceDate} -{" "}
                  {maintenanceAmount.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
                </p>
              </div>
              <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-2">
                <p className="text-[11px] uppercase tracking-wide text-white/75">Creditos y reservas</p>
                <p className="text-sm font-semibold">
                  {reservationCredit.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
                </p>
                <p className="text-[11px] text-white/75">Pendientes: {pendingReservations}</p>
              </div>
            </div>

            <p className="text-xs text-white/85">
              Reservaciones activas: <span className="font-semibold">{totalConfirmed} confirmadas</span>
            </p>

            <button className="mt-1 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/25">
              <PlusCircle size={16} /> Recargar
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Movimientos</h2>
        <div className="grid gap-2">
          {mockTransactions.map((tx) => (
            <div key={tx.id} className="card flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-[var(--foreground)]">{tx.title}</p>
                <p className="text-xs text-[var(--muted)]">{tx.date}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${tx.amount >= 0 ? "text-[var(--success)]" : "text-[var(--foreground)]"}`}>
                  {tx.amount >= 0 ? "+" : ""}
                  {tx.amount.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
                </p>
                <p className="text-xs text-[var(--muted)]">{tx.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
