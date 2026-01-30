
import React from 'react';
import { Task, User } from '../types';

interface Props {
  tasks: Task[];
  users: User[];
}

const TimesheetsView: React.FC<Props> = ({ tasks, users }) => {
  return (
    <div className="flex-1 p-12 bg-[#F8FAF9] overflow-y-auto custom-scrollbar" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex justify-between items-end">
           <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">سجلات الدوام (Timesheets) ⏱️</h1>
              <p className="text-slate-400 font-bold mt-2">تحليل الوقت المستغرق في الإنتاج وتحسين الكفاءة التشغيلية.</p>
           </div>
           <div className="flex gap-4">
              <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all">تحميل التقرير PDF</button>
              <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black shadow-lg shadow-indigo-100">+ إضافة وقت يدوي</button>
           </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
           <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">إجمالي الساعات هذا الأسبوع</div>
              <div className="text-4xl font-black text-indigo-600">1,240 <span className="text-sm">ساعة</span></div>
           </div>
           <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">الموظف الأكثر إنتاجاً</div>
              <div className="text-4xl font-black text-emerald-500">أحمد <span className="text-sm">48س</span></div>
           </div>
           <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">متوسط وقت المهمة</div>
              <div className="text-4xl font-black text-amber-500">3.5 <span className="text-sm">ساعة</span></div>
           </div>
        </div>

        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
           <table className="w-full text-right border-collapse">
              <thead>
                 <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase">الموظف</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase">المهمة</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase">التاريخ</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase text-center">الوقت المسجل</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                 {tasks.slice(0, 10).map(task => (
                    <tr key={task.id} className="hover:bg-slate-50/80 transition-all">
                       <td className="p-6">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-[10px] font-black text-indigo-600 uppercase">{task.assignees[0]?.[0] || '؟'}</div>
                             <span className="text-xs font-black text-slate-800">{task.assignees[0] || 'غير محدد'}</span>
                          </div>
                       </td>
                       <td className="p-6">
                          <div className="text-xs font-black text-slate-700">{task.title}</div>
                          <div className="text-[9px] text-slate-400 font-bold uppercase">{task.currentDepartment}</div>
                       </td>
                       <td className="p-6 text-[11px] font-bold text-slate-500">2024-02-15</td>
                       <td className="p-6 text-center">
                          <span className="bg-indigo-50 text-indigo-600 px-4 py-1 rounded-full text-[10px] font-black">2س 30د</span>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};

export default TimesheetsView;
