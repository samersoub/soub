
import React, { useState } from 'react';
import { Workspace, InventoryItem } from '../types';

interface Props {
  workspace: Workspace;
  onUpdateWorkspace: (w: Workspace) => void;
}

const InventoryView: React.FC<Props> = ({ workspace, onUpdateWorkspace }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = workspace.inventory.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateQuantity = (id: string, delta: number) => {
    const newInv = workspace.inventory.map(i => 
      i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i
    );
    onUpdateWorkspace({ ...workspace, inventory: newInv });
  };

  return (
    <div className="flex-1 overflow-y-auto p-12 bg-[#F8FAF9] custom-scrollbar" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex justify-between items-end">
           <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">إدارة المستودع والمواد 📦</h1>
              <p className="text-slate-400 font-bold mt-2">تتبع حقيقي للمواد الأولية، الصاج، ومستلزمات الإنتاج.</p>
           </div>
           <div className="flex gap-4">
              <input 
                placeholder="ابحث عن مادة..."
                className="bg-white border border-slate-200 rounded-2xl px-6 py-3 text-xs font-bold outline-none"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black shadow-lg shadow-indigo-100">+ إضافة مادة جديدة</button>
           </div>
        </header>

        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
           <table className="w-full text-right border-collapse">
              <thead>
                 <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase">المادة</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase">الكمية المتوفرة</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase">تكلفة الوحدة</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase">الحالة</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase text-center">الإجراءات</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                 {filteredItems.map(item => {
                    const isLow = item.quantity < item.minThreshold;
                    return (
                       <tr key={item.id} className="hover:bg-slate-50/80 transition-all">
                          <td className="p-6">
                             <div className="text-sm font-black text-slate-800">{item.name}</div>
                             <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{item.unit}</div>
                          </td>
                          <td className="p-6">
                             <span className={`text-sm font-black ${isLow ? 'text-rose-500' : 'text-slate-700'}`}>{item.quantity}</span>
                          </td>
                          <td className="p-6 text-sm font-bold text-slate-600">
                             {item.unitCost} JOD
                          </td>
                          <td className="p-6">
                             <span className={`px-3 py-1 rounded-full text-[9px] font-black ${isLow ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-600'}`}>
                                {isLow ? '⚠️ منخفض جداً' : '✅ متوفر بكثرة'}
                             </span>
                          </td>
                          <td className="p-6">
                             <div className="flex justify-center gap-2">
                                <button onClick={() => updateQuantity(item.id, 10)} className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 font-black">+</button>
                                <button onClick={() => updateQuantity(item.id, -10)} className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 font-black">-</button>
                             </div>
                          </td>
                       </tr>
                    );
                 })}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryView;
