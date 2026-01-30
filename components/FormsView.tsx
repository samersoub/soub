
import React, { useState } from 'react';
import { AppForm, Workspace, List, Task, TaskStatus, Department } from '../types';

interface Props {
  workspace: Workspace;
  onAddTask: (task: Task) => void;
}

const FormsView: React.FC<Props> = ({ workspace, onAddTask }) => {
  const [activeForm, setActiveForm] = useState<AppForm | null>(workspace.forms[0] || null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeForm) return;

    const newTask: Task = {
      id: `task-form-${Date.now()}`,
      title: formData[activeForm.fields[0].id] || 'طلب جديد من النموذج',
      description: Object.entries(formData).map(([k, v]) => `${activeForm.fields.find(f=>f.id===k)?.label}: ${v}`).join('\n'),
      status: TaskStatus.TODO,
      currentDepartment: Department.PLANNING,
      priority: 'NORMAL',
      assignees: [],
      watchers: [],
      listId: activeForm.targetListId,
      createdAt: new Date().toISOString(),
      subtasks: [],
      productionData: { issues: [], customFields: {} },
      comments: []
    };

    onAddTask(newTask);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setFormData({});
  };

  return (
    <div className="flex-1 flex bg-[#FAFAFC] animate-in fade-in duration-500" dir="rtl">
      <div className="w-80 border-l border-slate-100 bg-white p-8">
        <h2 className="text-xl font-black text-slate-800 mb-8">النماذج النشطة 📝</h2>
        <div className="space-y-4">
          {workspace.forms.map(f => (
            <button 
              key={f.id}
              onClick={() => setActiveForm(f)}
              className={`w-full text-right p-4 rounded-2xl text-xs font-black transition-all ${activeForm?.id === f.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {f.title}
            </button>
          ))}
          <button className="w-full py-3 border-2 border-dashed border-slate-100 rounded-2xl text-[10px] font-black text-slate-300 hover:text-indigo-600 hover:border-indigo-100 transition-all">+ إنشاء نموذج جديد</button>
        </div>
      </div>

      <div className="flex-1 p-20 overflow-y-auto custom-scrollbar">
        {activeForm ? (
          <div className="max-w-2xl mx-auto bg-white p-12 rounded-[48px] shadow-2xl border border-slate-100 relative overflow-hidden">
            {isSubmitted && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center animate-in zoom-in-95">
                 <div className="text-6xl mb-6">✅</div>
                 <h3 className="text-2xl font-black text-slate-800 mb-2">تم إرسال الطلب بنجاح!</h3>
                 <p className="text-slate-400 font-bold">تم إنشاء مهمة جديدة في {workspace.spaces.flatMap(s=>s.lists).find(l=>l.id===activeForm.targetListId)?.name}</p>
              </div>
            )}
            <h1 className="text-3xl font-black text-slate-900 mb-4">{activeForm.title}</h1>
            <p className="text-slate-400 font-bold mb-10">{activeForm.description}</p>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {activeForm.fields.map(field => (
                <div key={field.id} className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest mr-2">{field.label} {field.required && <span className="text-rose-500">*</span>}</label>
                  {field.type === 'textarea' ? (
                    <textarea 
                      required={field.required}
                      value={formData[field.id] || ''}
                      onChange={(e) => setFormData({...formData, [field.id]: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all min-h-[120px]" 
                    />
                  ) : (
                    <input 
                      type="text"
                      required={field.required}
                      value={formData[field.id] || ''}
                      onChange={(e) => setFormData({...formData, [field.id]: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all" 
                    />
                  )}
                </div>
              ))}
              <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-black text-sm shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all">إرسال الطلب الآن 🚀</button>
            </form>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-20">
             <div className="text-9xl mb-10">📋</div>
             <p className="text-2xl font-black">اختر نموذجاً للبدء أو قم بإنشاء واحد جديد</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormsView;
