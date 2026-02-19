
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AccessQRView: React.FC = () => {
  const navigate = useNavigate();
  const [qrType, setQrType] = useState<'visitor' | 'service'>('visitor');
  const [isGenerated, setIsGenerated] = useState(false);
  const [name, setName] = useState('');

  const generateQR = () => {
    if (!name && qrType === 'visitor') return;
    setIsGenerated(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="px-6 py-12 bg-white flex items-center justify-between sticky top-0 z-20 border-b border-slate-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100">
            <span className="material-icons-outlined">close</span>
          </button>
          <h1 className="text-xl font-bold">Pase de Acceso</h1>
        </div>
        <button className="text-primary font-bold text-sm">Historial</button>
      </header>

      <main className="px-6 py-8 flex-grow space-y-8">
        {!isGenerated ? (
          <>
            <div className="bg-slate-50 p-1.5 rounded-xl flex">
              <button 
                onClick={() => setQrType('visitor')}
                className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all ${
                  qrType === 'visitor' ? 'bg-white text-primary shadow-sm' : 'text-muted-light'
                }`}
              >
                INVITADO
              </button>
              <button 
                onClick={() => setQrType('service')}
                className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all ${
                  qrType === 'service' ? 'bg-white text-primary shadow-sm' : 'text-muted-light'
                }`}
              >
                SERVICIO
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-light uppercase tracking-widest">
                  {qrType === 'visitor' ? 'Nombre del Invitado' : 'Tipo de Servicio'}
                </label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={qrType === 'visitor' ? 'Ej. Juan Pérez' : 'Ej. Fontanería, Delivery...'}
                  className="w-full bg-slate-50 border-none rounded-xl p-5 text-sm focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-light uppercase tracking-widest">Fecha y Duración</label>
                <div className="grid grid-cols-2 gap-3">
                   <div className="bg-slate-50 p-4 rounded-xl flex items-center justify-between">
                     <span className="text-xs font-bold">Hoy</span>
                     <span className="material-icons-outlined text-sm text-muted-light">calendar_today</span>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-xl flex items-center justify-between">
                     <span className="text-xs font-bold">4 Horas</span>
                     <span className="material-icons-outlined text-sm text-muted-light">schedule</span>
                   </div>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 space-y-3">
              <div className="flex gap-3">
                <span className="material-icons-outlined text-primary">info</span>
                <p className="text-xs text-primary/80 leading-relaxed font-medium">
                  El código QR será válido solo para el acceso peatonal y de garaje durante el tiempo especificado.
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-10 animate-in fade-in zoom-in duration-500">
             <div className="text-center">
               <h2 className="text-2xl font-bold text-text-light">{qrType === 'visitor' ? 'Pase de Invitado' : 'Pase de Servicio'}</h2>
               <p className="text-muted-light text-sm mt-2">{name || 'Servicio Técnico'}</p>
             </div>

             <div className="relative p-10 bg-white rounded-3xl shadow-xl border border-slate-100">
               <img 
                 src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=bisalom-access-12345" 
                 alt="Access QR" 
                 className="w-56 h-56"
               />
               <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-10 pointer-events-none">
                 <span className="material-icons-outlined text-[120px] text-primary">qr_code_2</span>
               </div>
             </div>

             <div className="w-full space-y-4">
                <div className="flex items-center justify-center gap-6 text-[10px] font-bold text-muted-light uppercase tracking-tighter">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-text-light">VALIDEZ</span>
                    <span>20 JUN • 24H</span>
                  </div>
                  <div className="w-px h-6 bg-slate-200"></div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-text-light">ZONA</span>
                    <span>A + B + G</span>
                  </div>
                </div>
                
                <p className="text-center text-[10px] text-red-400 font-bold uppercase animate-pulse">Este código es personal e intransferible</p>
             </div>
          </div>
        )}
      </main>

      <footer className="px-6 py-10 sticky bottom-0 bg-white border-t border-slate-50 space-y-4">
        {!isGenerated ? (
          <button 
            onClick={generateQR}
            disabled={!name && qrType === 'visitor'}
            className={`w-full font-bold py-5 rounded-full shadow-lg transition-all flex items-center justify-center gap-3 ${
              name || qrType === 'service' ? 'bg-primary text-white shadow-primary/20' : 'bg-slate-100 text-slate-400 shadow-none'
            }`}
          >
            <span className="material-icons-outlined text-lg">qr_code_2</span>
            <span>Generar Código</span>
          </button>
        ) : (
          <div className="flex gap-4">
            <button 
              className="flex-grow bg-primary text-white font-bold py-5 rounded-full shadow-lg shadow-primary/20 flex items-center justify-center gap-3 active:scale-95 transition-all"
            >
              <span className="material-icons-outlined text-lg">share</span>
              <span>Enviar Pase</span>
            </button>
            <button 
              onClick={() => setIsGenerated(false)}
              className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center active:scale-95 transition-all"
            >
              <span className="material-icons-outlined">refresh</span>
            </button>
          </div>
        )}
      </footer>
    </div>
  );
};

export default AccessQRView;
