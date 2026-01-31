
import React, { useState } from 'react';
import { Workspace, InventoryItem } from '../types';

interface Props {
  workspace: Workspace;
  onUpdateWorkspace: (w: Workspace) => void;
}

const InventoryView: React.FC<Props> = ({ workspace, onUpdateWorkspace }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({ name: '', quantity: 0, unit: 'KG', minThreshold: 10, unitCost: 1 });

  const filteredItems = workspace.inventory.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addItem = () => {
    if(!newItem.name) return;
    const item: InventoryItem = {
      id: `inv-${Date.now()}`,
      name: newItem.name,
      quantity: Number(newItem.quantity),
      unit: newItem.unit || 'KG',
      minThreshold: Number(newItem.minThreshold),
      unitCost: Number(newItem.unitCost)
    };
    onUpdateWorkspace({ ...workspace, inventory: [item, ...workspace.inventory] });
    setIsAdding(false);
    setNewItem({ name: '', quantity: 0, unit: 'KG', minThreshold: 10, unitCost: 1 });
  };

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
              <input placeholder="ابحث عن مادة..." className="bg-white border border-slate-200 rounded-2xl px-6 py-3 text-xs font-bold outline-none shadow-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              <button onClick={() => setIsAdding(true)} className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black shadow-lg shadow-indigo-100">+ إضافة مادة جديدة</button>
           </div>
        </header>

        {isAdding && (
          <div className="mb-10 bg-white p-8 rounded-[40px] border-2 border-indigo-100 shadow-xl animate-in slide-in-from-top-4">
             <h2 className="text-xl font-black mb-6">إضافة مادة جديدة للمخزون</h2>
             <div className="grid grid-cols-5 gap-4">
                <input value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} placeholder="اسم المادة" className="bg-slate-50 p-4 rounded-xl text-xs font-bold outline-none border border-transparent focus:border-indigo-400" />
                <input type="number" value={newItem.quantity} onChange={e => setNewItem({...newItem, quantity: Number(e.target.value)})} placeholder="الكمية" className="bg-slate-50 p-4 rounded-xl text-xs font-bold outline-none border border-transparent focus:border-indigo-400" />
                <input value={newItem.unit} onChange={e => setNewItem({...newItem, unit: e.target.value})} placeholder="الوحدة (KG, Sheet...)" className="bg-slate-50 p-4 rounded-xl text-xs font-bold outline-none border border-transparent focus:border-indigo-400" />
                <input type="number" value={newItem.unitCost} onChange={e => setNewItem({...newItem, unitCost: Number(e.target.value)})} placeholder="تكلفة الوحدة" className="bg-slate-50 p-4 rounded-xl text-xs font-bold outline-none border border-transparent focus:border-indigo-400" />
                <button onClick={addItem} className="bg-indigo-600 text-white rounded-xl font-black text-xs shadow-lg">حفظ المادة</button>
             </div>
             <button onClick={() => setIsAdding(false)} className="mt-4 text-xs font-black text-slate-400 hover:text-rose-500">إلغاء</button>
          </div>
        )}

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
                          <td className="p-6 text-sm font-bold text-slate-600">{item.unitCost} JOD</td>
                          <td className="p-6">
                             <span className={`px-3 py-1 rounded-full text-[9px] font-black ${isLow ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-600'}`}>
                                {isLow ? '⚠️ منخفض جداً' : '✅ متوفر بكثرة'}
                             </span>
                          </td>
                          <td className="p-6">
                             <div className="flex justify-center gap-2">
                                <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 font-black hover:bg-indigo-600 hover:text-white transition-all">+</button>
                                <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 font-black hover:bg-rose-600 hover:text-white transition-all">-</button>
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
