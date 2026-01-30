
import React from 'react';
import { Task, TaskStatus } from '../types';

interface Props {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const GanttView: React.FC<Props> = ({ tasks, onTaskClick }) => {
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-white">
      <div className="flex-1 overflow-auto custom-scrollbar">
        <div className="min-w-[1200px]">
          {/* Timeline Header */}
          <div className="flex border-b border-slate-100 sticky top-0 bg-white z-10">
            <div className="w-64 p-4 border-l border-slate-100 font-black text-[10px] text-slate-400 uppercase tracking-widest">المهمة / المشروع</div>
            {days.map((day, i) => (
              <div key={i} className="flex-1 p-4 border-l border-slate-50 text-center">
                <div className="text-[10px] font-black text-slate-400 uppercase">{day.toLocaleDateString('ar-EG', { weekday: 'short' })}</div>
                <div className="text-xs font-black text-slate-800">{day.getDate()}</div>
              </div>
            ))}
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-50">
            {tasks.map((task) => (
              <div key={task.id} className="flex group hover:bg-slate-50/50 transition-colors" onClick={() => onTaskClick(task)}>
                <div className="w-64 p-4 border-l border-slate-100 flex items-center gap-3 cursor-pointer">
                  <div className={`w-2 h-2 rounded-full ${task.status === TaskStatus.DONE ? 'bg-emerald-500' : 'bg-indigo-500'}`}></div>
                  <span className="text-xs font-bold text-slate-700 truncate">{task.title}</span>
                </div>
                <div className="flex-1 relative h-16 flex items-center px-4">
                  {/* Mock Gantt Bar */}
                  <div 
                    className={`absolute h-8 rounded-xl shadow-sm flex items-center px-4 text-[9px] font-black text-white transition-all group-hover:shadow-md`}
                    style={{ 
                      left: `${Math.random() * 40}%`, 
                      width: `${20 + Math.random() * 30}%`,
                      backgroundColor: task.status === TaskStatus.DONE ? '#10b981' : '#6366f1'
                    }}
                  >
                    {Math.round(20 + Math.random() * 30)}% مكتمل
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttView;
