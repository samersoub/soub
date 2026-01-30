
import React from 'react';
import { Goal } from '../types';

interface Props {
  goals: Goal[];
}

const GoalsView: React.FC<Props> = ({ goals }) => {
  return (
    <div className="flex-1 overflow-auto bg-[#FAFAFC] p-10 custom-scrollbar">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800">الأهداف الاستراتيجية (Goals) 🎯</h2>
          <p className="text-slate-400 text-xs font-bold mt-2">قياس النجاح بناءً على أرقام فعلية.</p>
        </div>
        <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black shadow-lg shadow-indigo-100">+ هدف جديد</button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {goals.map(goal => {
          const progress = (goal.currentValue / goal.targetValue) * 100;
          return (
            <div key={goal.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner" style={{ backgroundColor: goal.color + '20' }}>🏆</div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">تاريخ الاستحقاق: {goal.dueDate}</span>
              </div>
              <h3 className="text-lg font-black text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">{goal.name}</h3>
              <div className="flex items-end gap-2 mb-6">
                <span className="text-3xl font-black text-slate-900">{goal.currentValue}</span>
                <span className="text-slate-400 font-bold text-sm mb-1">/ {goal.targetValue} {goal.unit}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black text-indigo-600 uppercase">
                  <span>التقدم</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            </div>
          );
        })}
        {goals.length === 0 && (
          <div className="col-span-full py-20 text-center opacity-30">
             <div className="text-6xl mb-4">⛳</div>
             <p className="font-black">لم يتم تحديد أهداف استراتيجية بعد.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalsView;
