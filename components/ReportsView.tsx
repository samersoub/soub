
import React, { useState } from 'react';
import { Task, TaskStatus, Space, Department, WORKFLOW_ORDER, InventoryItem } from '../types';
import { GoogleGenAI } from "@google/genai";

interface Props {
  tasks: Task[];
  spaces: Space[];
  inventory?: InventoryItem[];
}

const ReportsView: React.FC<Props> = ({ tasks, spaces, inventory = [] }) => {
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const totalTasks = tasks.length;
  const blockedTasks = tasks.filter(t => t.status === TaskStatus.BLOCKED).length;
  const completedTasks = tasks.filter(t => t.status === TaskStatus.DONE).length;

  // حساب التكاليف التقديرية (محاكاة)
  const calculateTotalProjectCost = () => {
    return tasks.reduce((acc, t) => {
      const materialCost = (t.billOfMaterials || []).reduce((mAcc, b) => {
        const invItem = inventory.find(i => i.name === b.materialName);
        return mAcc + (b.requiredQuantity * (invItem?.unitCost || 0));
      }, 0);
      const laborCost = (t.actualHours || 0) * 15; // 15 JOD per hour
      return acc + materialCost + laborCost;
    }, 0);
  };

  const handleAIAnalyzePerformance = async () => {
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze this factory data: Total Tasks: ${totalTasks}, Blocked: ${blockedTasks}, Completed: ${completedTasks}. Current Inventory: ${inventory.map(i => i.name + ': ' + i.quantity).join(', ')}. Provide a brief strategic forecast for JAMCO in Arabic, focusing on operational efficiency and financial health.`,
      });
      setAiAnalysis(response.text || "تعذر الحصول على التوقعات.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-12 bg-[#f8fafc] custom-scrollbar" dir="rtl">
      <div className="max-w-7xl mx-auto pb-20">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">ذكاء JAMCO العملياتي 🧠</h1>
            <p className="text-slate-500 font-bold text-sm mt-3">نظام التنبؤ الاستراتيجي ومراقبة تدفقات الموارد والتكاليف.</p>
          </div>
          <button 
            onClick={handleAIAnalyzePerformance}
            disabled={isAnalyzing}
            className="px-8 py-4 bg-slate-900 text-white rounded-[24px] text-xs font-black shadow-2xl shadow-slate-200 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
          >
            {isAnalyzing ? '⌛ جاري التنبؤ...' : '✨ استشارة JAMCO Brain'}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
           {/* Financial Health Card */}
           <div className="bg-white p-10 rounded-[48px] shadow-sm border border-slate-100 lg:col-span-2">
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">إجمالي التكاليف التشغيلية (المواد + العمل)</div>
              <div className="text-5xl font-black text-indigo-600">{calculateTotalProjectCost().toLocaleString()} <span className="text-xl">JOD</span></div>
              <p className="text-[10px] font-bold text-slate-400 mt-4 leading-relaxed">بناءً على المهام الحالية والـ BOM المخصص لكل منها.</p>
           </div>
           
           <div className="bg-white p-10 rounded-[48px] shadow-sm border border-slate-100 lg:col-span-2 flex flex-col justify-center">
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">العائد على الاستثمار المتوقع</div>
              <div className="text-5xl font-black text-emerald-500">2.4x</div>
           </div>
        </div>

        {aiAnalysis && (
          <div className="mb-12 p-10 bg-indigo-600 rounded-[48px] text-white shadow-2xl relative overflow-hidden animate-in slide-in-from-top-6">
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                   <span className="text-2xl">⚡</span>
                   <h3 className="text-xl font-black tracking-tight">توقعات الذكاء الاصطناعي (AI Forecast)</h3>
                </div>
                <p className="text-indigo-50 font-bold leading-loose text-lg">{aiAnalysis}</p>
             </div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-1 bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 flex flex-col">
             <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">صحة المخزون 📦</h3>
             <div className="space-y-6 flex-1">
                {inventory.slice(0, 4).map(item => {
                   const isLow = item.quantity < item.minThreshold;
                   return (
                     <div key={item.id} className="flex flex-col gap-2">
                        <div className="flex justify-between text-[11px] font-black">
                           <span className="text-slate-700">{item.name}</span>
                           <span className={isLow ? 'text-rose-500' : 'text-emerald-500'}>{item.quantity} {item.unit}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                           <div 
                              className={`h-full transition-all duration-1000 ${isLow ? 'bg-rose-500' : 'bg-indigo-600'}`} 
                              style={{ width: `${Math.min((item.quantity/item.minThreshold)*25, 100)}%` }} 
                           />
                        </div>
                     </div>
                   );
                })}
             </div>
          </div>

          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-[48px] shadow-sm border border-slate-100">
               <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">كفاءة الإنتاج الكلية</div>
               <div className="text-5xl font-black text-indigo-600">92%</div>
            </div>
            <div className="bg-white p-10 rounded-[48px] shadow-sm border border-slate-100">
               <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">متوسط وقت التسليم</div>
               <div className="text-5xl font-black text-emerald-500">4.2 <span className="text-lg">يوم</span></div>
            </div>
            <div className="bg-white p-10 rounded-[48px] shadow-sm border border-slate-100">
               <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">تكلفة الهالك (Scrap)</div>
               <div className="text-5xl font-black text-rose-500">1.8%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
