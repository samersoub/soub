
import React from 'react';
import { Task, TaskStatus } from '../types';

interface ListViewProps {
  tasks: Task[];
  onUpdateTask: (task: Task) => void;
  onAddTask: (status?: string) => void;
}

const ListView: React.FC<ListViewProps> = ({ tasks, onUpdateTask, onAddTask }) => {
  const groups = Object.values(TaskStatus);

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
      <div className="p-6 space-y-12">
        {groups.map(status => {
          const statusTasks = tasks.filter(t => t.status === status);
          
          return (
            <div key={status} className="space-y-1">
              {/* Group Header */}
              <div className="flex items-center gap-3 mb-2 px-2 py-1 sticky top-0 bg-white z-10">
                 <button className="text-[10px] text-slate-300">▼</button>
                 <span className={`px-2 py-0.5 rounded text-[10px] font-black text-white ${
                   status === TaskStatus.TODO ? 'bg-slate-400' : 
                   status === TaskStatus.DONE ? 'bg-emerald-500' : 'bg-indigo-500'
                 }`}>{status}</span>
                 <span className="text-[11px] text-slate-400 font-bold">{statusTasks.length}</span>
              </div>

              {/* Table Header (Only if first group or visible) */}
              <div className="flex items-center text-[10px] font-black text-slate-300 border-b border-slate-50 px-2 py-2 uppercase tracking-wider">
                 <div className="w-8 ml-2"></div>
                 <div className="flex-1">Name</div>
                 <div className="w-24 px-4">Assignee</div>
                 <div className="w-24 px-4">Due Date</div>
                 <div className="w-24 px-4">Priority</div>
                 <div className="w-24 px-4">Status</div>
                 <div className="w-12 px-4"></div>
              </div>

              {/* Task Rows */}
              {statusTasks.map(task => (
                <div 
                  key={task.id} 
                  onClick={() => onUpdateTask(task)}
                  className="flex items-center group hover:bg-slate-50 border-b border-slate-50 px-2 py-2 cursor-pointer transition-colors"
                >
                  <div className="w-8 ml-2 flex justify-center">
                     <div className="w-4 h-4 border-2 border-slate-200 rounded-full group-hover:border-indigo-400"></div>
                  </div>
                  <div className="flex-1 text-xs font-bold text-slate-700 group-hover:text-indigo-600 truncate">
                    {task.title}
                  </div>
                  <div className="w-24 px-4 flex justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">👤</div>
                  </div>
                  <div className="w-24 px-4 flex justify-center opacity-40 group-hover:opacity-100">
                    <span className="text-[14px]">📅</span>
                  </div>
                  <div className="w-24 px-4 flex justify-center opacity-40 group-hover:opacity-100">
                    <span className="text-[14px]">🏳️</span>
                  </div>
                  <div className="w-24 px-4 flex justify-center">
                    <div className={`text-[9px] font-black border px-2 py-0.5 rounded uppercase ${
                      task.status === TaskStatus.DONE ? 'border-emerald-500 text-emerald-500' : 'border-slate-200 text-slate-400'
                    }`}>
                      {task.status}
                    </div>
                  </div>
                  <div className="w-12 px-4 flex justify-center opacity-0 group-hover:opacity-100">
                     <span className="text-slate-400">💬</span>
                  </div>
                </div>
              ))}

              {/* Inline Add Task */}
              <div className="px-10 py-2">
                 <button 
                   onClick={(e) => { e.stopPropagation(); onAddTask(status); }}
                   className="text-[11px] font-bold text-slate-300 hover:text-indigo-600 transition-colors"
                 >
                   + Add Task
                 </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListView;
