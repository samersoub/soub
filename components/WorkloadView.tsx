
import React from 'react';
import { Task, User } from '../types';

interface Props {
  tasks: Task[];
  users: User[];
}

const WorkloadView: React.FC<Props> = ({ tasks, users }) => {
  return (
    <div className="flex-1 overflow-auto bg-white p-10 custom-scrollbar">
      <header className="mb-10">
        <h2 className="text-2xl font-black text-slate-800">إدارة ضغط العمل (Workload) ⚖️</h2>
        <p className="text-slate-400 text-xs font-bold mt-2">توزيع الساعات الأسبوعية وتجنب احتراق الموظفين.</p>
      </header>

      <div className="space-y-8">
        {users.map(user => {
          const userTasks = tasks.filter(t => t.assignees.includes(user.name));
          const totalEstimated = userTasks.reduce((acc, t) => acc + (t.estimatedHours || 5), 0);
          const capacity = user.capacity || 40;
          const percentage = (totalEstimated / capacity) * 100;

          return (
            <div key={user.id} className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 flex items-center gap-10">
              <div className="w-48">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black">{user.avatar}</div>
                  <div>
                    <div className="text-xs font-black text-slate-800">{user.name}</div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{userTasks.length} مهام</div>
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                  <span className={percentage > 90 ? 'text-rose-600' : 'text-slate-400'}>الاستهلاك: {totalEstimated}س / {capacity}س</span>
                  <span className="text-slate-400">{Math.round(percentage)}%</span>
                </div>
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${percentage > 90 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex -space-x-2">
                {userTasks.slice(0, 5).map(t => (
                  <div key={t.id} className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[10px] shadow-sm" title={t.title}>🛠️</div>
                ))}
                {userTasks.length > 5 && <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-[9px] font-black">+{userTasks.length - 5}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkloadView;
