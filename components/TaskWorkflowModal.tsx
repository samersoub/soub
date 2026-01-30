
import React, { useState } from 'react';
import { Task, TaskStatus, Department, WORKFLOW_ORDER, User, ChecklistItem, ProductionIssue, UserRole } from '../types';

interface Props {
  task: Task;
  user: User;
  workspace: any;
  onClose: () => void;
  onUpdate: (updatedTask: Task) => void;
}

const TaskWorkflowModal: React.FC<Props> = ({ task, user, workspace, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<Department>(task.currentDepartment);
  const [issueDesc, setIssueDesc] = useState('');
  const [showIssueForm, setShowIssueForm] = useState(false);

  const canEdit = (user.department === task.currentDepartment || user.role === 'ADMIN') && task.status !== TaskStatus.BLOCKED;
  const currentChecklist = task.productionData.checklists[task.currentDepartment] || [];
  const isChecklistComplete = currentChecklist.length > 0 ? currentChecklist.every(i => i.isCompleted) : true;

  const toggleCheckItem = (itemId: string) => {
    if (!canEdit) return;
    const updatedChecklist = currentChecklist.map(item => 
      item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
    );
    onUpdate({
      ...task,
      productionData: {
        ...task.productionData,
        checklists: { ...task.productionData.checklists, [task.currentDepartment]: updatedChecklist }
      }
    });
  };

  const reportIssue = () => {
    if (!issueDesc) return;
    const newIssue: ProductionIssue = {
      id: Math.random().toString(),
      reportedBy: user.name,
      department: user.department || Department.PRODUCTION,
      description: issueDesc,
      type: 'OTHER',
      createdAt: new Date().toISOString()
    };
    onUpdate({
      ...task,
      status: TaskStatus.BLOCKED,
      productionData: {
        ...task.productionData,
        issues: [...task.productionData.issues, newIssue]
      },
      activities: [{ id: Date.now(), userName: user.name, action: `🚨 قام بتعطيل العمل: ${issueDesc}`, timestamp: new Date().toISOString() }, ...task.activities]
    });
    setIssueDesc('');
    setShowIssueForm(false);
  };

  const resolveIssue = () => {
    onUpdate({
      ...task,
      status: TaskStatus.IN_PROGRESS,
      productionData: {
        ...task.productionData,
        issues: task.productionData.issues.map(iss => iss.resolvedAt ? iss : { ...iss, resolvedAt: new Date().toISOString() })
      },
      activities: [{ id: Date.now(), userName: user.name, action: `✅ تم حل المشكلة واستئناف العمل`, timestamp: new Date().toISOString() }, ...task.activities]
    });
  };

  const moveToNextStage = () => {
    const currentIndex = WORKFLOW_ORDER.indexOf(task.currentDepartment);
    const nextDept = WORKFLOW_ORDER[currentIndex + 1];
    
    if (!isChecklistComplete) {
      alert("يرجى إنهاء كافة بنود الجودة للمرحلة الحالية أولاً!");
      return;
    }

    if (nextDept) {
      onUpdate({
        ...task,
        currentDepartment: nextDept,
        status: TaskStatus.TODO,
        activities: [{ id: Date.now(), userName: user.name, action: `تم اعتماد جودة مرحلة ${task.currentDepartment} ونقلها لـ ${nextDept}`, timestamp: new Date().toISOString() }, ...task.activities]
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
      <div className="bg-white w-full max-w-6xl rounded-[48px] shadow-2xl flex flex-col max-h-[95vh] overflow-hidden border-8 border-slate-100">
        
        {/* Header Section */}
        <div className={`p-8 flex justify-between items-start transition-colors ${task.status === TaskStatus.BLOCKED ? 'bg-rose-50' : 'bg-slate-50'}`}>
           <div>
              <div className="flex items-center gap-4 mb-2">
                 <h2 className="text-3xl font-black text-slate-900">{task.title}</h2>
                 {task.status === TaskStatus.BLOCKED && (
                   <span className="bg-rose-500 text-white px-4 py-1 rounded-full text-[10px] font-black animate-pulse">متوقف بسبب عطل فني ⚠️</span>
                 )}
              </div>
              <p className="text-slate-500 text-xs font-bold">معرف المشروع: {task.id} | القسم الحالي: {task.currentDepartment}</p>
           </div>
           <button onClick={onClose} className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-xl hover:bg-slate-100 transition-all">✕</button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Quality Gates Panel */}
          <div className="w-80 bg-slate-50 border-l border-slate-200 p-8 overflow-y-auto custom-scrollbar">
             <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                بوابات جودة المرحلة
             </h3>
             
             <div className="space-y-4">
                {currentChecklist.length === 0 ? (
                  <p className="text-[10px] text-slate-400 font-bold italic">لا توجد شروط جودة محددة لهذه المرحلة.</p>
                ) : (
                  currentChecklist.map(item => (
                    <div 
                      key={item.id} 
                      onClick={() => toggleCheckItem(item.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                        item.isCompleted ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center ${item.isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`}>
                         {item.isCompleted && '✓'}
                      </div>
                      <span className={`text-[11px] font-black ${item.isCompleted ? 'text-emerald-700' : 'text-slate-600'}`}>{item.label}</span>
                    </div>
                  ))
                )}
             </div>

             <div className="mt-10 p-6 bg-indigo-900 rounded-[32px] text-white">
                <div className="text-[9px] font-black uppercase opacity-60 mb-2">حالة التقدم</div>
                <div className="text-2xl font-black">{Math.round((currentChecklist.filter(i=>i.isCompleted).length / (currentChecklist.length || 1)) * 100)}%</div>
                <div className="w-full bg-white/20 h-1.5 rounded-full mt-4 overflow-hidden">
                   <div className="bg-emerald-400 h-full" style={{ width: `${(currentChecklist.filter(i=>i.isCompleted).length / (currentChecklist.length || 1)) * 100}%` }}></div>
                </div>
             </div>
          </div>

          {/* Activity & Issues Panel */}
          <div className="flex-1 p-10 overflow-y-auto custom-scrollbar space-y-12">
             {/* Issues Section */}
             {task.productionData.issues.length > 0 && (
               <section>
                  <label className="text-xs font-black text-rose-600 mb-4 block">سجل المعيقات والمشاكل الفنية 🚨</label>
                  <div className="space-y-3">
                     {task.productionData.issues.map(iss => (
                        <div key={iss.id} className={`p-4 rounded-2xl border ${iss.resolvedAt ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-rose-50 border-rose-100'}`}>
                           <div className="flex justify-between items-start mb-2">
                              <span className="text-[10px] font-black text-rose-700">{iss.reportedBy} ({iss.department})</span>
                              <span className="text-[9px] text-slate-400">{new Date(iss.createdAt).toLocaleString()}</span>
                           </div>
                           <p className="text-xs font-bold text-slate-800">{iss.description}</p>
                           {iss.resolvedAt && <p className="text-[9px] text-emerald-600 font-black mt-2">✓ تم الحل في: {new Date(iss.resolvedAt).toLocaleString()}</p>}
                        </div>
                     ))}
                  </div>
               </section>
             )}

             {/* Issue Reporting Form */}
             {showIssueForm ? (
               <div className="p-8 bg-rose-50 rounded-[32px] border border-rose-200 animate-in slide-in-from-bottom-4">
                  <h4 className="text-sm font-black text-rose-900 mb-4">وصف المشكلة الفنية بالتفصيل</h4>
                  <textarea 
                    value={issueDesc}
                    onChange={(e) => setIssueDesc(e.target.value)}
                    className="w-full bg-white border border-rose-200 rounded-2xl p-4 text-xs font-bold outline-none mb-4"
                    placeholder="لماذا توقف العمل؟ (مثال: القياسات في الرسم الهندسي غير مطابقة لواقع الصاج...)"
                  />
                  <div className="flex gap-4">
                     <button onClick={reportIssue} className="px-6 py-3 bg-rose-600 text-white rounded-xl text-[10px] font-black">تأكيد التعطيل 🛑</button>
                     <button onClick={() => setShowIssueForm(false)} className="px-6 py-3 text-slate-400 font-black text-[10px]">إلغاء</button>
                  </div>
               </div>
             ) : (
               task.status !== TaskStatus.BLOCKED && (
                 <button onClick={() => setShowIssueForm(true)} className="w-full py-4 border-2 border-dashed border-rose-200 rounded-[28px] text-rose-400 text-xs font-black hover:bg-rose-50 transition-all">
                    + الإبلاغ عن مشكلة فنية / تعطيل العمل
                 </button>
               )
             )}

             {task.status === TaskStatus.BLOCKED && user.role === UserRole.ADMIN && (
               <button onClick={resolveIssue} className="w-full py-6 bg-emerald-600 text-white rounded-[32px] font-black text-sm shadow-xl shadow-emerald-100">
                  تم حل المشكلة - استئناف دورة الإنتاج ✅
               </button>
             )}

             {/* Activities Trail */}
             <section>
                <label className="text-xs font-black text-slate-400 mb-6 block uppercase tracking-widest">سجل المسار الإنتاجي (Audit Trail)</label>
                <div className="space-y-6">
                   {task.activities.map((act: any) => (
                      <div key={act.id} className="flex gap-4 items-start">
                         <div className="w-2 h-2 rounded-full bg-slate-300 mt-1.5 flex-shrink-0"></div>
                         <div>
                            <p className="text-xs font-bold text-slate-800">{act.action}</p>
                            <span className="text-[9px] text-slate-400 font-bold uppercase">{act.userName} • {new Date(act.timestamp).toLocaleTimeString()}</span>
                         </div>
                      </div>
                   ))}
                </div>
             </section>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 border-t border-slate-100 bg-white flex justify-between items-center">
           <div className="flex items-center gap-6">
              <div className="text-center">
                 <div className="text-[9px] font-black text-slate-400 uppercase">تكرار الإعادة</div>
                 <div className="text-lg font-black text-slate-800">{task.productionData.reworkCount}</div>
              </div>
           </div>
           
           <div className="flex gap-4">
              <button 
                disabled={!isChecklistComplete || task.status === TaskStatus.BLOCKED}
                onClick={moveToNextStage}
                className="px-14 py-5 bg-indigo-600 text-white rounded-3xl font-black text-sm shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-30 flex items-center gap-4"
              >
                المرحلة جاهزة للاعتماد 🚀
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TaskWorkflowModal;
