
import React from 'react';

interface Props {
  onSelect: (view: any) => void;
}

const AppGrid: React.FC<Props> = ({ onSelect }) => {
  const apps = [
    { id: 'LIST', label: 'Spaces', icon: '🌌', color: 'text-indigo-500' },
    { id: 'FLOOR_MAP', label: 'Factory Floor', icon: '🏭', color: 'text-emerald-500' },
    { id: 'REPLIES', label: 'Chat', icon: '💬', color: 'text-emerald-500' },
    { id: 'DOCS', label: 'Docs', icon: '📄', color: 'text-blue-500' },
    { id: 'DASHBOARD', label: 'Dashboards', icon: '📊', color: 'text-purple-500' },
    { id: 'MINDMAP', label: 'Whiteboards', icon: '🎨', color: 'text-amber-500' },
    { id: 'FORMS', label: 'Forms', icon: '📝', color: 'text-indigo-600' },
    { id: 'INVENTORY', label: 'Inventory', icon: '📦', color: 'text-emerald-600' },
    { id: 'CLIPS', label: 'Clips', icon: '📹', color: 'text-rose-500' },
    { id: 'PORTFOLIO', label: 'Portfolios', icon: '📈', color: 'text-orange-500' },
    { id: 'TIMESHEETS', label: 'Timesheets', icon: '⏱️', color: 'text-orange-600' },
    { id: 'ADMIN', label: 'Apps', icon: '🧩', color: 'text-slate-600' }
  ];

  return (
    <div className="absolute bottom-16 left-20 w-80 bg-white rounded-[32px] shadow-2xl border border-slate-100 p-6 z-[100] animate-in slide-in-from-bottom-5 fade-in">
      <div className="grid grid-cols-3 gap-6">
        {apps.map(app => (
          <button 
            key={app.label}
            onClick={() => onSelect(app.id)}
            className="flex flex-col items-center gap-2 group"
          >
            <div className={`w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-xl transition-all group-hover:scale-110 group-hover:shadow-lg group-hover:bg-white`}>
              {app.icon}
            </div>
            <span className="text-[10px] font-black text-slate-500 group-hover:text-slate-900 transition-colors">{app.label}</span>
          </button>
        ))}
      </div>
      <div className="mt-8 pt-4 border-t border-slate-50">
         <button className="w-full py-2 bg-slate-50 text-[10px] font-black text-slate-400 rounded-xl hover:bg-slate-100 transition-colors">
            Customize navigation
         </button>
      </div>
    </div>
  );
};

export default AppGrid;
