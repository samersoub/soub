
import React from 'react';
import { Task, TaskStatus, Department } from '../types';

interface BoardViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const BoardView: React.FC<BoardViewProps> = ({ tasks, onTaskClick }) => {
  const statuses = Object.values(TaskStatus);

  return (
    <div className="flex-1 overflow-x-auto bg-slate-50 p-6 flex gap-6 custom-scrollbar">
      {statuses.map(status => {
        const statusTasks = tasks.filter(t => t.status === status);
        return (
          <div key={status} className="flex-shrink-0 w-80 flex flex-col">
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  status === TaskStatus.TODO ? 'bg-slate-300' :
                  status === TaskStatus.IN_PROGRESS ? 'bg-blue-500' :
                  status === TaskStatus.QUALITY_CHECK ? 'bg-purple-500' :
                  status === TaskStatus.REVIEW ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />
                <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">
                  {status === TaskStatus.TODO ? 'قيد الانتظار' :
                   status === TaskStatus.IN_PROGRESS ? 'قيد التنفيذ' :
                   status === TaskStatus.QUALITY_CHECK ? 'فحص الجودة' :
                   status === TaskStatus.REVIEW ? 'للمراجعة' : 'مكتمل'}
                </h3>
                <span className="text-xs bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full font-bold">
                  {statusTasks.length}
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              {statusTasks.map(task => (
                <div 
                  key={task.id} 
                  onClick={() => onTaskClick(task)}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                      task.priority === 'URGENT' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {task.priority}
                    </span>
                    <span className="text-[9px] text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded">
                      {task.currentDepartment}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                    {task.title}
                  </h4>
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-50">
                    <div className="flex -space-x-2">
                      {task.assignees.map((a, i) => (
                        <div key={i} className="w-6 h-6 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-indigo-600">
                          {a[0]}
                        </div>
                      ))}
                    </div>
                    {task.comments.length > 0 && (
                      <div className="flex items-center text-slate-400 gap-1 text-[10px]">
                        <span>💬</span> {task.comments.length}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <button className="w-full py-2 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs font-bold hover:bg-slate-100 transition-colors">
                + إضافة مهمة
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BoardView;
