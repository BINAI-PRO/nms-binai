
import React, { useState } from 'react';
import { MOCK_CHAT_GROUPS, MOCK_MESSAGES } from '../constants';

const CommunityView: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');

  if (selectedGroup) {
    const group = MOCK_CHAT_GROUPS.find(g => g.id === selectedGroup);
    return (
      <div className="h-screen bg-slate-50 flex flex-col">
        <header className="px-6 py-6 bg-white border-b border-slate-100 flex items-center gap-4 sticky top-0 z-20">
          <button onClick={() => setSelectedGroup(null)} className="p-2 -ml-2 rounded-full hover:bg-slate-100">
            <span className="material-icons-outlined">arrow_back</span>
          </button>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
               <span className="material-icons-outlined">{group?.icon}</span>
             </div>
             <div>
               <h1 className="font-bold text-text-light">{group?.name}</h1>
               <p className="text-[10px] text-green-500 font-medium uppercase tracking-widest">En línea</p>
             </div>
          </div>
        </header>

        <main className="flex-grow overflow-y-auto px-4 py-6 space-y-6">
          {MOCK_MESSAGES.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} gap-2`}>
              {!msg.isMe && (
                <img src={msg.avatar} alt={msg.sender} className="w-8 h-8 rounded-full self-end border border-white shadow-sm" />
              )}
              <div className="max-w-[80%] space-y-1">
                {!msg.isMe && <p className="text-[10px] font-bold text-muted-light ml-1">{msg.sender}</p>}
                <div className={`p-4 rounded-2xl ${
                  msg.isMe 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-white text-text-light border border-slate-100 shadow-sm rounded-tl-none'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p className={`text-[9px] text-right mt-1.5 ${msg.isMe ? 'text-white/60' : 'text-muted-light'}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </main>

        <footer className="px-4 py-6 pb-12 bg-white border-t border-slate-100 flex gap-2">
          <button className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center">
            <span className="material-icons-outlined">add</span>
          </button>
          <input 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Mensaje a la comunidad..."
            className="flex-grow bg-slate-50 border-none rounded-full px-6 py-3 text-sm focus:ring-1 focus:ring-primary/20"
          />
          <button 
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              inputText ? 'bg-primary text-white shadow-lg' : 'bg-slate-100 text-slate-300'
            }`}
          >
            <span className="material-icons-outlined text-sm">send</span>
          </button>
        </footer>
      </div>
    );
  }

  return (
    <div className="pb-28">
      <header className="px-6 py-10 sticky top-0 bg-background-light/90 backdrop-blur-md z-10 flex justify-between items-center border-b border-slate-50">
        <div>
          <h1 className="text-2xl font-bold text-text-light">Comunidad</h1>
          <p className="text-xs text-muted-light mt-1">Chat vecinal y grupos de interés</p>
        </div>
        <button className="p-2.5 rounded-full bg-white shadow-sm border border-slate-100">
          <span className="material-icons-outlined text-primary">search</span>
        </button>
      </header>

      <main className="px-4 py-6 space-y-4">
        {MOCK_CHAT_GROUPS.map((group) => (
          <div 
            key={group.id}
            onClick={() => setSelectedGroup(group.id)}
            className="bg-white p-5 rounded-2xl border border-slate-50 shadow-sm flex gap-4 active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden group"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
              <span className="material-icons-outlined text-2xl">{group.icon}</span>
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-text-light">{group.name}</h3>
                <span className="text-[10px] text-muted-light">{group.time}</span>
              </div>
              <p className="text-xs text-muted-light line-clamp-1 italic">"{group.lastMessage}"</p>
            </div>
            {group.unread > 0 && (
              <div className="absolute top-4 right-4 w-5 h-5 bg-secondary text-primary font-bold text-[10px] rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {group.unread}
              </div>
            )}
          </div>
        ))}

        <div className="pt-8">
           <h3 className="text-xs font-bold text-muted-light uppercase tracking-widest px-2 mb-4">Directorio de Vecinos</h3>
           <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
             {[1, 2, 3, 4, 5].map(i => (
               <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0">
                  <div className="relative">
                    <img src={`https://picsum.photos/seed/vecino${i}/100`} className="w-14 h-14 rounded-full border-2 border-white shadow-soft" />
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                  </div>
                  <span className="text-[9px] font-bold text-text-light">Vecino {i}</span>
               </div>
             ))}
           </div>
        </div>
      </main>
    </div>
  );
};

export default CommunityView;
