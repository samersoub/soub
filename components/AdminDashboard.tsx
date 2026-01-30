
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
  
  // Folder/List Management
  const [selectedSpaceId, setSelectedSpaceId] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [itemType, setItemType] = useState<'folder' | 'list'>('list');

  // User Management
  const [newUserName, setNewUserName] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>(UserRole.TECHNICIAN);

  const addSpace = () => {
    if (!newSpaceName) return;
    const newSpace: Space = {
      id: `sp-${Date.now()}`,
      name: newSpaceName,
      department: newSpaceDept,
      icon: '🏭',
      color: '#' + Math.floor(Math.random()*16777215).toString(16),
      folders: [],
      lists: []
    };
    onUpdateWorkspace({ ...workspace, spaces: [...workspace.spaces, newSpace] });
    setNewSpaceName('');
  };

  const addItemToSpace = () => {
    if (!selectedSpaceId || !newItemName) return;
    const updatedSpaces = workspace.spaces.map(s => {
      if (s.id === selectedSpaceId) {
        if (itemType === 'folder') {
          const newFolder: Folder = { id: `f-${Date.now()}`, name: newItemName, spaceId: s.id, lists: [] };
          return { ...s, folders: [...s.folders, newFolder] };
        } else {
          const newList: List = { id: `l-${Date.now()}`, name: newItemName, spaceId: s.id };
          return { ...s, lists: [...s.lists, newList] };
        }
      }
      return s;
    });
    onUpdateWorkspace({ ...workspace, spaces: updatedSpaces });
    setNewItemName('');
  };

  const addUser = () => {
    if (!newUserName || !newUserPassword) return;
    const newUser: User = {
      id: `u-${Date.now()}`,
      name: newUserName,
      role: newUserRole,
      password: newUserPassword,
      avatar: '👤'
    };
    onUpdateUsers([...users, newUser]);
    setNewUserName('');
    setNewUserPassword('');
  };

  return (
    <div className="flex-1 overflow-y-auto p-10 bg-[#f8fafc] custom-scrollbar">
      <div className="max-w-6xl mx-auto pb-20">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">إدارة JAMCO 🛡️</h1>
            <p className="text-slate-500 mt-2 font-bold text-sm">بناء الهيكلية، الصلاحيات، والأتمتة.</p>
          </div>
          <div className="flex gap-4">
             <button onClick={onReset} className="px-6 py-3 bg-rose-50 text-rose-600 rounded-2xl text-[10px] font-black hover:bg-rose-500 hover:text-white transition-all">إعادة ضبط المصنع</button>
          </div>
        </header>

        <nav className="flex gap-2 p-1 bg-white border border-slate-100 rounded-2xl shadow-sm mb-10 w-fit">
          {[
            { id: 'org', label: 'بناء الهيكلية', icon: '🏗️' },
            { id: 'users', label: 'إدارة الموظفين', icon: '👥' },
            { id: 'auto', label: 'الأتمتة', icon: '⚡' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-8 py-3 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </nav>

        {activeTab === 'org' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
             {/* Space Builder */}
             <section className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                <h2 className="text-xl font-black mb-6 flex items-center gap-3">
                   <span className="w-1.5 h-8 bg-indigo-600 rounded-full"></span>
                   إنشاء الأقسام (Spaces)
                </h2>
                <div className="space-y-4">
                   <input value={newSpaceName} onChange={e => setNewSpaceName(e.target.value)} placeholder="اسم القسم (مثال: الإنتاج)" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none" />
                   <select value={newSpaceDept} onChange={e => setNewSpaceDept(e.target.value as any)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none">
                      {Object.values(Department).map(d => <option key={d} value={d}>{d}</option>)}
                   </select>
                   <button onClick={addSpace} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs hover:bg-indigo-700 transition-all">إضافة القسم</button>
                </div>
             </section>

             {/* Folder/List Builder */}
             <section className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                <h2 className="text-xl font-black mb-6 flex items-center gap-3">
                   <span className="w-1.5 h-8 bg-emerald-500 rounded-full"></span>
                   بناء الهيكل الداخلي
                </h2>
                <div className="space-y-4">
                   <select value={selectedSpaceId} onChange={e => setSelectedSpaceId(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none">
                      <option value="">-- اختر القسم --</option>
                      {workspace.spaces.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                   </select>
                   <div className="flex gap-2">
                      <button onClick={() => setItemType('folder')} className={`flex-1 py-3 rounded-xl text-[10px] font-black border transition-all ${itemType === 'folder' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 border-slate-100'}`}>مجلد 📁</button>
                      <button onClick={() => setItemType('list')} className={`flex-1 py-3 rounded-xl text-[10px] font-black border transition-all ${itemType === 'list' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 border-slate-100'}`}>قائمة مهام 📋</button>
                   </div>
                   <input value={newItemName} onChange={e => setNewItemName(e.target.value)} placeholder="الاسم (مثال: مشروع سحاب)" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none" />
                   <button onClick={addItemToSpace} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs hover:bg-emerald-700 transition-all">إضافة إلى الهيكل</button>
                </div>
             </section>

             {/* Visualization of Structure */}
             <div className="lg:col-span-2 bg-slate-900 rounded-[48px] p-10 text-white shadow-2xl">
                <h3 className="text-xl font-black mb-8">الهيكلية الحالية للمصنع</h3>
                {workspace.spaces.length === 0 && <p className="text-slate-500 font-bold text-center py-10">لا يوجد هيكلية بعد. ابدأ بإضافة قسم.</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {workspace.spaces.map(s => (
                     <div key={s.id} className="bg-white/5 p-6 rounded-[32px] border border-white/10">
                        <div className="flex items-center gap-3 mb-4">
                           <span className="text-2xl">{s.icon}</span>
                           <span className="font-black text-indigo-400">{s.name}</span>
                        </div>
                        <div className="space-y-2">
                           {s.folders.map(f => <div key={f.id} className="text-xs font-bold opacity-60">📁 {f.name}</div>)}
                           {s.lists.map(l => <div key={l.id} className="text-xs font-bold opacity-60">📋 {l.name}</div>)}
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'users' && (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in">
              <div className="lg:col-span-1 bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                 <h2 className="text-xl font-black mb-6">إضافة موظف</h2>
                 <div className="space-y-4">
                    <input value={newUserName} onChange={e => setNewUserName(e.target.value)} placeholder="اسم المستخدم" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none" />
                    <input type="password" value={newUserPassword} onChange={e => setNewUserPassword(e.target.value)} placeholder="كلمة المرور" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none" />
                    <select value={newUserRole} onChange={e => setNewUserRole(e.target.value as any)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none">
                       {Object.values(UserRole).map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <button onClick={addUser} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-slate-800 transition-all">إنشاء الحساب</button>
                 </div>
              </div>
              <div className="lg:col-span-2 space-y-4">
                 {users.map(u => (
                   <div key={u.id} className="bg-white p-6 rounded-[32px] border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl">{u.avatar}</div>
                         <div>
                            <div className="font-black text-slate-800">{u.name}</div>
                            <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{u.role}</div>
                         </div>
                      </div>
                      <div className="text-[10px] font-bold text-slate-300">Password: {u.password}</div>
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
