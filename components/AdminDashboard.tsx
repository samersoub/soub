
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

  const deleteSpace = (id: string) => {
    onUpdateWorkspace({ ...workspace, spaces: workspace.spaces.filter(s => s.id !== id) });
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

  const deleteUser = (id: string) => {
    if (users.length <= 1) return alert('يجب بقاء مسؤول واحد على الأقل.');
    onUpdateUsers(users.filter(u => u.id !== id));
  };

  return (
    <div className="flex-1 overflow-y-auto p-10 bg-[#f8fafc] custom-scrollbar">
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
                <h2 className="text-xl font-black mb-6 flex items-center gap-3">
                   <span className="w-1.5 h-8 bg-indigo-600 rounded-full"></span>
                   إضافة قسم جديد
                </h2>
                <div className="space-y-4">
                   <input value={newSpaceName} onChange={e => setNewSpaceName(e.target.value)} placeholder="اسم القسم (e.g. Laser Cutting)" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none" />
                   <select value={newSpaceDept} onChange={e => setNewSpaceDept(e.target.value as any)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none">
                      {Object.values(Department).map(d => <option key={d} value={d}>{d}</option>)}
                   </select>
                   <button onClick={addSpace} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">إضافة القسم للمؤسسة</button>
                </div>
             </section>

             <section className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                <h2 className="text-xl font-black mb-6 flex items-center gap-3">
                   <span className="w-1.5 h-8 bg-emerald-500 rounded-full"></span>
                   إضافة (مجلد / قائمة)
                </h2>
                <div className="space-y-4">
                   <select value={selectedSpaceId} onChange={e => setSelectedSpaceId(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none">
                      <option value="">-- اختر القسم الحاضن --</option>
                      {workspace.spaces.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                   </select>
                   <div className="flex gap-2">
                      <button onClick={() => setItemType('folder')} className={`flex-1 py-3 rounded-xl text-[10px] font-black border transition-all ${itemType === 'folder' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>مجلد 📁</button>
                      <button onClick={() => setItemType('list')} className={`flex-1 py-3 rounded-xl text-[10px] font-black border transition-all ${itemType === 'list' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>قائمة 📋</button>
                   </div>
                   <input value={newItemName} onChange={e => setNewItemName(e.target.value)} placeholder="الاسم الفني للمجموعة" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none" />
                   <button onClick={addItemToSpace} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-50">تثبيت في الهيكل</button>
                </div>
             </section>

             <div className="lg:col-span-2 space-y-6">
                <h3 className="text-xl font-black text-slate-800">الأقسام الحالية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {workspace.spaces.map(s => (
                     <div key={s.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm group">
                        <div className="flex items-center justify-between mb-4">
                           <div className="flex items-center gap-3">
                              <span className="text-2xl">{s.icon}</span>
                              <span className="font-black text-slate-800">{s.name}</span>
                           </div>
                           <button onClick={() => deleteSpace(s.id)} className="text-rose-400 opacity-0 group-hover:opacity-100 hover:text-rose-600 transition-all text-xs font-black">حذف</button>
                        </div>
                        <div className="space-y-2">
                           {s.folders.map(f => <div key={f.id} className="text-[10px] font-bold text-slate-400 px-3 py-1 bg-slate-50 rounded-lg">📁 {f.name}</div>)}
                           {s.lists.map(l => <div key={l.id} className="text-[10px] font-bold text-indigo-500 px-3 py-1 bg-indigo-50 rounded-lg">📋 {l.name}</div>)}
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'users' && (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in">
              <div className="lg:col-span-1 bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 h-fit sticky top-10">
                 <h2 className="text-xl font-black mb-6">إضافة موظف للنظام</h2>
                 <div className="space-y-4">
                    <input value={newUserName} onChange={e => setNewUserName(e.target.value)} placeholder="اسم الدخول" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:bg-white" />
                    <input type="password" value={newUserPassword} onChange={e => setNewUserPassword(e.target.value)} placeholder="كلمة المرور" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:bg-white" />
                    <select value={newUserRole} onChange={e => setNewUserRole(e.target.value as any)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none">
                       {Object.values(UserRole).map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <button onClick={addUser} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">إنشاء حساب الموظف</button>
                 </div>
              </div>
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                 {users.map(u => (
                   <div key={u.id} className="bg-white p-6 rounded-[32px] border border-slate-100 flex items-center justify-between group hover:shadow-lg transition-all">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner">{u.avatar}</div>
                         <div>
                            <div className="font-black text-slate-800">{u.name}</div>
                            <div className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">{u.role}</div>
                         </div>
                      </div>
                      <button onClick={() => deleteUser(u.id)} className="text-rose-400 opacity-0 group-hover:opacity-100 hover:text-rose-600 transition-all font-black text-[10px]">فصل ✕</button>
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
