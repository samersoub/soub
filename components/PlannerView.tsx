
import React, { useState } from 'react';

const PlannerView: React.FC = () => {
  const [integrationStatus, setIntegrationStatus] = useState<string | null>(null);

  const connectCalendar = (provider: string) => {
    setIntegrationStatus(`Connecting to ${provider}...`);
    setTimeout(() => {
      setIntegrationStatus(`Successfully synced with ${provider}!`);
      setTimeout(() => setIntegrationStatus(null), 3000);
    }, 1500);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white p-20 custom-scrollbar scroll-smooth" dir="ltr">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {integrationStatus && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-4 rounded-3xl shadow-2xl z-[100] font-black text-sm animate-in fade-in slide-in-from-top-10">
            {integrationStatus}
          </div>
        )}

        {/* Main Title Section */}
        <h1 className="text-7xl font-black text-slate-900 mb-6 tracking-tight">
          You, but better <br /> <span className="text-slate-800">organized</span>
        </h1>
        <p className="text-xl text-slate-400 font-medium mb-12 max-w-2xl leading-relaxed">
          Use ClickUp Calendar to manage events, time blocking, and take meeting notes - <br />
          supercharged with ClickUp AI.
        </p>

        {/* Integration Buttons */}
        <div className="flex gap-4 mb-24">
           <button 
             onClick={() => connectCalendar('Google Calendar')}
             className="flex items-center gap-3 bg-white border border-slate-200 px-6 py-3 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-200 transition-all active:scale-95"
           >
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" className="w-5 h-5" alt="Google" />
              <span className="text-sm font-bold text-slate-600">Connect Google Calendar</span>
           </button>
           <button 
             onClick={() => connectCalendar('Microsoft Outlook')}
             className="flex items-center gap-3 bg-white border border-slate-200 px-6 py-3 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-200 transition-all active:scale-95"
           >
              <img src="https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg" className="w-5 h-5" alt="Outlook" />
              <span className="text-sm font-bold text-slate-600">Connect Microsoft Outlook</span>
           </button>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full">
           
           {/* Card 1: AI Notetaker */}
           <div className="bg-[#FAFAFC] rounded-[48px] p-12 text-left flex flex-col border border-slate-100 group hover:border-indigo-200 transition-all">
              <div className="w-full h-64 bg-white rounded-[32px] shadow-xl shadow-indigo-100/20 mb-10 overflow-hidden p-6 border border-slate-50 relative">
                 <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full">
                       <span className="text-[10px] font-black text-indigo-600 uppercase">✨ Notetaker: On</span>
                    </div>
                    <div className="flex -space-x-2">
                       {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white"></div>)}
                       <div className="text-[10px] font-bold text-slate-400 ml-3">8 Calendars</div>
                    </div>
                 </div>
                 <div className="bg-white border border-indigo-100 p-4 rounded-2xl shadow-sm">
                    <div className="text-[10px] font-black text-slate-400 mb-2">Tue, Mar 14</div>
                    <div className="text-sm font-black text-slate-800">Calendar Squad Sync</div>
                    <div className="text-[10px] text-indigo-500 font-bold mt-1">9:00 - 9:30am</div>
                    <button onClick={() => alert("Joining Meeting...")} className="w-full mt-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black hover:bg-indigo-700 transition-colors">Join Zoom Meeting</button>
                 </div>
                 {/* AI Bot Overlay */}
                 <div className="absolute bottom-6 right-6 left-6 bg-indigo-50 border border-indigo-100 p-4 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                       <span className="text-xs">✨</span>
                       <span className="text-[10px] font-black text-indigo-600">AI Notetaker</span>
                    </div>
                    <p className="text-[9px] text-slate-500 leading-tight">Bot will join this meeting when it starts or you can send it right now.</p>
                 </div>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">Automate your meeting notes</h3>
              <p className="text-slate-400 font-medium leading-relaxed">ClickUp Notetaker transcribes, summarizes, and creates action items automatically for any meeting.</p>
           </div>

           {/* Card 2: Task Planning */}
           <div className="bg-[#FAFAFC] rounded-[48px] p-12 text-left flex flex-col border border-slate-100 group hover:border-indigo-200 transition-all">
              <div className="w-full h-64 bg-white rounded-[32px] shadow-xl shadow-indigo-100/20 mb-10 overflow-hidden flex gap-4 p-4 border border-slate-50">
                 <div className="w-1/3 border-r border-slate-50 pr-4">
                    <div className="text-[9px] font-black text-slate-400 uppercase mb-4">Backlog</div>
                    <div className="space-y-2">
                       <div className="h-4 bg-slate-50 rounded-md"></div>
                       <div className="h-4 bg-indigo-50 rounded-md border border-indigo-100"></div>
                       <div className="h-4 bg-slate-50 rounded-md"></div>
                    </div>
                 </div>
                 <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-center bg-indigo-600 p-3 rounded-xl text-white">
                       <span className="text-[10px] font-black">Task planning</span>
                       <span className="text-[10px] opacity-50">⌵</span>
                    </div>
                    <div className="space-y-2">
                       {[1,2,3,4].map(i => (
                          <div key={i} className="flex items-center gap-2">
                             <div className="w-3 h-3 rounded-full border border-slate-200"></div>
                             <div className="h-2 bg-slate-100 rounded-full flex-1"></div>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">Block time for work</h3>
              <p className="text-slate-400 font-medium leading-relaxed">Drag tasks into your calendar to block time, so you're always working on what's most important.</p>
           </div>

        </div>

        {/* Carousel Dots */}
        <div className="flex gap-4 mt-16 pb-32">
           <button className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-white transition-all hover:scale-110 active:scale-90">←</button>
           <button className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-white transition-all hover:scale-110 active:scale-90">→</button>
        </div>
      </div>
    </div>
  );
};

export default PlannerView;
