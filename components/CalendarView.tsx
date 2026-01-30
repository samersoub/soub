
import React from 'react';
import { Task, TaskStatus } from '../types';

interface Props {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const CalendarView: React.FC<Props> = ({ tasks, onTaskClick }) => {
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="flex-1 overflow-auto bg-white p-8 custom-scrollbar">
      <div className="flex justify-between items-center mb-8">
         <h2 className="text-2xl font-black text-slate-800">تقويم الإنتاج - {today.toLocaleString('ar-EG', { month: 'long', year: 'numeric' })}</h2>
         <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-600">اليوم</button>
            <div className="flex bg-slate-50 rounded-xl p-1 border border-slate-100">
               <button className="px-4 py-1 text-[10px] font-black bg-white shadow-sm rounded-lg">شهر</button>
               <button className="px-4 py-1 text-[10px] font-black text-slate-400">أسبوع</button>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-slate-100 border border-slate-100 rounded-[32px] overflow-hidden shadow-sm">
        {['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map(d => (
          <div key={d} className="bg-slate-50 p-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">{d}</div>
        ))}
        {currentMonthDays.map(day => {
          const dayTasks = tasks.filter(t => {
             const d = new Date(t.createdAt);
             return d.getDate() === day;
          });

          return (
            <div key={day} className="bg-white min-h-[140px] p-4 group hover:bg-slate-50 transition-all">
              <span className="text-xs font-black text-slate-300 group-hover:text-indigo-600 transition-colors">{day}</span>
              <div className="mt-2 space-y-1">
                {dayTasks.map(task => (
                  <div 
                    key={task.id} 
                    onClick={() => onTaskClick(task)}
                    className={`p-1.5 rounded-lg text-[9px] font-black truncate cursor-pointer transition-all ${
                      task.status === TaskStatus.DONE ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'
                    } border border-transparent hover:border-indigo-200`}
                  >
                    {task.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
