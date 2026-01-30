
import React from 'react';
import { Space, Task, TaskStatus, Department, Machine } from '../types';

interface DashboardViewProps {
  spaces: Space[];
  tasks: Task[];
  machines?: Machine[];
}

const DashboardView: React.FC<DashboardViewProps> = ({ spaces, tasks, machines = [] }) => {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-10 bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        
        {/* Machine Status Bar */}
        <section className="mb-10 flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
           {machines.length === 0 ? (
             <div className="bg-indigo-900 w-full p-6 rounded-[32px] text-white/60 text-xs font-black text-center border border-white/10">
                لا توجد ماكينات مسجلة حالياً. قم بإضافتها من لوحة الإدارة لمراقبة الأداء.
             </div>
           ) : (
             machines.map(m => (
               <div key={m.id} className="min-w-[200px] bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${m.status === 'RUNNING' ? 'bg-emerald-500 animate-pulse' : m.status === 'MAINTENANCE' ? 'bg-rose-500' : 'bg-slate-300'}`} />
                  <div>
                     <div className="text-xs font-black text-slate-800">{m.name}</div>
                     <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{m.type}</div>
                  </div>
               </div>
             ))
           )}
        </section>

        {/* Intelligence Board */}
        <section className="mb-10 p-10 bg-indigo-950 rounded-[48px] text-white relative overflow-hidden shadow-2xl">
           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                 <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[9px] font-black uppercase tracking-[0.2em]">Live Production Stream</span>
                 </div>
                 <h1 className="text-4xl font-black leading-tight mb-6">معدل الإنجاز العام <span className="text-emerald-400">84%</span> <br/> لهذا الأسبوع.</h1>
                 <p className="text-white/50 text-sm font-medium leading-relaxed max-w-md">يتم حالياً معالجة {tasks.filter(t=>t.status !== TaskStatus.DONE).length} مشروعاً نشطاً عبر 5 أقسام تشغيلية.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[32px] border border-white/10">
                    <div className="text-[9px] font-black text-white/40 uppercase mb-2 tracking-widest">متوسط وقت التنفيذ</div>
                    <div className="text-2xl font-black">3.2 يوم</div>
                 </div>
                 <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[32px] border border-white/10">
                    <div className="text-[9px] font-black text-white/40 uppercase mb-2 tracking-widest">تنبيهات الجودة</div>
                    <div className="text-2xl font-black text-rose-400">02</div>
                 </div>
              </div>
           </div>
           <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] -mr-20 -mt-20"></div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
             <h2 className="text-2xl font-black text-slate-800 mb-10 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-indigo-600 rounded-full"></span>
                كفاءة الأقسام الحالية
             </h2>
             <div className="space-y-8">
                {spaces.map(space => {
                  const spaceTasks = tasks.filter(t => t.currentDepartment === space.department);
                  const done = spaceTasks.filter(t => t.status === TaskStatus.DONE).length;
                  const progress = spaceTasks.length > 0 ? (done / spaceTasks.length) * 100 : 0;
                  
                  return (
                    <div key={space.id}>
                       <div className="flex justify-between items-end mb-3">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-xl">{space.icon}</div>
                             <span className="font-black text-slate-800">{space.name}</span>
                          </div>
                          <span className="text-xs font-black text-slate-400">{spaceTasks.length} مهمة نشطة</span>
                       </div>
                       <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="h-full transition-all duration-1000" style={{ width: `${Math.max(progress, 5)}%`, backgroundColor: space.color }}></div>
                       </div>
                    </div>
                  );
                })}
             </div>
          </div>

          <div className="space-y-8">
             <div className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm">
                <h3 className="text-lg font-black text-slate-800 mb-6">أحدث التحديثات الفنية</h3>
                <div className="space-y-6">
                   {tasks.slice(0, 4).map(task => (
                     <div key={task.id} className="flex gap-4">
                        <div className="w-1 bg-indigo-500 rounded-full"></div>
                        <div>
                           <div className="text-[11px] font-black text-slate-800">{task.title}</div>
                           <div className="text-[9px] text-slate-400 font-bold uppercase mt-1">انتقل إلى: {task.currentDepartment}</div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             <div className="bg-emerald-50 p-8 rounded-[48px] border border-emerald-100">
                <div className="text-2xl mb-4">✅</div>
                <h3 className="text-lg font-black text-emerald-900 mb-2">جاهز للتسليم</h3>
                <p className="text-emerald-700 text-xs font-medium leading-relaxed">هناك 4 مشاريع أكملت مرحلة فحص الجودة وهي جاهزة للشحن للعملاء.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
