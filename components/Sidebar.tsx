
import React, { useState } from 'react';
import { Workspace, Space, Folder, List, UserRole } from '../types';
import { Icons } from '../constants';

interface SidebarProps {
  workspace: Workspace;
  activeListId: string | null;
  userRole: UserRole;
  onSelectList: (id: string | null, view?: any) => void;
  onAddList: (spaceId: string, folderId?: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ workspace, activeListId, userRole, onSelectList, onAddList }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ spaces: true });

  const toggle = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderList = (list: List) => (
    <button
      key={list.id}
      onClick={() => onSelectList(list.id, 'LIST')}
      className={`flex items-center w-full px-5 py-2 text-[11px] font-medium transition-all relative border-r-2 ${
        activeListId === list.id 
          ? 'text-white bg-zinc-800 border-indigo-500' 
          : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50 border-transparent'
      }`}
    >
      <div className="ml-3 opacity-30 flex-shrink-0"><Icons.List /></div>
      <span className="truncate flex-1 text-right">{list.name}</span>
    </button>
  );

  const renderSpace = (space: Space) => (
    <div key={space.id} className="mt-4">
      <div className="flex items-center group px-4 mb-1">
        <button
          onClick={() => toggle(space.id)}
          className="flex items-center flex-1 py-1.5 transition-all text-zinc-400 hover:text-white"
        >
          <div className={`transition-transform ml-2 ${expanded[space.id] ? 'rotate-0' : '-rotate-90'}`}><Icons.ChevronDown /></div>
          <span className="text-[9px] font-black uppercase tracking-[0.2em] flex-1 text-right">{space.name}</span>
        </button>
      </div>
      
      {expanded[space.id] && (
        <div className="space-y-0.5">
          {space.lists.map(list => renderList(list))}
          {space.folders.map(folder => (
            <div key={folder.id} className="mt-2">
               <button 
                  onClick={() => toggle(folder.id)}
                  className="w-full flex items-center px-6 py-1.5 text-[10px] text-zinc-600 font-bold hover:text-zinc-400"
               >
                  <div className={`ml-2 transition-transform ${expanded[folder.id] ? '' : '-rotate-90'}`}><Icons.ChevronDown /></div>
                  <span className="opacity-40 ml-2 flex-shrink-0"><Icons.Folder /></span>
                  <span className="truncate flex-1 text-right">{folder.name}</span>
               </button>
               {expanded[folder.id] && (
                 <div className="mr-4 border-r border-zinc-800">
                    {folder.lists.map(list => renderList(list))}
                 </div>
               )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-64 h-full bg-zinc-950 flex flex-col overflow-hidden z-50 border-l border-white/5">
      {/* Precision Header */}
      <div className="p-8 border-b border-white/5">
         <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-indigo-600 rounded-sm flex items-center justify-center text-white text-[10px] font-black tracking-tighter">JA</div>
            <div className="flex flex-col">
               <span className="text-[12px] font-black text-white tracking-widest uppercase">JAMCO CORE</span>
               <span className="text-[8px] font-bold text-zinc-700 uppercase tracking-[0.3em]">Industrial OS</span>
            </div>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-8 py-6">
         <div className="space-y-1">
            <button 
               onClick={() => onSelectList(null, 'LIST')}
               className={`flex items-center w-full px-6 py-3 text-[11px] font-bold transition-all ${
                 activeListId === null ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-white'
               }`}
            >
               <span className="ml-3 opacity-40 flex-shrink-0"><Icons.Space /></span> Everything
            </button>
            <button 
               onClick={() => onSelectList(null, 'INBOX')}
               className="flex items-center w-full px-6 py-3 text-[11px] font-bold text-zinc-500 hover:text-white transition-all"
            >
               <span className="ml-3 opacity-40 flex-shrink-0">📥</span> Inbox
            </button>
         </div>

         <div>
            <div className="px-6 mb-4">
               <span className="text-[9px] font-black text-zinc-800 uppercase tracking-[0.4em]">Hierarchy</span>
            </div>
            {workspace.spaces.map(renderSpace)}
         </div>
      </div>

      {/* Control Footer */}
      <div className="p-6 bg-zinc-900/50 border-t border-white/5">
         <button onClick={() => onSelectList(null, 'ADMIN')} className="flex items-center gap-3 w-full px-3 py-2 text-[10px] font-black text-zinc-600 hover:text-white transition-all group">
            <div className="opacity-40 group-hover:opacity-100 group-hover:rotate-45 transition-all"><Icons.Settings /></div>
            <span className="uppercase tracking-widest">Global Config</span>
         </button>
      </div>
    </div>
  );
};

export default Sidebar;
