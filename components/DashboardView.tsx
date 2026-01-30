
import React from 'react';
import { Space, Task, TaskStatus, Department, Machine } from '../types';

interface DashboardViewProps {
  spaces: Space[];
  tasks: Task[];
  machines?: Machine[];
}

const DashboardView: React.FC<DashboardViewProps> = ({ spaces, tasks, machines = [] }) => {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-10 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto">
        
        {/* Resource Allocation / Machines Status */}
        <section className="mb-12">
           <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-6 px-2">حالة أصول الإنتاج والماكينات</h2>
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {machines.map(m => {
                 const machineTasks = tasks.filter(t => t.machineId === m.id && t.status !== TaskStatus.DONE);
                 const load = Math.min(machineTasks.length * 25, 100);
                 
                 return (
                  <div key={m.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm group hover:border-indigo-200 transition-all">
                     <div className="flex justify-between items-start mb-4">
                        <div className={`w-3 h-3 rounded-full ${m.status === 'RUNNING' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                        <span className="text-[9px] font-black text-slate-300 uppercase">{m.type}</span>
                     </div>
                     <h3 className="text-sm font-black text-slate-800 mb-1">{m.name}</h3>
                     <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-2">
                        <span>الضغط: {load}%</span>
                        <span>{machineTasks.length} مهام</span>
                     </div>
                     <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-1000 ${load > 80 ? 'bg-rose-500' : 'bg-indigo-500'}`} style={{ width: `${load}%` }} />
                     </div>
                  </div>
                 );
              })}
           </div>
        </section>

        {/* Global Stats Overlay */}
        <section className="mb-12 p-12 bg-slate-900 rounded-[56px] text-white relative overflow-hidden shadow-2xl">
           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
              <div className="lg:col-span-1">
                 <h1 className="text-5xl font-black mb-4">84%</h1>
                 <p className="text-slate-400 font-bold text-sm leading-relaxed">إجمالي كفاءة خطوط الإنتاج لهذا الشهر. تم تسليم 24 مشروعاً قبل الموعد.</p>
              </div>
              <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                 <div className="bg-white/5 backdrop-blur-md p-6 rounded-[32px] border border-white/10">
                    <div className="text-[9px] font-black text-indigo-400 uppercase mb-2 tracking-widest">مشاريع نشطة</div>
                    <div className="text-2xl font-black">{tasks.filter(t=>t.status !== TaskStatus.DONE).length}</div>
                 </div>
                 <div className="bg-white/5 backdrop-blur-md p-6 rounded-[32px] border border-white/10">
                    <div className="text-[9px] font-black text-emerald-400 uppercase mb-2 tracking-widest">تم الفحص</div>
                    <div className="text-2xl font-black">{tasks.filter(t=>t.status === TaskStatus.QUALITY_CHECK).length}</div>
                 </div>
                 <div className="bg-rose-500/20 backdrop-blur-md p-6 rounded-[32px] border border-rose-500/20">
                    <div className="text-[9px] font-black text-rose-400 uppercase mb-2 tracking-widest">أعطال معلقة</div>
                    <div className="text-2xl font-black">02</div>
                 </div>
              </div>
           </div>
           <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/30 rounded-full blur-[100px] -mr-40 -mt-40"></div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
             <h2 className="text-xl font-black text-slate-800 mb-10 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
                توزيع ضغط العمل بالأقسام
             </h2>
             <div className="space-y-8">
                {spaces.map(space => {
                  const spaceTasks = tasks.filter(t => t.currentDepartment === space.department);
                  const done = spaceTasks.filter(t => t.status === TaskStatus.DONE).length;
                  const progress = spaceTasks.length > 0 ? (done / spaceTasks.length) * 100 : 0;
                  
                  return (
                    <div key={space.id} className="group cursor-default">
                       <div className="flex justify-between items-end mb-3">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">{space.icon}</div>
                             <span className="font-black text-slate-800">{space.name}</span>
                          </div>
                          <span className="text-[10px] font-black text-slate-400">{spaceTasks.length} مهام</span>
                       </div>
                       <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div className="h-full transition-all duration-1000 shadow-[0_0_10px_rgba(0,0,0,0.1)]" style={{ width: `${Math.max(progress, 5)}%`, backgroundColor: space.color }}></div>
                       </div>
                    </div>
                  );
                })}
             </div>
          </div>

          <div className="space-y-8">
             <div className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">نشاط الإنتاج اللحظي</h3>
                <div className="space-y-6">
                   {tasks.slice(0, 5).map(task => (
                     <div key={task.id} className="flex gap-4 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                        <div className="flex-1">
                           <div className="text-[11px] font-black text-slate-800 leading-tight mb-1">{task.title}</div>
                           <div className="text-[9px] text-slate-400 font-bold uppercase">{task.status} • {task.currentDepartment}</div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             <div className="bg-indigo-600 p-8 rounded-[48px] shadow-2xl shadow-indigo-100 relative overflow-hidden text-white group cursor-pointer">
                <div className="relative z-10">
                   <div className="text-2xl mb-4">🚀</div>
                   <h3 className="text-lg font-black mb-2">تسريع المهام بالذكاء الاصطناعي</h3>
                   <p className="text-indigo-100 text-[10px] font-bold leading-relaxed">اضغط هنا لتحليل العوائق الحالية في خط الإنتاج واقتراح حلول تحسين فورية.</p>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
