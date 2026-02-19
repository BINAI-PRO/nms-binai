
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getIncidentSuggestion } from '../geminiService';

const ReportIncidentView: React.FC = () => {
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [category, setCategory] = useState('Mantenimiento');
  const [priority, setPriority] = useState('Media');

  const handleSmartSuggestion = async () => {
    if (description.length < 10) return;
    setLoadingSuggestion(true);
    const suggestion = await getIncidentSuggestion(description);
    if (suggestion) {
      if (suggestion.category) setCategory(suggestion.category);
      if (suggestion.priority) setPriority(suggestion.priority);
    }
    setLoadingSuggestion(false);
  };

  return (
    <div className="min-h-screen bg-white pb-10 flex flex-col">
      <header className="px-6 py-12 bg-white flex items-center gap-4 sticky top-0 z-20 border-b border-slate-50">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100">
          <span className="material-icons-outlined">arrow_back</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="material-icons-outlined text-primary">build</span>
          <h1 className="text-xl font-bold">Reportar Incidencia</h1>
        </div>
      </header>

      <main className="px-6 py-6 space-y-6 flex-grow">
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-light uppercase">Título</label>
          <input 
            type="text" 
            placeholder="Describe brevemente el problema..."
            className="w-full bg-slate-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-primary/20 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-light uppercase">Descripción</label>
          <div className="relative">
            <textarea 
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleSmartSuggestion}
              placeholder="Proporciona más detalles..."
              className="w-full bg-slate-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-primary/20 text-sm resize-none"
            />
            {loadingSuggestion && (
              <div className="absolute bottom-4 right-4 animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-xs font-bold text-muted-light uppercase">Categoría</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'Mantenimiento', icon: 'handyman' },
              { id: 'Ruido', icon: 'volume_up' },
              { id: 'Limpieza', icon: 'cleaning_services' },
              { id: 'Otro', icon: 'more_horiz' }
            ].map(cat => (
              <button 
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  category === cat.id ? 'border-primary bg-primary/5 text-primary' : 'border-slate-50 bg-white text-muted-light'
                }`}
              >
                <span className="material-icons-outlined text-xl">{cat.icon}</span>
                <span className="text-sm font-semibold">{cat.id}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-light uppercase">Prioridad</label>
          <div className="flex bg-slate-50 rounded-xl p-1">
            {['Baja', 'Media', 'Alta'].map(p => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all ${
                  priority === p ? 'bg-white text-primary shadow-sm' : 'text-muted-light'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-light uppercase">Añadir Fotos</label>
          <div className="grid grid-cols-4 gap-3">
            <button className="aspect-square flex items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl">
              <span className="material-icons-outlined text-slate-400">add_a_photo</span>
            </button>
          </div>
        </div>
      </main>

      <footer className="px-6 py-6 sticky bottom-0 bg-white border-t border-slate-100">
        <button 
          onClick={() => navigate('/incidents')}
          className="w-full bg-primary text-white font-bold py-5 rounded-full shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <span>Enviar Reporte</span>
          <span className="material-icons-outlined text-sm">send</span>
        </button>
      </footer>
    </div>
  );
};

export default ReportIncidentView;
