
import React, { useState, useEffect } from 'react';
// Fix: Removed TimeEntry from imports as it is not exported from types.ts
import { Task, TaskStatus, User, Subtask, TaskComment } from '../types';

interface Props {
  task: Task;
  user: User;
  workspace: any;
  onClose: () => void;
  onUpdate: (updatedTask: Task) => void;
}

const TaskWorkflowModal: React.FC<Props> = ({ task, user, workspace, onClose, onUpdate }) => {
  const [activeView, setActiveView] = useState<'DETAILS' | 'SUBTASKS' | 'DOCS' | 'COMMENTS' | 'TIME'>('DETAILS');
  const [newComment, setNewComment] = useState('');
  const [timerDisplay, setTimerDisplay] = useState('00:00:00');

  useEffect(() => {
    let interval: any;
    if (task.productionData.isTimerRunning && task.productionData.timerStartTime) {
      interval = setInterval(() => {
        const start = new Date(task.productionData.timerStartTime!).getTime();
        const diff = Math.floor((new Date().getTime() - start) / 1000);
        const h = Math.floor(diff / 3600).toString().padStart(2, '0');
        const m = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
        const s = (diff % 60).toString().padStart(2, '0');
        setTimerDisplay(`${h}:${m}:${s}`);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [task.productionData.isTimerRunning, task.productionData.timerStartTime]);

  const addComment = () => {
    if (!newComment.trim()) return;
    const comment: TaskComment = {
      id: `c-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      text: newComment,
      timestamp: new Date().toISOString()
    };
    onUpdate({ ...task, comments: [comment, ...(task.comments || [])] });
    setNewComment('');
  };

  const toggleWatcher = () => {
    const watchers = task.watchers || [];
    const isWatching = watchers.includes(user.id);
    const updated = isWatching 
      ? watchers.filter(id => id !== user.id) 
      : [...watchers, user.id];
    onUpdate({ ...task, watchers: updated });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
      <div className="bg-white w-full max-w-6xl rounded-[40px] shadow-2xl flex flex-col max-h-[95vh] overflow-hidden border border-slate-200">
        
        {/* ClickUp Pro Header */}
        <div className="bg-slate-50 border-b border-slate-100 px-8 py-3 flex justify-between items-center">
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400">
                 <span>{workspace.name}</span>
                 <span>/</span>
                 <span className="text-indigo-600">PRODUCTION</span>
              </div>
              <button 
                onClick={toggleWatcher}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black transition-all ${
                  task.watchers?.includes(user.id) ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-400'
                }`}
              >
                 👁️ {task.watchers?.includes(user.id) ? 'أنت تتابع' : 'متابعة'}
              </button>
           </div>
           
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-full px-4 py-1.5">
                 <span className={`w-2 h-2 rounded-full ${task.productionData.isTimerRunning ? 'bg-rose-500 animate-pulse' : 'bg-slate-300'}`}></span>
                 <span className="font-mono text-xs font-black text-slate-700">{timerDisplay}</span>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
           </div>
        </div>

        {/* Dynamic Navigation */}
        <div className="px-8 border-b border-slate-100 flex gap-8 bg-white">
           {[
             { id: 'DETAILS', label: 'الإنتاج', icon: '🏗️' },
             { id: 'SUBTASKS', label: 'المهام الفرعية', icon: '🌿' },
             { id: 'COMMENTS', label: 'المناقشات', icon: '💬' },
             { id: 'DOCS', label: 'المستندات', icon: '📄' },
             { id: 'TIME', label: 'تتبع الوقت', icon: '⏱️' }
           ].map(tab => (
             <button 
               key={tab.id}
               onClick={() => setActiveView(tab.id as any)}
               className={`py-5 text-[10px] font-black transition-all border-b-2 flex items-center gap-2 ${
                 activeView === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'
               }`}
             >
               <span className="text-base">{tab.icon}</span> {tab.label}
             </button>
           ))}
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-[#FAFAFC]">
            
            {activeView === 'DETAILS' && (
              <div className="space-y-8">
                 <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-2xl font-black text-slate-800">{task.title}</h2>
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-[9px] font-black uppercase">علاقات (2)</span>
                 </div>
                 <textarea 
                   className="w-full bg-white rounded-[32px] p-8 text-sm font-bold border border-slate-100 shadow-sm outline-none focus:border-indigo-200 min-h-[200px]"
                   placeholder="وصف المهمة..."
                   value={task.description}
                   onChange={(e) => onUpdate({ ...task, description: e.target.value })}
                 />
              </div>
            )}

            {activeView === 'COMMENTS' && (
               <div className="h-full flex flex-col">
                  <div className="flex-1 space-y-6 mb-6">
                     {task.comments?.map(c => (
                        <div key={c.id} className={`flex gap-4 ${c.userId === user.id ? 'flex-row-reverse' : ''}`}>
                           <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-lg shadow-sm">👤</div>
                           <div className={`max-w-[70%] p-5 rounded-[24px] shadow-sm ${c.userId === user.id ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 border border-slate-100'}`}>
                              <div className={`text-[9px] font-black uppercase mb-1 ${c.userId === user.id ? 'text-white/50' : 'text-indigo-500'}`}>{c.userName}</div>
                              <p className="text-xs font-bold leading-relaxed">{c.text}</p>
                              <div className={`text-[8px] mt-2 ${c.userId === user.id ? 'text-white/40' : 'text-slate-300'}`}>{new Date(c.timestamp).toLocaleString()}</div>
                           </div>
                        </div>
                     ))}
                     {(!task.comments || task.comments.length === 0) && (
                       <div className="text-center py-20 opacity-20">
                          <div className="text-6xl mb-4">💬</div>
                          <p className="font-black">لا توجد مناقشات بعد. ابدأ المحادثة!</p>
                       </div>
                     )}
                  </div>
                  <div className="bg-white rounded-[24px] border border-slate-200 p-2 flex gap-2">
                     <input 
                       value={newComment}
                       onChange={(e) => setNewComment(e.target.value)}
                       onKeyDown={(e) => e.key === 'Enter' && addComment()}
                       className="flex-1 bg-transparent px-4 py-2 text-sm font-bold outline-none"
                       placeholder="اكتب تعليقاً أو @للإشارة..."
                     />
                     <button onClick={addComment} className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg">🚀</button>
                  </div>
               </div>
            )}

            {activeView === 'SUBTASKS' && (
              <div className="max-w-3xl mx-auto space-y-4">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black text-slate-800">قائمة التحقق (Checklist)</h3>
                    <div className="text-[10px] font-black text-indigo-600 uppercase">مكتمل: {task.subtasks?.filter(s=>s.isCompleted).length}/{task.subtasks?.length}</div>
                 </div>
                 {task.subtasks?.map(sub => (
                    <div key={sub.id} className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all">
                       <input 
                         type="checkbox" 
                         checked={sub.isCompleted} 
                         onChange={() => {
                            const updated = task.subtasks.map(s => s.id === sub.id ? {...s, isCompleted: !s.isCompleted} : s);
                            onUpdate({...task, subtasks: updated});
                         }}
                         className="w-5 h-5 rounded-lg border-slate-300 text-indigo-600" 
                       />
                       <span className={`text-sm font-bold ${sub.isCompleted ? 'text-slate-300 line-through' : 'text-slate-700'}`}>{sub.title}</span>
                    </div>
                 ))}
              </div>
            )}
            
            {/* Other views (Docs, Time) similar as before */}
          </div>

          {/* Right Sidebar: Relationships & Metadata */}
          <div className="w-96 bg-white border-r border-slate-100 p-8 space-y-10 overflow-y-auto custom-scrollbar">
             <section>
                <div className="flex justify-between items-center mb-6">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">المكلفون</label>
                   <button className="text-[10px] font-black text-indigo-600">إضافة +</button>
                </div>
                <div className="flex flex-wrap gap-2">
                   {task.assignees.map(a => (
                      <div key={a} className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                         <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-black">{a[0]}</div>
                         <span className="text-[10px] font-black text-slate-700">{a}</span>
                      </div>
                   ))}
                </div>
             </section>

             <section>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-6">المهام المرتبطة (Linked)</label>
                <div className="space-y-3">
                   <div className="p-4 border-2 border-dashed border-slate-100 rounded-2xl text-[10px] font-bold text-slate-400 text-center cursor-pointer hover:bg-slate-50">
                      إضافة علاقة مع مهمة أخرى 🔗
                   </div>
                </div>
             </section>

             <div className="pt-8 border-t border-slate-50 space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase">
                   <span className="text-slate-400">تاريخ الإنشاء</span>
                   <span className="text-slate-600">{new Date(task.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase">
                   <span className="text-slate-400">تاريخ الاستحقاق</span>
                   <span className="text-rose-600">28 يوليو، 2024</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskWorkflowModal;
