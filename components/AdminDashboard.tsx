
import React, { useState } from 'react';
import { Workspace, Space, Folder, List, Department, User, UserRole, TaskStatus, Automation } from '../types';

interface Props {
  workspace: Workspace;
  users: User[];
  onUpdateWorkspace: (w: Workspace) => void;
  onUpdateUsers: (u: User[]) => void;
  onReset: () => void;
}

const AdminDashboard: React.FC<Props> = ({ workspace, users, onUpdateWorkspace, onUpdateUsers, onReset }) => {
  const [activeTab, setActiveTab] = useState<'org' | 'users' | 'auto'>('org');
  
  // Space Management
  const [newSpaceName, setNewSpaceName] = useState('');
  const [newSpaceDept, setNewSpaceDept] = useState<Department>(Department.PLANNING);
  
  // Automation State
  const [newAutoTrigger, setNewAutoTrigger] = useState<any>('STATUS_CHANGED');
  const [newAutoAction, setNewAutoAction] = useState<any>('NOTIFY');

  const addAutomation = () => {
    const newAuto: Automation = {
      id: `auto-${Date.now()}`,
      name: `Automation ${workspace.automations.length + 1}`,
      trigger: newAutoTrigger,
      action: newAutoAction
    };
    onUpdateWorkspace({ ...workspace, automations: [...workspace.automations, newAuto] });
  };

  const deleteAutomation = (id: string) => {
    onUpdateWorkspace({ ...workspace, automations: workspace.automations.filter(a => a.id !== id) });
  };

  return (
    <div className="flex-1 overflow-y-auto p-10 bg-[#f8fafc] custom-scrollbar" dir="rtl">
      <div className="max-w-6xl mx-auto pb-20">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">إدارة JAMCO 🛡️</h1>
            <p className="text-slate-500 mt-2 font-bold text-sm tracking-wide">التحكم المركزي في الموارد والهيكلية التنظيمية</p>
          </div>
          <button onClick={onReset} className="px-6 py-3 bg-white border border-rose-100 text-rose-500 rounded-2xl text-[10px] font-black hover:bg-rose-500 hover:text-white transition-all shadow-sm">إعادة ضبط المصنع</button>
        </header>

        <nav className="flex gap-2 p-1 bg-white border border-slate-100 rounded-2xl shadow-sm mb-12 w-fit">
          {[
            { id: 'org', label: 'الهيكلية الهرمية', icon: '🏗️' },
            { id: 'users', label: 'الموظفين والصلاحيات', icon: '👥' },
            { id: 'auto', label: 'الأتمتة الذكية', icon: '⚡' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-8 py-3 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:text-slate-600'}`}>
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </nav>

        {activeTab === 'org' && (
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <section className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                 <h2 className="text-xl font-black mb-6">إضافة قسم جديد</h2>
                 <div className="space-y-4">
                    <input value={newSpaceName} onChange={e => setNewSpaceName(e.target.value)} placeholder="اسم القسم" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:bg-white transition-all" />
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none">
                       {Object.values(Department).map(d => <option key={d}>{d}</option>)}
                    </select>
                    <button onClick={() => {
                       if(!newSpaceName) return;
                       onUpdateWorkspace({...workspace, spaces: [...workspace.spaces, { id:`s-${Date.now()}`, name: newSpaceName, department: Department.PLANNING, icon:'🏭', color:'#6366f1', folders:[], lists:[] }]});
                       setNewSpaceName('');
                    }} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs shadow-xl shadow-indigo-100">إضافة القسم</button>
                 </div>
              </section>

              <div className="space-y-4">
                 <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-4">الأقسام الحالية</h3>
                 {workspace.spaces.map(s => (
                    <div key={s.id} className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center justify-between">
                       <span className="font-black text-slate-800">{s.name}</span>
                       <button onClick={() => onUpdateWorkspace({...workspace, spaces: workspace.spaces.filter(x=>x.id !== s.id)})} className="text-rose-400 hover:text-rose-600 text-[10px] font-black">حذف</button>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {activeTab === 'auto' && (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-1 bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 h-fit">
                 <h2 className="text-xl font-black mb-8">إنشاء قاعدة أتمتة ⚡</h2>
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">عندما يحدث (Trigger)</label>
                       <select value={newAutoTrigger} onChange={e => setNewAutoTrigger(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-xs font-black outline-none">
                          <option value="STATUS_CHANGED">تغيرت حالة المهمة</option>
                          <option value="TASK_CREATED">تم إنشاء مهمة جديدة</option>
                          <option value="DUE_DATE_NEAR">اقترب موعد الاستحقاق</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">قم بـ (Action)</label>
                       <select value={newAutoAction} onChange={e => setNewAutoAction(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-xs font-black outline-none">
                          <option value="NOTIFY">إرسال إشعار فوري</option>
                          <option value="SET_ASSIGNEE">تعيين موظف تلقائي</option>
                          <option value="MOVE_LIST">نقل المهمة لقائمة أخرى</option>
                       </select>
                    </div>
                    <button onClick={addAutomation} className="w-full py-4 bg-amber-500 text-white rounded-2xl font-black text-xs shadow-xl shadow-amber-100 hover:bg-amber-600 transition-all">تفعيل القاعدة الآن</button>
                 </div>
              </div>

              <div className="lg:col-span-2 space-y-4">
                 <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-4">القواعد المفعلة ({workspace.automations.length})</h3>
                 {workspace.automations.map(auto => (
                    <div key={auto.id} className="bg-white p-8 rounded-[32px] border border-slate-100 flex items-center justify-between group shadow-sm hover:shadow-md transition-all">
                       <div className="flex items-center gap-6">
                          <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center text-xl">⚡</div>
                          <div>
                             <div className="text-sm font-black text-slate-800">{auto.trigger} → {auto.action}</div>
                             <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Active System Rule</div>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-6 bg-emerald-500 rounded-full relative">
                             <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                          </div>
                          <button onClick={() => deleteAutomation(auto.id)} className="text-slate-300 hover:text-rose-500 transition-colors">✕</button>
                       </div>
                    </div>
                 ))}
                 {workspace.automations.length === 0 && (
                    <div className="py-20 text-center opacity-20 border-2 border-dashed border-slate-200 rounded-[40px]">
                       <p className="font-black">لا توجد أتمتة مفعلة. ابدأ بتعريف القواعد لتوفير الوقت!</p>
                    </div>
                 )}
              </div>
           </div>
        )}

        {activeTab === 'users' && (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-1 bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 h-fit">
                 <h2 className="text-xl font-black mb-8">إضافة موظف 👤</h2>
                 <div className="space-y-4">
                    <input placeholder="الاسم الكامل" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:bg-white transition-all" />
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none">
                       {Object.values(UserRole).map(r => <option key={r}>{r}</option>)}
                    </select>
                    <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs shadow-xl shadow-indigo-100">إنشاء حساب</button>
                 </div>
              </div>
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                 {users.map(u => (
                    <div key={u.id} className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
                       <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl">{u.avatar}</div>
                       <div>
                          <div className="text-sm font-black text-slate-800">{u.name}</div>
                          <div className="text-[10px] font-black text-indigo-500 uppercase">{u.role}</div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
