
import React from 'react';
import { MOCK_FACILITIES } from '../constants';

const BookingsView: React.FC = () => {
  return (
    <div className="pb-28">
      <header className="px-6 py-8 sticky top-0 bg-background-light/90 backdrop-blur-md z-20 border-b border-slate-50">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold">Instalaciones</h1>
          <span className="material-symbols-outlined text-slate-400">tune</span>
        </div>
        <div className="relative">
          <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
            <span className="material-icons-outlined text-lg">search</span>
          </span>
          <input 
            className="w-full bg-white border-none rounded-xl py-4 pl-12 pr-4 shadow-sm text-sm" 
            placeholder="¿Qué buscas hoy?"
          />
        </div>
      </header>

      <main className="px-6 py-6 space-y-4">
        {MOCK_FACILITIES.map(fac => (
          <div 
            key={fac.id}
            className="bg-white p-4 rounded-xl shadow-soft border border-slate-50 flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-slate-50`}>
                <span className={`material-symbols-outlined text-${fac.color}-600`}>{fac.icon}</span>
              </div>
              <div>
                <h3 className="font-bold text-text-light">{fac.name}</h3>
                <p className="text-[10px] text-muted-light font-medium">{fac.type} • {fac.location}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                fac.status === 'Disponible' ? 'bg-green-50 text-green-600' :
                fac.status === 'Ocupado' ? 'bg-red-50 text-red-600' :
                'bg-slate-50 text-slate-500'
              }`}>
                {fac.status}
              </span>
              <span className="material-icons-outlined text-slate-300 text-sm">chevron_right</span>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default BookingsView;
