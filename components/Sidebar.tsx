
import React, { useState } from 'react';
import { Workspace, Space, Folder, List, UserRole } from '../types';
import { Icons } from '../constants';

interface SidebarProps {
  workspace: Workspace;
  activeListId: string | null;
  userRole: UserRole;
  onSelectList: (id: string | null, view?: any) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ workspace, activeListId, userRole, onSelectList }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderList = (list: List) => (
    <button
      key={list.id}
      onClick={() => onSelectList(list.id, 'LIST')}
      className={`flex items-center w-full px-4 py-1.5 text-sm rounded-xl transition-all group ${
        activeListId === list.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-600 hover:bg-slate-50'
      }`}
    >
      <span className={`ml-2 ${activeListId === list.id ? 'text-white' : 'opacity-40'}`}><Icons.List /></span>
      <span className="truncate font-bold">{list.name}</span>
    </button>
  );

  const renderFolder = (folder: Folder) => (
    <div key={folder.id} className="mt-1">
      <button
        onClick={() => toggle(folder.id)}
        className="flex items-center w-full px-2 py-2 text-xs text-slate-500 hover:text-slate-800 transition-colors"
      >
        <span className={`transform transition-transform ${expanded[folder.id] ? 'rotate-0' : '-rotate-90'}`}>
          <Icons.ChevronDown />
        </span>
        <span className="mx-2 opacity-50"><Icons.Folder /></span>
        <span className="font-black uppercase tracking-wider">{folder.name}</span>
      </button>
      {expanded[folder.id] && (
        <div className="mr-6 border-r-2 border-slate-100 mt-1 space-y-1 pr-2">
          {folder.lists.map(renderList)}
        </div>
      )}
    </div>
  );

  const renderSpace = (space: Space) => (
    <div key={space.id} className="mt-4">
      <button
        onClick={() => toggle(space.id)}
        className="flex items-center w-full px-3 py-3 text-sm font-black text-slate-700 hover:bg-slate-50 rounded-2xl transition-all"
      >
        <span className="w-8 h-8 rounded-xl flex items-center justify-center ml-2 shadow-sm" style={{ backgroundColor: space.color + '20', color: space.color }}>
          {space.icon}
        </span>
        <span className="flex-1 text-right">{space.name}</span>
        <span className={`transform transition-transform opacity-30 ${expanded[space.id] ? 'rotate-0' : '-rotate-90'}`}>
          <Icons.ChevronDown />
        </span>
      </button>
      {expanded[space.id] && (
        <div className="mt-1 space-y-1 mr-2">
          {space.folders.map(renderFolder)}
          {space.lists.map(renderList)}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-80 h-full bg-white border-l border-slate-100 flex flex-col overflow-hidden shadow-2xl z-30">
      <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-indigo-100">
            {workspace.name[0]}
          </div>
          <div className="flex flex-col">
             <span className="font-black text-slate-900 text-sm leading-tight line-clamp-2">{workspace.name}</span>
             <span className="text-[9px] text-indigo-500 font-black uppercase tracking-tighter mt-1">Enterprise PM Suite</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        {userRole === UserRole.ADMIN && (
          <div className="mb-8 px-2 space-y-2">
             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2">القائمة السريعة</div>
             <button 
                onClick={() => onSelectList(null, 'DASHBOARD')}
                className={`flex items-center w-full px-4 py-3 text-xs font-black rounded-2xl transition-all ${
                    activeListId === null ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-600 hover:bg-slate-50'
                }`}
             >
                <span className="ml-3 text-lg">📊</span> لوحة المراقبة
             </button>
             <button 
                onClick={() => onSelectList(null, 'ADMIN')}
                className="flex items-center w-full px-4 py-3 text-xs font-black rounded-2xl text-indigo-600 hover:bg-indigo-50 transition-all"
             >
                <span className="ml-3 text-lg">🛡️</span> إعدادات المؤسسة
             </button>
          </div>
        )}

        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 mb-2 flex justify-between items-center">
          <span>الهيكلية (Hierarchy)</span>
          {userRole === UserRole.ADMIN && <button onClick={() => onSelectList(null, 'ADMIN')} className="text-indigo-600 text-[9px] hover:underline">تعديل</button>}
        </div>
        
        {workspace.spaces.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-[32px] border border-dashed border-slate-200 mt-4">
             <p className="text-[10px] font-bold text-slate-400 leading-relaxed">لم يتم إنشاء أقسام بعد. توجه إلى لوحة الإدارة للبدء.</p>
          </div>
        ) : workspace.spaces.map(renderSpace)}
      </div>

      <div className="p-6 bg-slate-50 border-t border-slate-100">
        <button 
          onClick={() => onSelectList(activeListId, 'LIST')}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-[20px] shadow-xl shadow-indigo-100 transition-all flex items-center justify-center active:scale-95"
        >
          <span className="ml-2 text-lg font-bold">+</span> إنشاء أمر تشغيل
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
