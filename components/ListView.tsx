
import React, { useState } from 'react';
import { Task, TaskStatus } from '../types';
import { Icons } from '../constants';

interface ListViewProps {
  tasks: Task[];
  onUpdateTask: (task: Task) => void;
  onAddTask: (status?: string) => void;
}

const ListView: React.FC<ListViewProps> = ({ tasks, onUpdateTask, onAddTask }) => {
  const [filterQuery, setFilterQuery] = useState('');

  const filteredTasks = tasks.filter(t => t?.title?.toLowerCase().includes(filterQuery.toLowerCase()));
  const groups = Object.values(TaskStatus);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white fade-up">
      {/* Precision Search Bar */}
      <div className="h-16 border-b border-zinc-100 px-8 flex items-center justify-between">
         <div className="flex items-center gap-4 flex-1">
            <div className="text-zinc-300 ml-2"><Icons.Search /></div>
            <input 
               value={filterQuery}
               onChange={(e) => setFilterQuery(e.target.value)}
               placeholder="Search by ID, title, or department..."
               className="bg-transparent border-none py-2 text-xs font-medium outline-none w-full max-w-md placeholder:text-zinc-300"
            />
         </div>
         <button onClick={() => onAddTask()} className="flat-btn-primary">
            + New Operation
         </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-8">
          {groups.map(status => {
            const statusTasks = filteredTasks.filter(t => t.status === status);
            if (statusTasks.length === 0 && filterQuery) return null;
            
            return (
              <div key={status} className="mb-10">
                <div className="flex items-center gap-4 py-3 border-b border-zinc-100 mb-4">
                   <span className="text-[10px] font-black text-zinc-900 uppercase tracking-[0.3em]">{status}</span>
                   <div className="h-px flex-1 bg-zinc-50"></div>
                   <span className="text-[9px] font-bold text-zinc-300">{statusTasks.length} ITEMS</span>
                </div>

                <div className="space-y-1">
                  {statusTasks.map(task => (
                    <div 
                      key={task.id} 
                      onClick={() => onUpdateTask(task)}
                      className="tech-table-row flex items-center py-3 px-4 group bg-white border border-transparent hover:border-zinc-200"
                    >
                      <div className="w-8 flex justify-center">
                         <div className={`w-3.5 h-3.5 border border-zinc-200 transition-all ${task.status === TaskStatus.DONE ? 'bg-zinc-900 border-zinc-900' : 'bg-zinc-50'}`}>
                            {task.status === TaskStatus.DONE && <svg className="w-2.5 h-2.5 text-white m-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M5 13l4 4L19 7" /></svg>}
                         </div>
                      </div>
                      
                      <div className="flex-1 mr-6">
                         <div className="text-[12px] font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors">
                           {task.title || 'UNNAMED_TASK'}
                         </div>
                         <div className="flex items-center gap-3 mt-1 opacity-40">
                            <span className="text-[9px] font-mono tracking-tighter">REF_{task.id.slice(-4)}</span>
                            <div className="w-1 h-1 bg-zinc-400"></div>
                            <span className="text-[9px] font-black uppercase">{task.currentDepartment}</span>
                         </div>
                      </div>
                      
                      <div className="flex items-center gap-12">
                         <div className="w-20 text-left">
                            <span className={`text-[9px] font-black uppercase tracking-widest ${
                               task.priority === 'URGENT' ? 'text-rose-600' : 'text-zinc-400'
                            }`}>
                               {task.priority}
                            </span>
                         </div>
                         
                         <div className="w-24 flex justify-end -space-x-1">
                            {task.assignees?.map(a => (
                               <div key={a} className="w-6 h-6 bg-zinc-100 border border-white text-[8px] font-black flex items-center justify-center uppercase">{a[0]}</div>
                            ))}
                            {(!task.assignees || task.assignees.length === 0) && <div className="w-6 h-6 border border-zinc-100 border-dashed rounded-full"></div>}
                         </div>

                         <div className="w-24 text-left text-[10px] font-bold text-zinc-300 group-hover:text-zinc-500 transition-all">
                            {new Date(task.createdAt).toLocaleDateString('en-US', {month:'short', day:'numeric'})}
                         </div>
                      </div>
                    </div>
                  ))}
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
