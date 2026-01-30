
import React, { useState } from 'react';
import { User, TaskComment } from '../types';

interface Props {
  user: User;
  type: 'INBOX' | 'REPLIES' | 'CHAT';
}

const ChatView: React.FC<Props> = ({ user, type }) => {
  const [message, setMessage] = useState('');
  const [activeChannel, setActiveChannel] = useState('General Production');

  const channels = ['General Production', 'Laser Dept.', 'Bending Support', 'Quality Control'];
  const mockMessages = [
    { id: '1', user: 'سامر', text: 'هل تم الانتهاء من فحص سماكة ألواح الألمنيوم؟', time: '10:30 AM', isMe: false },
    { id: '2', user: 'Admin', text: 'نعم، الفريق يعمل عليها الآن في قسم الجودة.', time: '10:35 AM', isMe: true },
    { id: '3', user: 'أحمد', text: 'تم استلام الطلبية الجديدة من المورد.', time: '11:00 AM', isMe: false },
  ];

  return (
    <div className="flex-1 flex bg-white animate-in fade-in duration-500" dir="rtl">
      {/* Channels Sidebar */}
      <div className="w-72 border-l border-slate-100 bg-slate-50/50 flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-black text-slate-800 tracking-tight">
            {type === 'REPLIES' ? 'الردود 💬' : 'المحادثات 🗨️'}
          </h2>
        </div>
        <div className="p-4 space-y-1">
          <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-4 mb-2">القنوات</div>
          {channels.map(c => (
            <button 
              key={c}
              onClick={() => setActiveChannel(c)}
              className={`w-full text-right px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeChannel === c ? 'bg-white shadow-md text-indigo-600 border border-slate-100' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              # {c}
            </button>
          ))}
          <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-4 mt-6 mb-2">رسائل مباشرة</div>
          {['المهندس سامر', 'المشرف الفني'].map(u => (
            <button key={u} className="w-full text-right px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
              👤 {u}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        <div className="h-16 border-b border-slate-100 flex items-center px-8 justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span className="text-indigo-600 font-black"># {activeChannel}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <div className="flex gap-4">
             <button className="text-slate-400 hover:text-indigo-600">📞</button>
             <button className="text-slate-400 hover:text-indigo-600">📹</button>
             <button className="text-slate-400 hover:text-indigo-600">ℹ️</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          {mockMessages.map(msg => (
            <div key={msg.id} className={`flex gap-4 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs font-black text-indigo-600">
                {msg.user[0]}
              </div>
              <div className={`max-w-md ${msg.isMe ? 'items-end' : ''} flex flex-col`}>
                <div className="flex items-center gap-2 mb-1 px-2">
                  <span className="text-[10px] font-black text-slate-800">{msg.user}</span>
                  <span className="text-[9px] text-slate-300 font-bold">{msg.time}</span>
                </div>
                <div className={`p-4 rounded-[24px] text-xs font-bold leading-relaxed border shadow-sm ${
                  msg.isMe ? 'bg-indigo-600 text-white border-indigo-500 rounded-tl-none' : 'bg-white text-slate-700 border-slate-100 rounded-tr-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-slate-100 bg-white">
          <div className="max-w-4xl mx-auto flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-[28px] p-2 pr-6 shadow-sm focus-within:border-indigo-400 transition-all">
            <input 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-xs font-bold text-slate-700 placeholder:text-slate-300"
              placeholder={`أرسل رسالة إلى #${activeChannel}...`}
            />
            <div className="flex items-center gap-3 pl-2">
               <button className="text-slate-400 hover:text-indigo-600 transition-colors text-xl">📎</button>
               <button className="text-slate-400 hover:text-indigo-600 transition-colors text-xl">😊</button>
               <button className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all">
                 ➤
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
