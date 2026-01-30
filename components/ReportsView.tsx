
import React from 'react';
import { Task, TaskStatus, Space, Department, WORKFLOW_ORDER } from '../types';

interface Props {
  tasks: Task[];
  spaces: Space[];
}

const ReportsView: React.FC<Props> = ({ tasks, spaces }) => {
  const totalTasks = tasks.length;
  const blockedTasks = tasks.filter(t => t.status === TaskStatus.BLOCKED).length;
  const completedTasks = tasks.filter(t => t.status === TaskStatus.DONE).length;
  
  // حساب متوسط عدد المشاكل لكل مشروع
  const totalIssues = tasks.reduce((acc, t) => acc + t.productionData.issues.length, 0);
  const avgIssuesPerTask = totalTasks > 0 ? (totalIssues / totalTasks).toFixed(1) : 0;

  return (
    <div className="flex-1 overflow-y-auto p-10 bg-[#f8fafc] custom-scrollbar" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl font-black text-slate-900">تحليلات كفاءة الإنتاج 📈</h1>
          <p className="text-slate-500 font-bold text-sm mt-2">مراقبة تدفق العمل، جودة المخرجات، وسرعة دوران المشاريع بين الأقسام.</p>
        </header>

        {/* Operational Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">إجمالي أوامر التشغيل</div>
             <div className="text-3xl font-black text-indigo-600">{totalTasks}</div>
          </div>
          <div className="bg-rose-50 p-8 rounded-[40px] shadow-sm border border-rose-100">
             <div className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-2">المشاريع المتعطلة (⚠️)</div>
             <div className="text-3xl font-black text-rose-600">{blockedTasks}</div>
          </div>
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">متوسط المشاكل/مشروع</div>
             <div className="text-3xl font-black text-amber-500">{avgIssuesPerTask}</div>
          </div>
          <div className="bg-emerald-900 p-8 rounded-[40px] shadow-2xl text-white">
             <div className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-2">نسبة الإنجاز الكلية</div>
             <div className="text-3xl font-black">{Math.round((completedTasks / (totalTasks || 1)) * 100)}%</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Workflow Distribution */}
          <section className="bg-white rounded-[48px] p-10 border border-slate-100 shadow-sm">
             <h2 className="text-xl font-black text-slate-800 mb-8">توزيع المهام على المسار الإنتاجي</h2>
             <div className="space-y-6">
                {WORKFLOW_ORDER.map(dept => {
                   const count = tasks.filter(t => t.currentDepartment === dept && t.status !== TaskStatus.DONE).length;
                   const percentage = (count / (tasks.filter(t => t.status !== TaskStatus.DONE).length || 1)) * 100;
                   return (
                     <div key={dept}>
                        <div className="flex justify-between text-[11px] font-black mb-2 uppercase">
                           <span className="text-slate-700">{dept}</span>
                           <span className="text-slate-400">{count} مشاريع قيد العمل</span>
                        </div>
                        <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden">
                           <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
                        </div>
                     </div>
                   );
                })}
             </div>
          </section>

          {/* Issue Logs Analysis */}
          <section className="bg-white rounded-[48px] p-10 border border-slate-100 shadow-sm">
             <h2 className="text-xl font-black text-slate-800 mb-8">أكثر الأقسام تبليغاً عن معيقات</h2>
             <div className="space-y-4">
                {spaces.map(space => {
                   const issueCount = tasks.reduce((acc, t) => acc + t.productionData.issues.filter(i => i.department === space.department).length, 0);
                   return (
                     <div key={space.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                        <div className="flex items-center gap-4">
                           <span className="text-xl">{space.icon}</span>
                           <span className="text-xs font-black text-slate-700">{space.name}</span>
                        </div>
                        <span className={`px-4 py-1 rounded-full text-[10px] font-black ${issueCount > 5 ? 'bg-rose-100 text-rose-600' : 'bg-slate-200 text-slate-500'}`}>
                           {issueCount} مشاكل فنية
                        </span>
                     </div>
                   );
                })}
             </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
