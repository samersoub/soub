
import React from 'react';
import { Task, TaskStatus, Space } from '../types';

interface Props {
  tasks: Task[];
  spaces: Space[];
}

const ReportsView: React.FC<Props> = ({ tasks, spaces }) => {
  const totalEstimated = tasks.reduce((acc, t) => acc + (t.productionData.estimatedCost || 0), 0);
  const totalActual = tasks.reduce((acc, t) => acc + (t.productionData.actualCost || 0), 0);
  const completionRate = (tasks.filter(t => t.status === TaskStatus.DONE).length / tasks.length) * 100;

  return (
    <div className="flex-1 overflow-y-auto p-10 bg-[#f8fafc] custom-scrollbar">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl font-black text-slate-900">التقارير المالية والإنتاجية 📊</h1>
          <p className="text-slate-500 font-bold text-sm mt-2">تحليل دقيق للتكاليف، الكفاءة، ونسب الإنجاز في المصنع.</p>
        </header>

        {/* Financial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">إجمالي التكاليف التقديرية</div>
             <div className="text-3xl font-black text-indigo-600 font-mono">{totalEstimated.toLocaleString()} JOD</div>
          </div>
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">إجمالي التكاليف الفعلية</div>
             <div className="text-3xl font-black text-rose-500 font-mono">{totalActual.toLocaleString()} JOD</div>
          </div>
          <div className="bg-indigo-900 p-8 rounded-[40px] shadow-2xl text-white">
             <div className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-2">هامش التباين المالي</div>
             <div className="text-3xl font-black">{Math.round(((totalEstimated - totalActual) / totalEstimated) * 100) || 0}%</div>
          </div>
        </div>

        {/* Productivity Table */}
        <section className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden">
           <div className="p-8 border-b border-slate-50">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">كفاءة الأقسام</h2>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-right">
                 <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <tr>
                       <th className="px-8 py-4">القسم</th>
                       <th className="px-8 py-4">المهام النشطة</th>
                       <th className="px-8 py-4">نسبة الإنجاز</th>
                       <th className="px-8 py-4">التكلفة / المهمة</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {spaces.map(space => {
                      const spaceListIds = [...space.lists.map(l => l.id)];
                      const spaceTasks = tasks.filter(t => spaceListIds.includes(t.listId));
                      const done = spaceTasks.filter(t => t.status === TaskStatus.DONE).length;
                      const avgCost = spaceTasks.length > 0 ? (spaceTasks.reduce((acc, t) => acc + (t.productionData.actualCost || 0), 0) / spaceTasks.length) : 0;
                      
                      return (
                        <tr key={space.id} className="hover:bg-slate-50 transition-colors">
                           <td className="px-8 py-6 font-black text-slate-800">{space.name}</td>
                           <td className="px-8 py-6 text-sm font-bold">{spaceTasks.length}</td>
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                 <div className="w-24 bg-slate-100 h-2 rounded-full">
                                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${(done/spaceTasks.length)*100}%` }}></div>
                                 </div>
                                 <span className="text-xs font-black">{Math.round((done/spaceTasks.length)*100) || 0}%</span>
                              </div>
                           </td>
                           <td className="px-8 py-6 text-sm font-black text-slate-600">{Math.round(avgCost)} JOD</td>
                        </tr>
                      );
                    })}
                 </tbody>
              </table>
           </div>
        </section>
      </div>
    </div>
  );
};

export default ReportsView;
