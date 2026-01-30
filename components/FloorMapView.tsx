
import React, { useState } from 'react';
import { Machine, Task, TaskStatus } from '../types';

interface Props {
  machines: Machine[];
  tasks: Task[];
  onSelectMachine: (m: Machine) => void;
}

const FloorMapView: React.FC<Props> = ({ machines, tasks, onSelectMachine }) => {
  const [zoom, setZoom] = useState(1);

  return (
    <div className="flex-1 bg-slate-900 overflow-hidden relative flex items-center justify-center" dir="rtl">
      {/* Industrial Grid Background */}
      <div className="absolute inset-0 opacity-10" style={{ 
        backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', 
        backgroundSize: '40px 40px' 
      }}></div>

      <div className="relative w-[800px] h-[600px] bg-slate-800/50 border-4 border-slate-700/50 rounded-[64px] shadow-2xl transition-transform duration-500" style={{ transform: `scale(${zoom})` }}>
        {/* Entrance */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 bg-slate-700 px-8 py-2 rounded-b-xl text-[10px] font-black text-slate-500 uppercase tracking-widest">Main Entrance / المدخل الرئيسي</div>

        {/* Machines Visualization */}
        {machines.map(m => {
          const machineTasks = tasks.filter(t => t.machineId === m.id && t.status !== TaskStatus.DONE);
          const isOverloaded = machineTasks.length > 3;
          
          return (
            <div 
              key={m.id}
              onClick={() => onSelectMachine(m)}
              className="absolute cursor-pointer group"
              style={{ left: m.x, top: m.y }}
            >
              {/* Pulsing Status Ring */}
              <div className={`absolute -inset-4 rounded-full blur-xl transition-all duration-1000 ${
                m.status === 'RUNNING' ? 'bg-emerald-500/20 animate-pulse' : 
                m.status === 'MAINTENANCE' ? 'bg-rose-500/20' : 'bg-slate-500/10'
              }`}></div>

              <div className={`w-32 h-32 bg-slate-800 border-2 rounded-3xl flex flex-col items-center justify-center shadow-2xl transition-all group-hover:scale-110 group-hover:border-indigo-400 ${
                m.status === 'RUNNING' ? 'border-emerald-500/50' : 
                m.status === 'MAINTENANCE' ? 'border-rose-500/50' : 'border-slate-600'
              }`}>
                <div className="text-2xl mb-2">{m.type === 'Cutting' ? '✂️' : m.type === 'Bending' ? '📐' : m.type === 'Welding' ? '🔥' : '🎨'}</div>
                <div className="text-[10px] font-black text-white text-center px-2">{m.name}</div>
                
                {/* Micro Indicators */}
                <div className="mt-2 flex gap-1">
                   {machineTasks.map((_, i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full ${isOverloaded ? 'bg-rose-500' : 'bg-indigo-500'}`}></div>
                   ))}
                </div>
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-white p-4 rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none w-48 z-50">
                 <div className="text-xs font-black text-slate-800 mb-1">{m.name}</div>
                 <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase">
                    <span>الحالة: {m.status}</span>
                    <span>المهام: {machineTasks.length}</span>
                 </div>
                 <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600" style={{ width: `${Math.min(machineTasks.length * 20, 100)}%` }}></div>
                 </div>
              </div>
            </div>
          );
        })}

        {/* Zones Labels */}
        <div className="absolute bottom-10 left-10 text-white/10 text-6xl font-black select-none">ZONE A</div>
        <div className="absolute top-10 right-10 text-white/10 text-6xl font-black select-none">ZONE B</div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-10 left-10 bg-white/10 backdrop-blur-xl border border-white/10 p-2 rounded-2xl flex flex-col gap-2 z-50">
         <button onClick={() => setZoom(z => Math.min(z + 0.1, 1.5))} className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/20 rounded-xl transition-all">➕</button>
         <button onClick={() => setZoom(z => Math.max(z - 0.1, 0.5))} className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/20 rounded-xl transition-all">➖</button>
      </div>

      <div className="absolute top-10 right-10 flex flex-col gap-4">
         <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700 p-6 rounded-3xl shadow-2xl">
            <h3 className="text-sm font-black text-white mb-4 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               البث المباشر للمصنع
            </h3>
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <div className="text-xs text-slate-400 font-bold">إجمالي استهلاك الطاقة:</div>
                  <div className="text-xs text-emerald-400 font-black">42.8 KW</div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="text-xs text-slate-400 font-bold">الماكينات النشطة:</div>
                  <div className="text-xs text-indigo-400 font-black">3 / 4</div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default FloorMapView;
