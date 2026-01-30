
import React from 'react';
import { AppNotification } from '../types';

interface Props {
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
  onSelectTask: (taskId: string) => void;
  onClose: () => void;
}

const NotificationCenter: React.FC<Props> = ({ notifications, onMarkRead, onSelectTask, onClose }) => {
  return (
    <div className="absolute top-20 left-10 w-[400px] bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden z-[100] animate-in slide-in-from-top-4 duration-300">
      <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-indigo-50/30">
        <h3 className="font-black text-slate-800 tracking-tight flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
           صندوق الوارد (Inbox)
        </h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xs font-bold">إغلاق</button>
      </div>
      
      <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="p-10 text-center text-slate-400 font-bold">لا توجد إشعارات جديدة</div>
        ) : (
          notifications.map(n => (
            <div 
              key={n.id} 
              onClick={() => { if(n.taskId) onSelectTask(n.taskId); onMarkRead(n.id); }}
              className={`p-6 border-b border-slate-50 cursor-pointer transition-all hover:bg-slate-50 relative ${!n.isRead ? 'bg-indigo-50/20' : ''}`}
            >
              {!n.isRead && <div className="absolute right-4 top-8 w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>}
              <div className="mr-4">
                <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">{n.type}</div>
                <div className="text-sm font-black text-slate-800 mb-1">{n.title}</div>
                <div className="text-xs text-slate-500 font-bold leading-relaxed">{n.message}</div>
                <div className="text-[9px] text-slate-300 font-bold mt-2 uppercase">{new Date(n.createdAt).toLocaleTimeString()}</div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="p-4 text-center bg-slate-50">
         <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">تحديد الكل كمقروء</button>
      </div>
    </div>
  );
};

export default NotificationCenter;
