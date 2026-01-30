
import React from 'react';
import { Workspace, Task, TaskStatus } from '../types';

interface Props {
  workspace: Workspace;
  tasks: Task[];
}

const PortfolioView: React.FC<Props> = ({ workspace, tasks }) => {
  return (
    <div className="flex-1 overflow-auto bg-[#FAFAFC] p-12 custom-scrollbar">
      <header className="mb-12 flex justify-between items-end">
         <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">محافظ المشاريع (Portfolios) 📊</h1>
            <p className="text-slate-400 text-xs font-bold mt-2">نظرة بانورامية على صحة المجلدات والعمليات التشغيلية.</p>
         </div>
         <div className="flex gap-4">
            <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black text-slate-600 shadow-sm hover:bg-slate-50">تصدير التقرير</button>
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black shadow-lg shadow-indigo-100">+ محفظة جديدة</button>
         </div>
      </header>

      <div className="space-y-6">
        {workspace.spaces.flatMap(s => s.folders).map(folder => {
          const folderLists = folder.lists.map(l => l.id);
          const folderTasks = tasks.filter(t => folderLists.includes(t.listId));
          const completedCount = folderTasks.filter(t => t.status === TaskStatus.DONE).length;
          const progress = folderTasks.length > 0 ? (completedCount / folderTasks.length) * 100 : 0;
          const isAtRisk = folderTasks.some(t => t.status === TaskStatus.BLOCKED);

          return (
            <div key={folder.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex items-center gap-12 hover:shadow-xl transition-all group">
              <div className="w-64">
                 <div className="flex items-center gap-4 mb-2">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-xl">📁</div>
                    <div>
                       <h3 className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{folder.name}</h3>
                       <p className="text-[10px] font-bold text-slate-400">الفريق: الإنتاج الفني</p>
                    </div>
                 </div>
              </div>

              <div className="flex-1">
                 <div className="flex justify-between items-end mb-3">
                    <div className="flex items-center gap-4">
                       <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${isAtRisk ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                          {isAtRisk ? '⚠️ متعثر' : '✅ في المسار الصحيح'}
                       </span>
                       <span className="text-[10px] font-black text-slate-300 tracking-widest uppercase">{folderTasks.length} مهام إجمالية</span>
                    </div>
                    <span className="text-sm font-black text-indigo-600">{Math.round(progress)}%</span>
                 </div>
                 <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ${isAtRisk ? 'bg-rose-500' : 'bg-indigo-600'}`} style={{ width: `${Math.max(progress, 5)}%` }}></div>
                 </div>
              </div>

              <div className="w-48 flex justify-end gap-3">
                 <div className="text-center">
                    <div className="text-[9px] font-black text-slate-400 uppercase mb-1">الموعد النهائي</div>
                    <div className="text-xs font-black text-slate-800">12 أغسطس</div>
                 </div>
              </div>
            </div>
          );
        })}
        
        {workspace.spaces.flatMap(s=>s.folders).length === 0 && (
          <div className="py-20 text-center opacity-20">
             <div className="text-8xl mb-6">📈</div>
             <p className="text-xl font-black">لا توجد محافظ نشطة حالياً. أنشئ مجلدات لتتبعها هنا.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioView;
