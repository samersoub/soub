
import React, { useState, useRef } from 'react';

const ClipsView: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedClips, setRecordedClips] = useState([
    { id: '1', title: 'شرح عطل الماكينة رقم 2', duration: '0:45', author: 'أحمد خليل', type: 'video' },
    { id: '2', title: 'ملاحظة صوتية حول جودة الطلاء', duration: '1:20', author: 'سامر', type: 'audio' },
  ]);

  const videoRef = useRef<HTMLVideoElement>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsRecording(true);
    } catch (err) {
      alert("يرجى تفعيل صلاحيات الكاميرا والميكروفون");
    }
  };

  const stopRecording = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
    // Mock save
    setRecordedClips([{ id: Date.now().toString(), title: 'Clip جديد', duration: '0:10', author: 'أنت', type: 'video' }, ...recordedClips]);
  };

  return (
    <div className="flex-1 p-12 bg-[#F9FAFB] overflow-y-auto custom-scrollbar" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">المقاطع السريعة (Clips) 📹</h1>
            <p className="text-slate-400 font-bold mt-2">سجل شروحات بصرية أو ملاحظات صوتية لمشاركتها فوراً مع الفريق.</p>
          </div>
          <button 
            onClick={isRecording ? stopRecording : startRecording}
            className={`px-10 py-5 rounded-[28px] text-sm font-black text-white shadow-2xl transition-all ${isRecording ? 'bg-rose-500 animate-pulse' : 'bg-indigo-600 hover:scale-105'}`}
          >
            {isRecording ? 'إيقاف التسجيل ⏹️' : 'تسجيل Clip جديد ⏺️'}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Recording Canvas */}
          <div className="lg:col-span-2 bg-slate-900 rounded-[48px] overflow-hidden aspect-video shadow-2xl relative border-4 border-white">
            {!isRecording && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/40">
                <div className="text-6xl mb-6">📷</div>
                <p className="font-black text-xl tracking-widest">الكاميرا غير نشطة</p>
                <p className="text-xs mt-2 opacity-50">ابدأ التسجيل لمشاركة شاشة المصنع أو وجهك</p>
              </div>
            )}
            <video ref={videoRef} className={`w-full h-full object-cover ${isRecording ? 'opacity-100' : 'opacity-0'}`} muted playsInline />
            {isRecording && (
              <div className="absolute top-8 right-8 flex items-center gap-3 bg-rose-500 text-white px-4 py-2 rounded-full font-black text-[10px] animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                LIVE RECORDING
              </div>
            )}
          </div>

          {/* Library Sidebar */}
          <div className="space-y-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-4">أحدث المقاطع</h3>
            {recordedClips.map(clip => (
              <div key={clip.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm group hover:border-indigo-300 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${clip.type === 'video' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-500'}`}>
                    {clip.type === 'video' ? '📽️' : '🎙️'}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="text-sm font-black text-slate-800 truncate">{clip.title}</div>
                    <div className="text-[10px] text-slate-400 font-bold mt-1">{clip.author} • {clip.duration}</div>
                  </div>
                  <button className="text-slate-300 group-hover:text-indigo-600">▶️</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClipsView;
