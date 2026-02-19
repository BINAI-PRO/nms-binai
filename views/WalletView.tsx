
import React from 'react';
import { MOCK_TRANSACTIONS } from '../constants';

const WalletView: React.FC = () => {
  return (
    <div className="pb-28">
      <header className="px-6 py-6 flex items-center justify-between">
        <h1 className="text-xl font-bold">Mi Cartera</h1>
        <button className="p-2 bg-slate-100 rounded-full">
          <span className="material-icons-outlined text-xl">settings</span>
        </button>
      </header>

      <main className="px-6 space-y-8">
        {/* Balance Card */}
        <div className="bg-primary rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex flex-col items-center">
            <span className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Saldo disponible</span>
            <h2 className="text-5xl font-bold mb-6">€300,15</h2>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/5 backdrop-blur-sm">
              <span className="material-icons-outlined text-sm text-secondary">verified_user</span>
              <span className="text-[10px] font-bold uppercase tracking-tighter">ID: •••• 4582</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button className="flex flex-col items-center gap-3 bg-white p-6 rounded-2xl shadow-soft border border-slate-100 active:scale-95 transition-all">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
              <span className="material-icons-outlined">add_card</span>
            </div>
            <span className="text-xs font-bold">Recargar</span>
          </button>
          <button className="flex flex-col items-center gap-3 bg-white p-6 rounded-2xl shadow-soft border border-slate-100 active:scale-95 transition-all">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
              <span className="material-icons-outlined">receipt_long</span>
            </div>
            <span className="text-xs font-bold">Pagar cuotas</span>
          </button>
        </div>

        {/* Transactions */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Transacciones</h3>
            <button className="text-xs font-bold text-primary">Ver todas</button>
          </div>
          <div className="space-y-3">
            {MOCK_TRANSACTIONS.map(tx => (
              <div key={tx.id} className="bg-white p-4 rounded-xl border border-slate-50 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                    <span className="material-icons-outlined text-lg">{tx.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{tx.title}</h4>
                    <p className="text-[10px] text-muted-light">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-text-light'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}€
                  </p>
                  <span className="text-[8px] font-bold text-muted-light uppercase tracking-tighter">{tx.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default WalletView;
