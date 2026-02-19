
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_INCIDENTS } from '../constants';

const IncidentsView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="pb-28">
      <header className="px-6 py-6 sticky top-0 bg-background-light/90 backdrop-blur-md z-10 flex justify-between items-center border-b border-slate-100">
        <h1 className="text-xl font-bold text-text-light">Incidencias</h1>
        <button className="p-2 rounded-full bg-slate-100">
          <span className="material-icons-outlined text-xl">filter_list</span>
        </button>
      </header>

      <main className="px-6 py-4 space-y-4">
        {MOCK_INCIDENTS.map((incident) => (
          <div 
            key={incident.id}
            onClick={() => navigate(`/incidents/${incident.id}`)}
            className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex justify-between items-start active:scale-[0.98] transition-all cursor-pointer"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2 h-2 rounded-full ${incident.status === 'En Progreso' ? 'bg-blue-500' : 'bg-slate-300'}`}></span>
                <span className="text-[10px] font-bold text-muted-light uppercase tracking-wider">{incident.status}</span>
              </div>
              <h3 className="font-bold text-text-light leading-snug">{incident.title}</h3>
              <p className="text-xs text-muted-light line-clamp-1">{incident.description}</p>
              <div className="flex items-center gap-1 text-[10px] text-muted-light pt-2">
                <span className="material-icons-outlined text-sm">location_on</span>
                {incident.location}
              </div>
            </div>
            <span className="material-icons-outlined text-muted-light opacity-50">chevron_right</span>
          </div>
        ))}
      </main>
    </div>
  );
};

export default IncidentsView;
