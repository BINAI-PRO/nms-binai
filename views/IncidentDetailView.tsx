
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_INCIDENTS } from '../constants';

const IncidentDetailView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const incident = MOCK_INCIDENTS.find(i => i.id === id) || MOCK_INCIDENTS[0];

  return (
    <div className="pb-28 bg-background-light">
      <header className="px-4 py-4 sticky top-0 bg-white/80 backdrop-blur-md z-30 flex items-center justify-between border-b border-slate-100">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-100">
          <span className="material-icons-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold">Incidencia #{incident.id}</h1>
        <button className="p-2 rounded-full hover:bg-slate-100">
          <span className="material-icons-outlined">more_vert</span>
        </button>
      </header>

      <main className="p-6 space-y-8">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-text-light">{incident.title}</h2>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold border border-blue-100 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
              {incident.status}
            </span>
          </div>
          <p className="text-sm text-text-light opacity-80 mb-6">{incident.description}</p>
          <div className="flex items-center gap-2 text-[10px] font-bold text-muted-light pt-4 border-t border-slate-50 uppercase tracking-widest">
            <span className="material-icons-outlined text-sm">location_on</span>
            {incident.location}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-muted-light uppercase tracking-widest mb-4">Cronología</h3>
          <div className="space-y-6 relative pl-5 border-l border-slate-200 ml-1">
            <div className="relative">
              <span className="absolute -left-[25px] top-1 w-3 h-3 bg-primary rounded-full ring-4 ring-primary/10"></span>
              <p className="text-[10px] font-bold text-primary mb-1">HOY, 09:30 AM</p>
              <h4 className="font-bold text-sm">Técnico en camino</h4>
              <p className="text-xs text-muted-light mt-1">El equipo de Otis ha sido notificado y se dirige a la propiedad.</p>
            </div>
            <div className="relative opacity-60">
              <span className="absolute -left-[25px] top-1 w-3 h-3 bg-slate-300 rounded-full"></span>
              <p className="text-[10px] font-bold text-muted-light mb-1">AYER, 02:15 PM</p>
              <h4 className="font-bold text-sm">Validado por Admin</h4>
              <p className="text-xs text-muted-light mt-1">La administración ha confirmado el problema.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <h3 className="text-xs font-bold text-muted-light uppercase mb-4">Comentarios</h3>
          <div className="flex gap-3">
             <img src="https://picsum.photos/seed/admin/50" className="w-8 h-8 rounded-full" />
             <div className="bg-slate-50 p-3 rounded-xl rounded-tl-none">
               <p className="text-[10px] font-bold mb-1">ADMINISTRACIÓN</p>
               <p className="text-xs">Estamos trabajando para solucionarlo lo antes posible.</p>
             </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 pb-10 bg-white border-t border-slate-100 flex gap-2">
        <input 
          placeholder="Escribe un comentario..."
          className="flex-grow bg-slate-50 border-none rounded-full px-4 py-3 text-sm focus:ring-1 focus:ring-primary/20"
        />
        <button className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center">
          <span className="material-icons-outlined text-sm">send</span>
        </button>
      </div>
    </div>
  );
};

export default IncidentDetailView;
