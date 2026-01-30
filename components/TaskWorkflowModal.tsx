
import React, { useState, useRef } from 'react';
import { Task, TaskStatus, User, Subtask, TaskComment, Attachment, Machine, BOMItem, InventoryItem } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

interface Props {
  task: Task;
  user: User;
  workspace: any;
  onClose: () => void;
  onUpdate: (updatedTask: Task) => void;
}

const TaskWorkflowModal: React.FC<Props> = ({ task, user, workspace, onClose, onUpdate }) => {
  const [newComment, setNewComment] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEstimatingMaterials, setIsEstimatingMaterials] = useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'DETAILS' | 'ATTACHMENTS' | 'INVENTORY' | 'QUALITY'>('DETAILS');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const handleAIWriteDescription = async () => {
    if (!task.title) return;
    setIsGenerating(true);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Write a professional technical description for a metal forming task: "${task.title}". Context: JAMCO (Metal Forming). Language: Arabic. Conciseness is key.`,
      });
      if (response.text) onUpdate({ ...task, description: response.text });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQualityImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzingImage(true);
    setAiAnalysisResult("جاري تحليل قطعة المعدن...");

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: {
            parts: [
              { inlineData: { data: base64Data, mimeType: file.type } },
              { text: "تحقق من جودة هذه القطعة المعدنية المصنعة في شركة JAMCO. ابحث عن الخدوش، عدم استواء الحواف، أو عيوب الطلاء. قدم تقريراً فنياً مختصراً باللغة العربية مع إعطاء قرار (ناجح/فاشل)." }
            ]
          }
        });
        
        setAiAnalysisResult(response.text || "فشل التحليل.");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setAiAnalysisResult("حدث خطأ أثناء فحص الصورة.");
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-hidden font-['Cairo']" dir="rtl">
      <div className="bg-white w-full max-w-[1250px] h-[88vh] rounded-[48px] shadow-2xl flex flex-col overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-300">
        
        <header className="h-16 border-b border-slate-50 flex items-center justify-between px-10 bg-white">
          <div className="flex items-center gap-6">
             <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center transition-colors">✕</button>
             <div className="flex bg-slate-100 p-1 rounded-2xl">
                <button onClick={() => setActiveTab('DETAILS')} className={`px-6 py-1.5 text-[11px] font-black rounded-xl transition-all ${activeTab === 'DETAILS' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}>التفاصيل التقنية</button>
                <button onClick={() => setActiveTab('QUALITY')} className={`px-6 py-1.5 text-[11px] font-black rounded-xl transition-all ${activeTab === 'QUALITY' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}>فحص الجودة ✨</button>
                <button onClick={() => setActiveTab('INVENTORY')} className={`px-6 py-1.5 text-[11px] font-black rounded-xl transition-all ${activeTab === 'INVENTORY' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}>المواد والتكاليف</button>
                <button onClick={() => setActiveTab('ATTACHMENTS')} className={`px-6 py-1.5 text-[11px] font-black rounded-xl transition-all ${activeTab === 'ATTACHMENTS' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}>المرفقات</button>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex -space-x-2 mr-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px] font-black text-white shadow-lg animate-pulse">أ</div>
                <div className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-white flex items-center justify-center text-[10px] font-black text-white shadow-lg">س</div>
             </div>
             <button onClick={handleAIWriteDescription} disabled={isGenerating} className="text-indigo-600 text-xs font-black flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-xl transition-all">
                {isGenerating ? '⌛ جاري الكتابة...' : '✨ وصف ذكي'}
             </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-[2.5] overflow-y-auto custom-scrollbar p-12 bg-white border-l border-slate-50">
            {activeTab === 'DETAILS' && (
              <>
                <input 
                  className="text-4xl font-black text-slate-900 w-full outline-none mb-10 placeholder:text-slate-100 border-none bg-transparent"
                  value={task.title}
                  onChange={(e) => onUpdate({...task, title: e.target.value})}
                  placeholder="عنوان المهمة..."
                />
                <div className="grid grid-cols-2 gap-12 mb-16">
                  <div className="space-y-6">
                      <div className="flex items-center">
                        <span className="w-32 text-[11px] font-black text-slate-400 uppercase tracking-widest">سير العمل</span>
                        <select value={task.status} onChange={(e) => onUpdate({...task, status: e.target.value})} className="bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-xl font-black text-[10px] outline-none">
                            {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                      </div>
                  </div>
                </div>
                <textarea 
                  className="w-full bg-slate-50/50 rounded-[32px] p-8 text-sm font-bold text-slate-600 outline-none min-h-[160px]"
                  value={task.description}
                  onChange={(e) => onUpdate({...task, description: e.target.value})}
                />
              </>
            )}

            {activeTab === 'QUALITY' && (
              <div className="animate-in fade-in slide-in-from-left-4">
                 <div className="mb-10">
                    <h2 className="text-2xl font-black text-slate-800">فحص الجودة بالرؤية الحاسوبية ✨</h2>
                    <p className="text-slate-400 text-xs font-bold mt-1">التقط صورة للقطعة المعدنية، وسيقوم JAMCO AI بتحليل العيوب تلقائياً.</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[48px] aspect-video flex flex-col items-center justify-center p-10 text-center relative overflow-hidden group">
                       {isAnalyzingImage ? (
                          <div className="animate-pulse text-indigo-600 font-black text-xl">جاري المسح الضوئي للقطعة...</div>
                       ) : (
                          <>
                             <div className="text-5xl mb-4 group-hover:scale-125 transition-transform">📸</div>
                             <p className="font-black text-slate-400 text-sm">اضغط لتحميل صورة القطعة أو التقاطها</p>
                             <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleQualityImageUpload} />
                          </>
                       )}
                    </div>

                    <div className={`p-8 rounded-[48px] border transition-all ${aiAnalysisResult ? 'bg-indigo-600 text-white border-transparent shadow-2xl' : 'bg-white border-slate-100 text-slate-400'}`}>
                       <h3 className="text-sm font-black uppercase tracking-widest mb-4">تقرير المختبر الذكي</h3>
                       <p className="text-sm font-bold leading-relaxed whitespace-pre-wrap italic">
                          {aiAnalysisResult || "بانتظار تحليل الصورة..."}
                       </p>
                       {aiAnalysisResult && (
                         <div className="mt-8 flex gap-3">
                            <button className="bg-white/20 px-6 py-2 rounded-xl text-[10px] font-black hover:bg-white/30 transition-all" onClick={() => onUpdate({...task, status: TaskStatus.DONE})}>اعتماد التقرير</button>
                            <button className="bg-rose-500 px-6 py-2 rounded-xl text-[10px] font-black" onClick={() => setAiAnalysisResult(null)}>إعادة الفحص</button>
                         </div>
                       )}
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'INVENTORY' && (
              <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-100">
                 <h3 className="text-sm font-black text-slate-800 mb-6">قائمة المواد والتكاليف</h3>
                 <p className="text-slate-400 text-xs font-bold">يتم جلب الأسعار حياً من المستودع المركزي.</p>
              </div>
            )}
          </div>

          <div className="flex-1 bg-slate-50/50 flex flex-col">
            <div className="h-16 border-b border-slate-100 flex items-center px-8 bg-white">
               <h3 className="text-xs font-black text-slate-800 tracking-widest uppercase">النقاش الفني اللحظي</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
               {task.comments.map(c => (
                 <div key={c.id} className="flex gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xs font-black text-indigo-600 border border-slate-100 flex-shrink-0">{c.userName[0]}</div>
                    <div className="bg-white p-4 rounded-[24px] rounded-tr-none text-xs font-bold text-slate-600 border border-slate-100 shadow-sm">{c.text}</div>
                 </div>
               ))}
            </div>
            <div className="p-8 bg-white border-t border-slate-100">
               <div className="bg-slate-50 border border-slate-200 rounded-[28px] p-4 flex items-end gap-3">
                  <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} className="flex-1 bg-transparent border-none outline-none text-xs font-bold text-slate-700 min-h-[60px] resize-none" placeholder="اكتب تعليقاً..." />
                  <button onClick={() => { if(!newComment.trim()) return; onUpdate({...task, comments: [{id:`c-${Date.now()}`, userId:user.id, userName:user.name, text:newComment, timestamp:new Date().toISOString()}, ...(task.comments||[])]}); setNewComment(''); }} className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg">➤</button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskWorkflowModal;
