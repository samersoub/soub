
import React from 'react';
import { Task, List } from '../types';

interface Props {
  tasks: Task[];
  listName: string;
}

const MindMapView: React.FC<Props> = ({ tasks, listName }) => {
  return (
    <div className="flex-1 overflow-auto bg-slate-900 p-20 custom-scrollbar flex items-center justify-center min-h-screen">
      <div className="flex items-center">
        {/* Central Node */}
        <div className="relative">
          <div className="bg-indigo-600 text-white p-8 rounded-[32px] shadow-2xl border-4 border-indigo-400 z-10 relative">
             <div className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">المجلد الرئيسي</div>
             <div className="text-xl font-black">{listName}</div>
          </div>
          
          {/* Connecting Lines and Child Nodes */}
          <div className="absolute top-1/2 left-full w-20 h-0.5 bg-indigo-500/30 -translate-y-1/2"></div>
          
          <div className="ml-20 flex flex-col gap-8">
            {tasks.map((task, idx) => (
              <div key={task.id} className="relative flex items-center">
                {/* Connecting lines for children */}
                <div className="absolute -left-20 top-1/2 w-20 h-0.5 bg-indigo-500/30 -translate-y-1/2"></div>
                
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group w-64">
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-[9px] font-black text-indigo-400 uppercase">{task.status}</span>
                      <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                   </div>
                   <div className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{task.title}</div>
                   {task.subtasks && task.subtasks.length > 0 && (
                      <div className="mt-4 pl-4 border-l border-white/10 space-y-2">
                         {task.subtasks.map(sub => (
                            <div key={sub.id} className="text-[10px] text-white/40 flex items-center gap-2">
                               <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                               {sub.title}
                            </div>
                         ))}
                      </div>
                   )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Legend / Tools */}
      <div className="fixed bottom-10 right-10 flex flex-col gap-4">
         <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl">
            <div className="text-[10px] font-black text-white/40 uppercase mb-4 text-center">أدوات العرض</div>
            <div className="flex gap-2">
               <button className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-indigo-600 transition-all">➕</button>
               <button className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-indigo-600 transition-all">➖</button>
               <button className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-indigo-600 transition-all">🎯</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default MindMapView;
