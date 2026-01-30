
import React, { useState } from 'react';
import { Task, TaskStatus } from '../types';

interface ListViewProps {
  tasks: Task[];
  onUpdateTask: (task: Task) => void;
  onAddTask: (status?: string) => void;
}

const ListView: React.FC<ListViewProps> = ({ tasks, onUpdateTask, onAddTask }) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [activePriority, setActivePriority] = useState<string | null>(null);

  const filteredTasks = tasks.filter(t => {
    const matchesQuery = t.title.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesPriority = !activePriority || t.priority === activePriority;
    return matchesQuery && matchesPriority;
  });

  const groups = Object.values(TaskStatus);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      {/* Filtering Toolbar */}
      <div className="h-14 border-b border-slate-100 px-8 flex items-center justify-between bg-white/50 backdrop-blur-sm z-20">
         <div className="flex items-center gap-6">
            <div className="relative group">
               <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors">🔍</span>
               <input 
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder="فلترة حسب الاسم..."
                  className="bg-slate-50/50 border border-slate-100 rounded-xl pr-9 pl-4 py-1.5 text-xs font-bold outline-none focus:bg-white focus:border-indigo-200 transition-all w-64"
               />
            </div>
            <div className="flex gap-2">
               {['URGENT', 'HIGH', 'NORMAL'].map(p => (
                  <button 
                     key={p}
                     onClick={() => setActivePriority(activePriority === p ? null : p)}
                     className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase transition-all border ${
                        activePriority === p ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:border-indigo-100'
                     }`}
                  >
                     {p}
                  </button>
               ))}
            </div>
         </div>
         <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-indigo-600 text-xs font-black flex items-center gap-2">
               📊 فرز حسب التاريخ ⌵
            </button>
            <div className="w-px h-4 bg-slate-100"></div>
            <button className="text-slate-400 hover:text-indigo-600 text-xs font-black">
               ⋮ المزيد
            </button>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="min-w-[1200px] pb-32">
          {groups.map(status => {
            const statusTasks = filteredTasks.filter(t => t.status === status);
            if (statusTasks.length === 0 && filterQuery) return null;
            
            return (
              <div key={status} className="mb-8">
                {/* Group Header */}
                <div className="flex items-center gap-3 px-8 py-3 sticky top-0 bg-white/95 backdrop-blur z-10 border-b border-slate-50">
                   <button className="text-[10px] text-slate-300">▼</button>
                   <span className={`px-3 py-1 rounded-lg text-[9px] font-black text-white uppercase shadow-sm ${
                     status === TaskStatus.TODO ? 'bg-slate-400' : 
                     status === TaskStatus.DONE ? 'bg-emerald-500' : 
                     status === TaskStatus.IN_PROGRESS ? 'bg-blue-500' : 'bg-indigo-500'
                   }`}>{status === TaskStatus.TODO ? 'قيد الانتظار' : status}</span>
                   <span className="text-[11px] text-slate-300 font-black">{statusTasks.length}</span>
                </div>

                {/* Task Rows */}
                {statusTasks.map(task => (
                  <div 
                    key={task.id} 
                    onClick={() => onUpdateTask(task)}
                    className="flex items-center group hover:bg-slate-50/80 border-b border-slate-50 px-8 py-2.5 cursor-pointer transition-colors"
                  >
                    <div className="w-10 ml-2 flex justify-center">
                       <div className={`w-5 h-5 border-2 rounded-lg flex items-center justify-center transition-all ${task.status === TaskStatus.DONE ? 'bg-emerald-500 border-emerald-500' : 'border-slate-200 group-hover:border-indigo-400'}`}>
                          {task.status === TaskStatus.DONE && <span className="text-white text-[10px]">✓</span>}
                       </div>
                    </div>
                    <div className="flex-1 text-xs font-black text-slate-700 group-hover:text-indigo-600 transition-colors truncate">
                      {task.title}
                    </div>
                    
                    <div className="flex items-center gap-8 text-[11px] font-black text-slate-400">
                       <div className="w-24 text-center">
                          <span className={`px-2 py-1 rounded-md text-[8px] ${
                             task.priority === 'URGENT' ? 'bg-rose-50 text-rose-500 border border-rose-100' : 
                             task.priority === 'HIGH' ? 'bg-amber-50 text-amber-500 border border-amber-100' : 'bg-slate-50 text-slate-400'
                          }`}>
                             {task.priority || 'NORMAL'}
                          </span>
                       </div>
                       <div className="w-24 flex justify-center">
                          <div className="flex -space-x-2">
                             {task.assignees.map(a => (
                                <div key={a} className="w-6 h-6 rounded-full bg-indigo-50 border-2 border-white flex items-center justify-center text-[8px] font-black text-indigo-600 uppercase shadow-sm">{a[0]}</div>
                             ))}
                             {task.assignees.length === 0 && <span className="text-slate-200">👤</span>}
                          </div>
                       </div>
                       <div className="w-32 text-center text-slate-300 hover:text-indigo-600 transition-colors">
                          📅 {new Date(task.createdAt).toLocaleDateString([], {month:'short', day:'numeric'})}
                       </div>
                    </div>

                    <div className="w-10 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="text-slate-300 hover:text-indigo-600 text-lg">⋯</button>
                    </div>
                  </div>
                ))}

                {/* Inline Add Task */}
                <div className="px-20 py-3">
                   <button 
                     onClick={(e) => { e.stopPropagation(); onAddTask(status); }}
                     className="text-[11px] font-black text-slate-300 hover:text-indigo-600 transition-all flex items-center gap-3 group"
                   >
                     <span className="w-5 h-5 bg-slate-50 rounded-lg flex items-center justify-center group-hover:bg-indigo-50 transition-colors">+</span> إضافة مهمة سريعة
                   </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ListView;
