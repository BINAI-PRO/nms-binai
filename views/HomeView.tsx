
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_FACILITIES, MOCK_INCIDENTS, MOCK_ANNOUNCEMENTS } from '../constants';

const HomeView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="pb-28">
      {/* Status Bar Spacer */}
      <div className="h-10 px-6 flex items-end justify-between text-xs font-medium text-text-light opacity-60">
        <span>9:41</span>
        <div className="flex gap-1.5 items-center">
          <span className="material-icons-outlined text-sm">signal_cellular_alt</span>
          <span className="material-icons-outlined text-sm">wifi</span>
          <span className="material-icons-outlined text-sm">battery_full</span>
        </div>
      </div>

      <header className="px-6 py-4 flex justify-between items-center sticky top-0 z-10 bg-background-light/90 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              alt="Profile" 
              className="w-12 h-12 rounded-full border-2 border-white shadow-sm" 
              src="https://picsum.photos/seed/carlos/100" 
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <p className="text-sm text-muted-light">Bienvenido,</p>
            <h1 className="text-lg font-bold text-text-light leading-tight">Carlos Ufano</h1>
          </div>
        </div>
        <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors">
          <span className="material-icons-outlined text-2xl text-primary">notifications</span>
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </header>

      <main className="px-6 space-y-8 mt-2">
        {/* Wallet Card */}
        <section 
          onClick={() => navigate('/wallet')}
          className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary to-[#2a7a87] text-white p-6 shadow-soft cursor-pointer transform active:scale-[0.98] transition-all"
        >
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-secondary-light text-sm font-medium opacity-90">Saldo Actual</p>
                <h2 className="text-3xl font-bold mt-1">€300,15</h2>
              </div>
              <span className="material-icons-outlined text-3xl opacity-30">account_balance_wallet</span>
            </div>
            <div className="flex items-center gap-2 mt-2 pt-4 border-t border-white/10">
              <span className="material-icons-outlined text-sm opacity-80">home</span>
              <span className="text-sm font-medium opacity-90">Bloque 2 - Primero C</span>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h3 className="text-lg font-bold text-text-light mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'report', label: 'Incidencia', icon: 'build', color: 'bg-red-50 text-red-500', path: '/report' },
              { id: 'book', label: 'Reservar', icon: 'calendar_today', color: 'bg-secondary-light text-primary', path: '/bookings' },
              { id: 'qr', label: 'Acceso QR', icon: 'qr_code_2', color: 'bg-indigo-50 text-indigo-500', path: '/access-qr' },
              { id: 'pay', label: 'Pagar', icon: 'payments', color: 'bg-blue-50 text-blue-500', path: '/wallet' },
            ].map(action => (
              <button 
                key={action.id}
                onClick={() => navigate(action.path)}
                className="group flex flex-col items-center gap-2 p-3 rounded-xl bg-white border border-slate-100 shadow-sm active:scale-95 transition-all"
              >
                <div className={`w-10 h-10 rounded-full ${action.color} flex items-center justify-center transition-colors`}>
                  <span className="material-icons-outlined text-xl">{action.icon}</span>
                </div>
                <span className="text-[9px] font-semibold text-center text-text-light">{action.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Today Summary */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-text-light">Hoy</h3>
            <button className="text-sm font-medium text-primary hover:underline">Ver Calendario</button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white border-l-4 border-l-secondary shadow-sm">
              <div className="flex-shrink-0 flex flex-col items-center justify-center w-12 h-12 bg-slate-50 rounded-lg">
                <span className="text-[10px] font-bold text-muted-light uppercase">Jun</span>
                <span className="text-lg font-bold text-text-light">20</span>
              </div>
              <div className="flex-grow">
                <h4 className="font-semibold text-text-light">Pista de Pádel 1</h4>
                <p className="text-[10px] text-muted-light">18:00 - 19:30 • Instalación Deportiva</p>
              </div>
              <span className="material-icons-outlined text-muted-light">chevron_right</span>
            </div>
            
            <div 
              onClick={() => navigate('/incidents/4029')}
              className="flex items-center gap-4 p-4 rounded-xl bg-white border-l-4 border-l-orange-400 shadow-sm cursor-pointer"
            >
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-orange-50 rounded-lg text-orange-500">
                <span className="material-icons-outlined">warning</span>
              </div>
              <div className="flex-grow">
                <h4 className="font-semibold text-text-light">Reparación AA Gimnasio</h4>
                <p className="text-[10px] text-muted-light">Estado: En Progreso</p>
              </div>
              <span className="material-icons-outlined text-muted-light">chevron_right</span>
            </div>
          </div>
        </section>

        {/* Latest Announcements */}
        <section>
          <h3 className="text-lg font-bold text-text-light mb-4">Últimos Anuncios</h3>
          {MOCK_ANNOUNCEMENTS.map(ann => (
            <div key={ann.id} className="relative w-full rounded-xl overflow-hidden shadow-soft group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
              <img 
                alt={ann.title} 
                className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500" 
                src={ann.imageUrl} 
              />
              <div className="absolute bottom-0 left-0 p-5 z-20 w-full">
                <span className="inline-block px-2 py-1 mb-2 text-[10px] font-bold uppercase tracking-wider text-white bg-primary rounded-md">{ann.type}</span>
                <h4 className="text-white font-bold text-lg leading-tight mb-1">{ann.title}</h4>
                <p className="text-slate-200 text-xs line-clamp-2">{ann.excerpt}</p>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default HomeView;
