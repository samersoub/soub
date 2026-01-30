
import React from 'react';
import { Activity } from '../types';

interface Props {
  activities: Activity[];
}

const PulseView: React.FC<Props> = ({ activities }) => {
  return (
    <div className="w-96 border-r border-slate-100 bg-white flex flex-col overflow-hidden animate-in slide-in-from-left duration-500">
      <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
         <h3 className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            النبض (Pulse)
         </h3>
         <span className="text-[9px] font-black text-slate-400 uppercase">Live Activity</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
         {activities.map(activity => (
            <div key={activity.id} className="relative flex gap-4">
               <div className="absolute top-10 bottom-0 right-5 w-0.5 bg-slate-100"></div>
               <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-lg z-10 shadow-sm">👤</div>
               <div>
                  <div className="text-xs font-black text-slate-800 mb-1">{activity.userName}</div>
                  <div className="text-[11px] font-bold text-slate-500 leading-relaxed">{activity.action}</div>
                  {activity.taskTitle && (
                     <div className="mt-2 text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg inline-block">
                        {activity.taskTitle}
                     </div>
                  )}
                  <div className="text-[9px] text-slate-300 font-bold mt-2 uppercase">منذ {new Date(activity.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
               </div>
            </div>
         ))}
         
         {activities.length === 0 && (
            <div className="text-center py-20 opacity-20">
               <p className="text-xs font-black uppercase tracking-widest">لا توجد أنشطة حديثة</p>
            </div>
         )}
      </div>
    </div>
  );
};

export default PulseView;
