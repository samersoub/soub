
import React from 'react';
import { Task, TaskStatus } from '../types';

interface BoardViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (status?: string) => void;
}

const BoardView: React.FC<BoardViewProps> = ({ tasks, onTaskClick, onAddTask }) => {
  const statuses = Object.values(TaskStatus);

  return (
    <div className="flex-1 overflow-x-auto bg-slate-50 p-6 flex gap-6 custom-scrollbar">
      {statuses.map(status => {
        const statusTasks = tasks.filter(t => t && t.status === status);
        return (
          <div key={status} className="flex-shrink-0 w-80 flex flex-col">
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  status === TaskStatus.TODO ? 'bg-slate-300' :
                  status === TaskStatus.IN_PROGRESS ? 'bg-blue-500' :
                  status === TaskStatus.BLOCKED ? 'bg-rose-500' :
                  status === TaskStatus.QUALITY_CHECK ? 'bg-purple-500' :
                  status === TaskStatus.UNDER_REVIEW ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />
                <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider">
                   {status}
                </h3>
                <span className="text-xs bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full font-bold">
                  {statusTasks.length}
                </span>
              </div>
              <button onClick={() => onAddTask(status)} className="text-slate-400 hover:text-indigo-600 text-lg">+</button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pb-10">
              {statusTasks.map(task => (
                <div 
                  key={task.id} 
                  onClick={() => onTaskClick(task)}
                  className="bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                      task.priority === 'URGENT' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-slate-50 text-slate-400'
                    }`}>
                      {task.priority || 'NORMAL'}
                    </span>
                    <span className="text-[9px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-lg">
                      {task.currentDepartment || 'PLANNING'}
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-slate-800 leading-relaxed group-hover:text-indigo-600 transition-colors">
                    {task.title || 'بدون عنوان'}
                  </h4>
                  <div className="flex justify-between items-center mt-5 pt-4 border-t border-slate-50">
                    <div className="flex -space-x-2">
                      {(task.assignees || []).map((a, i) => (
                        <div key={i} className="w-6 h-6 rounded-full bg-indigo-50 border-2 border-white flex items-center justify-center text-[8px] font-black text-indigo-600 shadow-sm">
                          {a[0]}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-slate-300 text-[10px] font-bold">
                       {task.comments?.length > 0 && <span>💬 {task.comments.length}</span>}
                    </div>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => onAddTask(status)}
                className="w-full py-3 border-2 border-dashed border-slate-200 rounded-[24px] text-slate-400 text-[11px] font-black hover:bg-white hover:border-indigo-300 hover:text-indigo-600 transition-all"
              >
                + إضافة مهمة هنا
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BoardView;
