
import React from 'react';

const WhiteboardView: React.FC = () => {
  return (
    <div className="flex-1 h-full bg-[#f1f3f4] relative overflow-hidden" dir="rtl">
      {/* Infinite Grid Background */}
      <div className="absolute inset-0" style={{ 
        backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)', 
        backgroundSize: '24px 24px' 
      }}></div>

      {/* Floating Toolbar */}
      <div className="absolute top-1/2 right-8 -translate-y-1/2 flex flex-col gap-2 bg-white p-2 rounded-[28px] shadow-2xl border border-slate-100 z-20">
        {['🖱️', '✏️', '⏹️', '⏺️', '📐', '🖼️', '📝', '✨'].map(tool => (
          <button key={tool} className="w-12 h-12 flex items-center justify-center text-xl hover:bg-slate-50 rounded-2xl transition-all hover:scale-110">
            {tool}
          </button>
        ))}
        <div className="h-px bg-slate-100 mx-2"></div>
        <button className="w-12 h-12 flex items-center justify-center text-xl hover:bg-rose-50 text-rose-500 rounded-2xl">🗑️</button>
      </div>

      {/* Top Controls */}
      <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-20">
        <div className="bg-white px-6 py-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4">
          <span className="text-sm font-black text-slate-800">مخطط الإنتاج - فبروري</span>
          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg">LIVE</span>
        </div>
        <div className="flex gap-4">
          <div className="flex -space-x-3 rtl:space-x-reverse">
             {[1,2,3].map(i => <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-indigo-500 flex items-center justify-center text-[10px] font-black text-white">S</div>)}
          </div>
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-xs shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">مشاركة</button>
        </div>
      </div>

      {/* Canvas Mock Content */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex gap-20 items-center">
           <div className="w-64 h-40 bg-white border-4 border-indigo-200 rounded-[32px] shadow-xl p-8 pointer-events-auto rotate-2 hover:rotate-0 transition-transform cursor-move">
              <div className="text-[10px] font-black text-indigo-400 mb-2 uppercase tracking-widest">توسعة المصنع</div>
              <div className="text-sm font-black text-slate-800 leading-relaxed">تجهيز منطقة ماكينة الليزر الجديدة</div>
           </div>
           <div className="text-4xl text-slate-300">➔</div>
           <div className="w-64 h-40 bg-amber-50 border-4 border-amber-200 rounded-[32px] shadow-xl p-8 pointer-events-auto -rotate-2 hover:rotate-0 transition-transform cursor-move">
              <div className="text-[10px] font-black text-amber-500 mb-2 uppercase tracking-widest">فريق الصيانة</div>
              <div className="text-sm font-black text-slate-800 leading-relaxed">فحص التمديدات الكهربائية</div>
           </div>
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-8 left-8 bg-white p-2 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 z-20">
         <button className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-xl">➖</button>
         <span className="text-xs font-black text-slate-600">100%</span>
         <button className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-xl">➕</button>
      </div>
    </div>
  );
};

export default WhiteboardView;
