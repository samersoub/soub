
import React, { useState, useEffect } from 'react';
import { Task, Space } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  spaces: Space[];
  onSelectTask: (task: Task) => void;
}

const CommandCenter: React.FC<Props> = ({ isOpen, onClose, tasks, spaces, onSelectTask }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const filteredTasks = query.length > 1 
    ? tasks.filter(t => t.title.includes(query) || t.description.includes(query))
    : [];

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative w-full max-w-2xl bg-white rounded-[28px] shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center gap-4">
          <span className="text-2xl opacity-40">🔍</span>
          <input 
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-xl font-bold text-slate-800 placeholder:text-slate-300"
            placeholder="ابحث عن مهام، مخططات، أو فنيين... (Esc للإغلاق)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="max-h-[50vh] overflow-y-auto p-4 custom-scrollbar">
          {query.length <= 1 ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-4 opacity-20">⌨️</div>
              <p className="text-slate-400 font-bold">ابدأ الكتابة للبحث الشامل في المؤسسة</p>
              <div className="mt-4 flex justify-center gap-2">
                 <span className="text-[10px] bg-slate-100 px-2 py-1 rounded-lg text-slate-500 font-black">CTRL + K</span>
                 <span className="text-[10px] bg-slate-100 px-2 py-1 rounded-lg text-slate-500 font-black">ESC</span>
              </div>
            </div>
          ) : filteredTasks.length > 0 ? (
            <div className="space-y-2">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2">نتائج المهام ({filteredTasks.length})</div>
              {filteredTasks.map(task => (
                <button 
                  key={task.id}
                  onClick={() => { onSelectTask(task); onClose(); }}
                  className="w-full text-right p-4 rounded-2xl hover:bg-indigo-50 flex items-center justify-between group transition-all"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800 group-hover:text-indigo-700">{task.title}</span>
                    <span className="text-xs text-slate-400 truncate max-w-[400px]">{task.description}</span>
                  </div>
                  <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-1 rounded-lg font-black uppercase">{task.currentDepartment}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400">لا توجد نتائج مطابقة لـ "{query}"</div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
           <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Enter للاختيار</span>
              <span>Arrows للتنقل</span>
           </div>
           <div className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">Jordan Advanced Metal Forming</div>
        </div>
      </div>
    </div>
  );
};

export default CommandCenter;
