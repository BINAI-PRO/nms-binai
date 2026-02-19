import { mockTransactions } from "@/data/mock";
import { PlusCircle } from "lucide-react";

export default function Page() {
  const balance = mockTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  return (
    <div className="space-y-4">
      <div className="card overflow-hidden bg-gradient-to-br from-[var(--primary)] to-[#2a7a87] text-white">
        <div className="p-6 space-y-3">
          <p className="text-sm font-semibold text-white/80">Saldo disponible</p>
          <h1 className="text-3xl font-bold">{balance.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}</h1>
          <p className="text-sm text-white/80">Unidad 1C · Bisalom Residencial</p>
          <button className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20">
            <PlusCircle size={16} /> Recargar
          </button>
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
