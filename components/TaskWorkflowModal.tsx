
import React, { useState } from 'react';
import { Task, TaskStatus, User, Subtask, BOMItem, InventoryItem } from '../types';

interface Props {
  task: Task;
  user: User;
  workspace: any;
  onClose: () => void;
  onUpdate: (updatedTask: Task) => void;
}

const TaskWorkflowModal: React.FC<Props> = ({ task, user, workspace, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'SPECS' | 'STEPS' | 'RESOURCES'>('SPECS');
  const [newComment, setNewComment] = useState('');

  return (
    <div className="fixed inset-0 bg-zinc-950/20 backdrop-blur-sm z-[100] flex items-center justify-center p-8 fade-up">
      <div className="bg-white w-full max-w-5xl h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-zinc-200">
        
        {/* Engineering Header */}
        <header className="h-14 border-b border-zinc-100 flex items-center justify-between px-6 bg-zinc-50">
           <div className="flex items-center gap-4">
              <button onClick={onClose} className="text-zinc-400 hover:text-zinc-950 transition-colors">
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
              <div className="h-6 w-px bg-zinc-200"></div>
              <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                 ENGINEERING_SPEC <span className="mx-2 opacity-20">|</span> {task.id.split('-')[1]}
              </div>
           </div>
           
           <div className="flex bg-zinc-200/50 p-1 rounded-sm gap-1">
              {['SPECS', 'STEPS', 'RESOURCES'].map(tab => (
                 <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-6 py-1 text-[9px] font-black tracking-widest uppercase transition-all ${activeTab === tab ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
                 >
                    {tab}
                 </button>
              ))}
           </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Content Area */}
          <div className="flex-[3] overflow-y-auto custom-scrollbar p-12 border-r border-zinc-100">
            <div className="max-w-2xl mx-auto">
               <div className="mb-12">
                  <div className="flex items-center gap-3 mb-4">
                     <span className="text-[9px] font-black text-white bg-indigo-600 px-2 py-1 uppercase tracking-widest">{task.status}</span>
                     <span className="text-[9px] font-black text-zinc-300 uppercase">{task.currentDepartment} UNIT</span>
                  </div>
                  <input 
                    value={task.title} 
                    onChange={e => onUpdate({...task, title: e.target.value})} 
                    className="text-3xl font-black text-zinc-900 w-full outline-none border-none bg-transparent" 
                    placeholder="ENTER_TASK_TITLE..." 
                  />
               </div>

               {activeTab === 'SPECS' && (
                 <div className="space-y-12 animate-soft-fade">
                    <div className="grid grid-cols-2 gap-8 border-t border-zinc-100 pt-8">
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">OWNER_ID</label>
                          <div className="flex items-center gap-3 p-3 bg-zinc-50 border border-zinc-100">
                             <div className="w-5 h-5 bg-zinc-900 text-[9px] font-black text-white flex items-center justify-center uppercase">{task.assignees[0]?.[0] || '?'}</div>
                             <span className="text-[11px] font-bold text-zinc-600">{task.assignees[0] || 'UNASSIGNED'}</span>
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">PRIORITY_LEVEL</label>
                          <select 
                            value={task.priority} 
                            onChange={e => onUpdate({...task, priority: e.target.value as any})}
                            className="w-full p-3 bg-zinc-50 border border-zinc-100 text-[11px] font-bold outline-none appearance-none cursor-pointer"
                          >
                             {['URGENT', 'HIGH', 'NORMAL', 'LOW'].map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">TECHNICAL_NOTES</label>
                       <textarea 
                         value={task.description} 
                         onChange={e => onUpdate({...task, description: e.target.value})} 
                         className="w-full min-h-[350px] bg-zinc-50 border-none p-6 text-sm font-medium text-zinc-800 outline-none leading-relaxed placeholder:text-zinc-200" 
                         placeholder="Enter technical parameters, dimensions, and material requirements..." 
                       />
                    </div>
                 </div>
               )}

               {activeTab === 'STEPS' && (
                 <div className="space-y-6 animate-soft-fade">
                    <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest border-b border-zinc-100 pb-4">Production Workflow</h3>
                    <div className="space-y-2">
                       {task.subtasks?.map(sub => (
                          <div key={sub.id} className="flex items-center gap-4 p-4 border border-zinc-100 bg-white hover:bg-zinc-50 transition-all">
                             <input type="checkbox" checked={sub.isCompleted} className="w-4 h-4 border-zinc-300 rounded-none text-zinc-950 focus:ring-0" />
                             <span className={`text-[12px] font-bold flex-1 ${sub.isCompleted ? 'text-zinc-300 line-through' : 'text-zinc-700'}`}>{sub.title}</span>
                          </div>
                       ))}
                       <button className="w-full py-4 border border-dashed border-zinc-200 text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:border-zinc-900 hover:text-zinc-900 transition-all">+ Add New Step</button>
                    </div>
                 </div>
               )}
            </div>
          </div>

          {/* Activity Log */}
          <div className="flex-1 bg-zinc-50 flex flex-col">
             <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">Activity_Stream</span>
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
             </div>
             <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {task.comments?.map(c => (
                   <div key={c.id} className="space-y-1">
                      <div className="flex justify-between text-[8px] font-black uppercase text-zinc-400">
                         <span>{c.userName}</span>
                         <span>{new Date(c.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                      </div>
                      <div className="bg-white p-3 text-[11px] font-medium text-zinc-700 border border-zinc-100 shadow-sm leading-relaxed">
                         {c.text}
                      </div>
                   </div>
                ))}
             </div>
             <div className="p-4 bg-white border-t border-zinc-100">
                <input 
                   value={newComment}
                   onChange={e => setNewComment(e.target.value)}
                   onKeyDown={e => e.key === 'Enter' && (onUpdate({...task, comments: [{id:`c-${Date.now()}`, userId:user.id, userName:user.name, text:newComment, timestamp:new Date().toISOString()}, ...(task.comments||[])]}), setNewComment(''))}
                   placeholder="Enter log update..." 
                   className="w-full p-3 bg-zinc-50 border border-zinc-100 text-[10px] font-bold outline-none focus:border-indigo-600 transition-all"
                />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskWorkflowModal;
