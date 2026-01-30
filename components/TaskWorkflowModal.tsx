
import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, User, Subtask, TaskComment, Department, WORKFLOW_ORDER } from '../types';

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

  const handleStatusChange = (status: string) => {
    onUpdate({ ...task, status });
  };

  const handleDeptChange = (dept: Department) => {
    onUpdate({ ...task, currentDepartment: dept });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
      <div className="bg-white w-full max-w-6xl rounded-[40px] shadow-2xl flex flex-col max-h-[95vh] overflow-hidden border border-slate-200">
        
        {/* Header with Status Picker */}
        <div className="bg-slate-50 border-b border-slate-100 px-8 py-3 flex justify-between items-center">
           <div className="flex items-center gap-4">
              <select 
                value={task.status} 
                onChange={(e) => handleStatusChange(e.target.value)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase outline-none shadow-sm ${
                  task.status === TaskStatus.DONE ? 'bg-emerald-500 text-white' : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              
              <div className="w-px h-4 bg-slate-200"></div>

              <select 
                value={task.currentDepartment} 
                onChange={(e) => handleDeptChange(e.target.value as Department)}
                className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-[10px] font-black outline-none"
              >
                {WORKFLOW_ORDER.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
           </div>
           
           <div className="flex items-center gap-6">
              <button 
                onClick={() => onUpdate({...task, productionData: {...task.productionData, isTimerRunning: !task.productionData.isTimerRunning, timerStartTime: !task.productionData.isTimerRunning ? new Date().toISOString() : task.productionData.timerStartTime}})}
                className={`flex items-center gap-3 border rounded-full px-4 py-1.5 transition-all ${task.productionData.isTimerRunning ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-200'}`}
              >
                 <span className={`w-2 h-2 rounded-full ${task.productionData.isTimerRunning ? 'bg-rose-500 animate-pulse' : 'bg-slate-300'}`}></span>
                 <span className="font-mono text-xs font-black text-slate-700">{timerDisplay}</span>
              </button>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
           </div>
        </div>

        {/* Dynamic Navigation */}
        <div className="px-8 border-b border-slate-100 flex gap-8 bg-white">
           {[
             { id: 'DETAILS', label: 'الإنتاج', icon: '🏗️' },
             { id: 'SUBTASKS', label: 'قائمة التحقق', icon: '🌿' },
             { id: 'COMMENTS', label: 'المناقشات', icon: '💬' },
             { id: 'DOCS', label: 'المرفقات', icon: '📄' },
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

        <div className="flex-1 flex overflow-hidden bg-[#FAFAFC]">
          <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
            
            {activeView === 'DETAILS' && (
              <div className="max-w-4xl mx-auto space-y-10">
                 <div>
                    <input 
                      className="text-3xl font-black text-slate-800 bg-transparent border-none outline-none w-full mb-4"
                      value={task.title}
                      onChange={(e) => onUpdate({...task, title: e.target.value})}
                      placeholder="عنوان المهمة..."
                    />
                    <div className="flex gap-4">
                       <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-500 hover:bg-slate-50 transition-all">
                          <span>🏳️</span> {task.priority}
                       </button>
                       <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-500 hover:bg-slate-50 transition-all">
                          <span>🔗</span> إضافة علاقة
                       </button>
                    </div>
                 </div>

                 <textarea 
                   className="w-full bg-white rounded-[32px] p-8 text-sm font-bold border border-slate-100 shadow-sm outline-none focus:border-indigo-200 min-h-[300px] leading-relaxed"
                   placeholder="وصف المهمة الفني..."
                   value={task.description}
                   onChange={(e) => onUpdate({ ...task, description: e.target.value })}
                 />
              </div>
            )}

            {activeView === 'COMMENTS' && (
               <div className="h-full flex flex-col max-w-4xl mx-auto">
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
                  </div>
                  <div className="bg-white rounded-[24px] border border-slate-200 p-2 flex gap-2 shadow-xl">
                     <input 
                       value={newComment}
                       onChange={(e) => setNewComment(e.target.value)}
                       onKeyDown={(e) => e.key === 'Enter' && addComment()}
                       className="flex-1 bg-transparent px-6 py-2 text-sm font-bold outline-none"
                       placeholder="اكتب تعليقاً فنياً..."
                     />
                     <button onClick={addComment} className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors">🚀</button>
                  </div>
               </div>
            )}

            {activeView === 'SUBTASKS' && (
              <div className="max-w-2xl mx-auto space-y-4">
                 <div className="flex justify-between items-center mb-8">
                    <h3 className="font-black text-slate-800">قائمة المهام الفرعية</h3>
                    <button 
                      onClick={() => {
                        const newSub: Subtask = { id: `sub-${Date.now()}`, title: 'مهمة فرعية جديدة', isCompleted: false };
                        onUpdate({...task, subtasks: [...task.subtasks, newSub]});
                      }}
                      className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full hover:bg-indigo-100"
                    >
                      + إضافة خطوة
                    </button>
                 </div>
                 {task.subtasks?.map(sub => (
                    <div key={sub.id} className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all group">
                       <input 
                         type="checkbox" 
                         checked={sub.isCompleted} 
                         onChange={() => {
                            const updated = task.subtasks.map(s => s.id === sub.id ? {...s, isCompleted: !s.isCompleted} : s);
                            onUpdate({...task, subtasks: updated});
                         }}
                         className="w-5 h-5 rounded-lg border-slate-300 text-indigo-600 cursor-pointer" 
                       />
                       <input 
                         className={`flex-1 bg-transparent border-none outline-none text-sm font-bold ${sub.isCompleted ? 'text-slate-300 line-through' : 'text-slate-700'}`}
                         value={sub.title}
                         onChange={(e) => {
                            const updated = task.subtasks.map(s => s.id === sub.id ? {...s, title: e.target.value} : s);
                            onUpdate({...task, subtasks: updated});
                         }}
                       />
                       <button 
                         onClick={() => onUpdate({...task, subtasks: task.subtasks.filter(s => s.id !== sub.id)})}
                         className="opacity-0 group-hover:opacity-100 text-rose-500 text-xs font-black transition-opacity"
                       >
                         حذف
                       </button>
                    </div>
                 ))}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="w-80 bg-white border-r border-slate-100 p-8 space-y-10 overflow-y-auto custom-scrollbar">
             <section>
                <div className="flex justify-between items-center mb-6">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">المكلفون</label>
                   <button className="text-[10px] font-black text-indigo-600">إضافة +</button>
                </div>
                <div className="flex flex-wrap gap-2">
                   {task.assignees.map(a => (
                      <div key={a} className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 w-full">
                         <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-black">{a[0].toUpperCase()}</div>
                         <span className="text-[10px] font-black text-slate-700">{a}</span>
                         <button className="mr-auto text-slate-300 hover:text-rose-500">✕</button>
                      </div>
                   ))}
                   {task.assignees.length === 0 && <p className="text-[10px] font-bold text-slate-300 italic">لا يوجد مكلفين</p>}
                </div>
             </section>

             <section>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">التواريخ</label>
                <div className="space-y-4">
                   <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400">تاريخ الإنشاء</span>
                      <span className="text-[10px] font-black text-slate-800">{new Date(task.createdAt).toLocaleDateString('ar-EG')}</span>
                   </div>
                   <div className="p-4 bg-rose-50 rounded-2xl flex items-center justify-between border border-rose-100">
                      <span className="text-[10px] font-black text-rose-600">الموعد النهائي</span>
                      <span className="text-[10px] font-black text-rose-600 font-mono">15 / 08 / 2024</span>
                   </div>
                </div>
             </section>

             <div className="pt-8 border-t border-slate-50 text-center">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-4">Jordan Advanced Metal Forming</p>
                <div className="text-[8px] font-bold text-slate-200 uppercase tracking-[0.3em]">Designed by ssoub</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskWorkflowModal;
