
import React, { useState } from 'react';
import { Doc, User } from '../types';

interface Props {
  docs: Doc[];
  user: User;
  onUpdateDocs: (docs: Doc[]) => void;
}

const WorkspaceDocs: React.FC<Props> = ({ docs, user, onUpdateDocs }) => {
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(docs[0] || null);
  const [isEditing, setIsEditing] = useState(false);

  const addDoc = () => {
    const newDoc: Doc = {
      id: `doc-${Date.now()}`,
      title: 'مستند جديد غير معنون',
      content: '',
      lastEditedBy: user.name,
      updatedAt: new Date().toISOString()
    };
    onUpdateDocs([newDoc, ...docs]);
    setSelectedDoc(newDoc);
    setIsEditing(true);
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-white">
      {/* Docs Sidebar */}
      <div className="w-80 border-l border-slate-100 bg-slate-50/50 flex flex-col">
         <div className="p-8 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-black text-slate-800 tracking-tight">المستندات 📄</h2>
            <button onClick={addDoc} className="w-8 h-8 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">+</button>
         </div>
         <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {docs.map(doc => (
               <button 
                  key={doc.id}
                  onClick={() => { setSelectedDoc(doc); setIsEditing(false); }}
                  className={`w-full text-right p-4 rounded-2xl transition-all flex items-center gap-4 ${
                    selectedDoc?.id === doc.id ? 'bg-white shadow-xl border border-slate-100' : 'hover:bg-white/50'
                  }`}
               >
                  <span className="text-xl">📄</span>
                  <div className="flex-1 overflow-hidden">
                     <div className="text-xs font-black text-slate-800 truncate">{doc.title}</div>
                     <div className="text-[9px] font-bold text-slate-400 mt-1 uppercase">آخر تعديل: {doc.lastEditedBy}</div>
                  </div>
               </button>
            ))}
         </div>
      </div>

      {/* Doc Editor Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-16">
         {selectedDoc ? (
            <div className="max-w-4xl mx-auto">
               <div className="flex justify-between items-center mb-10 pb-8 border-b border-slate-100">
                  <div>
                     <input 
                       value={selectedDoc.title}
                       onChange={(e) => {
                          const updated = docs.map(d => d.id === selectedDoc.id ? {...d, title: e.target.value} : d);
                          onUpdateDocs(updated);
                          setSelectedDoc({...selectedDoc, title: e.target.value});
                       }}
                       className="text-4xl font-black text-slate-900 bg-transparent border-none outline-none block w-full"
                       placeholder="عنوان المستند..."
                     />
                     <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-4">نظام إدارة المعرفة المركزية</div>
                  </div>
               </div>

               <div className="prose prose-slate max-w-none">
                  <textarea 
                     value={selectedDoc.content}
                     onChange={(e) => {
                        const updated = docs.map(d => d.id === selectedDoc.id ? {...d, content: e.target.value, updatedAt: new Date().toISOString(), lastEditedBy: user.name} : d);
                        onUpdateDocs(updated);
                        setSelectedDoc({...selectedDoc, content: e.target.value});
                     }}
                     className="w-full min-h-[60vh] bg-transparent text-lg font-bold text-slate-700 leading-loose border-none outline-none resize-none"
                     placeholder="ابدأ الكتابة هنا... يدعم النظام التعاون اللحظي."
                  />
               </div>
            </div>
         ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-20">
               <div className="text-9xl mb-10">✍️</div>
               <p className="text-2xl font-black">اختر مستنداً للبدء في كتابة دليل العمل</p>
            </div>
         )}
      </div>
    </div>
  );
};

export default WorkspaceDocs;
