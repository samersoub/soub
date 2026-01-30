
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
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ spaces: true });

  const toggle = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderList = (list: List) => (
    <button
      key={list.id}
      onClick={() => onSelectList(list.id, 'LIST')}
      className={`flex items-center w-full px-4 py-1.5 text-[11px] rounded-lg transition-all group ${
        activeListId === list.id ? 'bg-indigo-50 text-indigo-700 font-black' : 'text-slate-500 hover:bg-slate-50'
      }`}
    >
      <span className="ml-2">📋</span>
      <span className="truncate">{list.name}</span>
      <span className="mr-auto opacity-0 group-hover:opacity-100 text-[10px]">...</span>
    </button>
  );

  const renderSpace = (space: Space) => (
    <div key={space.id} className="mt-1">
      <button
        onClick={() => toggle(space.id)}
        className="flex items-center w-full px-2 py-2 text-[11px] font-bold text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
      >
        <span className={`transition-transform ml-1 ${expanded[space.id] ? 'rotate-0' : '-rotate-90'}`}>▼</span>
        <span className="w-5 h-5 rounded flex items-center justify-center ml-2 text-xs shadow-sm" style={{ backgroundColor: space.color + '20', color: space.color }}>
          {space.icon}
        </span>
        <span className="flex-1 text-right">{space.name}</span>
      </button>
      {expanded[space.id] && (
        <div className="mr-4 mt-1 space-y-0.5 border-r border-slate-50 pr-1">
          {space.lists.map(renderList)}
          {space.folders.map(folder => (
            <div key={folder.id} className="mt-2">
               <button 
                 onClick={() => toggle(folder.id)}
                 className="w-full flex items-center px-4 py-1.5 text-[10px] text-slate-400 font-black uppercase hover:text-slate-600"
               >
                  <span className={`ml-2 transition-transform ${expanded[folder.id] ? 'rotate-0' : '-rotate-90'}`}>▼</span>
                  📁 {folder.name}
               </button>
               {expanded[folder.id] && (
                 <div className="mr-4 mt-1">
                    {folder.lists.map(renderList)}
                 </div>
               )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-64 h-full bg-white border-l border-slate-100 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-slate-50">
         <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer">
            <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-white text-[10px] font-black shadow-lg shadow-indigo-100">J</div>
            <span className="text-xs font-black text-slate-800 flex-1 truncate">JAMCO Workspace</span>
            <span className="text-[10px] text-slate-300">⌵</span>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
         <div className="space-y-1 mb-6">
            <button 
               onClick={() => onSelectList(null, 'LIST')}
               className={`flex items-center w-full px-3 py-2 text-[11px] font-bold rounded-lg transition-all ${activeListId === null ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
            >
               <span className="ml-3">🌐</span> Everything
            </button>
            <button className="flex items-center w-full px-3 py-2 text-[11px] font-bold text-slate-500 hover:bg-slate-50 rounded-lg">
               <span className="ml-3">📥</span> Inbox
            </button>
            <button className="flex items-center w-full px-3 py-2 text-[11px] font-bold text-slate-500 hover:bg-slate-50 rounded-lg">
               <span className="ml-3">💬</span> Replies
            </button>
         </div>

         <div className="mb-6">
            <div className="px-3 py-1 text-[10px] font-black text-slate-300 uppercase tracking-widest flex justify-between">
               Favorites <span>⌵</span>
            </div>
         </div>

         <div>
            <div className="px-3 py-1 text-[10px] font-black text-slate-300 uppercase tracking-widest flex justify-between items-center">
               Spaces <button onClick={() => onSelectList(null, 'ADMIN')} className="text-lg hover:text-indigo-600">+</button>
            </div>
            <div className="mt-2 space-y-1">
               {workspace.spaces.map(renderSpace)}
            </div>
         </div>
      </div>

      <div className="p-4 border-t border-slate-50 flex items-center justify-between text-[11px] font-bold text-slate-400">
         <button onClick={() => onSelectList(null, 'ADMIN')} className="hover:text-indigo-600 flex items-center gap-2">
            <span>⚙️</span> Settings
         </button>
         {userRole === UserRole.ADMIN && <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-[8px] uppercase tracking-tighter">Admin</span>}
      </div>
    </div>
  );
};

export default Sidebar;
