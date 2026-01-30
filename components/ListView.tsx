
import React from 'react';
import { Task, TaskStatus, Department, WORKFLOW_ORDER, User } from '../types';

interface ListViewProps {
  tasks: Task[];
  listName: string;
  user: User;
  onUpdateTask: (task: Task) => void;
}

const ListView: React.FC<ListViewProps> = ({ tasks, listName, user, onUpdateTask }) => {
  const groups = Object.values(TaskStatus);

  const renderProgress = (task: Task) => {
    const currentIndex = WORKFLOW_ORDER.indexOf(task.currentDepartment);
    const isBlocked = task.status === TaskStatus.BLOCKED;

    return (
      <div className="flex gap-1 items-center">
        {WORKFLOW_ORDER.map((_, i) => (
          <div 
            key={i} 
            className={`h-1.5 w-5 rounded-full transition-all ${
              isBlocked && i === currentIndex ? 'bg-rose-500 animate-pulse' :
              i < currentIndex ? 'bg-emerald-500' : (i === currentIndex ? 'bg-indigo-600' : 'bg-slate-200')
            }`} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-10 bg-[#FAFAFC]">
      <header className="mb-10 flex justify-between items-end">
         <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{listName}</h1>
            <p className="text-slate-400 text-[10px] mt-2 font-black uppercase tracking-[0.2em]">مراقبة المسار الإنتاجي النشط</p>
         </div>
      </header>

      <div className="space-y-12">
        {groups.map(status => {
          const statusTasks = tasks.filter(t => t.status === status);
          if (statusTasks.length === 0) return null;

          return (
            <section key={status}>
              <div className="flex items-center gap-3 mb-6 px-4">
                 <div className={`w-2 h-6 rounded-full ${status === TaskStatus.BLOCKED ? 'bg-rose-500' : 'bg-slate-300'}`} />
                 <h3 className={`text-[11px] font-black uppercase tracking-widest ${status === TaskStatus.BLOCKED ? 'text-rose-600' : 'text-slate-400'}`}>
                   {status === TaskStatus.BLOCKED ? 'معيقات فنية (تتطلب تدخل)' : status}
                 </h3>
                 <span className="text-[10px] bg-white border border-slate-100 px-2 py-0.5 rounded-lg text-slate-400 font-bold">{statusTasks.length}</span>
              </div>
              
              <div className="space-y-4">
                {statusTasks.map(task => (
                  <div 
                    key={task.id} 
                    onClick={() => onUpdateTask(task)}
                    className={`p-6 rounded-[36px] border flex items-center transition-all cursor-pointer group shadow-sm hover:shadow-xl ${
                      task.status === TaskStatus.BLOCKED ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-100 hover:border-indigo-200'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ml-6 transition-colors ${
                      task.status === TaskStatus.BLOCKED ? 'bg-rose-500 text-white' : 'bg-slate-50 group-hover:bg-indigo-50'
                    }`}>
                       {task.status === TaskStatus.BLOCKED ? '⚠️' : 
                        (task.currentDepartment === Department.PLANNING ? '📋' : 
                         task.currentDepartment === Department.ENGINEERING ? '📐' : '🏭')}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                       <h4 className={`text-sm font-black mb-1 transition-colors ${task.status === TaskStatus.BLOCKED ? 'text-rose-900' : 'text-slate-800 group-hover:text-indigo-600'}`}>
                         {task.title}
                       </h4>
                       <div className="flex items-center gap-6">
                          <span className="text-[10px] font-black text-slate-400 uppercase">قسم: {task.currentDepartment}</span>
                          <div className="w-[1px] h-3 bg-slate-200" />
                          {renderProgress(task)}
                       </div>
                    </div>

                    <div className="flex items-center gap-8 ml-4">
                       {task.productionData.issues.filter(i=>!i.resolvedAt).length > 0 && (
                          <div className="text-[10px] font-black text-rose-500 bg-rose-100 px-3 py-1 rounded-full animate-pulse">
                             مشكلة فنية نشطة
                          </div>
                       )}
                       <div className="text-left">
                          <div className="text-[10px] font-black text-slate-400 uppercase mb-1">أمر التشغيل</div>
                          <span className="text-xs font-mono font-black text-slate-700">{task.id.split('-')[1]}</span>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default ListView;
