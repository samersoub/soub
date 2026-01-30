
import React from 'react';
import { Task, TaskStatus, CustomFieldDefinition } from '../types';

interface Props {
  tasks: Task[];
  customFields: CustomFieldDefinition[];
  onTaskClick: (task: Task) => void;
}

const TableView: React.FC<Props> = ({ tasks, customFields, onTaskClick }) => {
  return (
    <div className="flex-1 overflow-auto bg-white p-6 custom-scrollbar">
      <table className="w-full text-right border-collapse min-w-[1200px]">
        <thead>
          <tr className="bg-slate-50 border-y border-slate-100">
            <th className="p-4 text-[10px] font-black text-slate-400 uppercase w-12"></th>
            <th className="p-4 text-[10px] font-black text-slate-400 uppercase text-right">المهمة</th>
            <th className="p-4 text-[10px] font-black text-slate-400 uppercase text-right">الحالة</th>
            <th className="p-4 text-[10px] font-black text-slate-400 uppercase text-right">الأولوية</th>
            {customFields.map(f => (
              <th key={f.id} className="p-4 text-[10px] font-black text-slate-400 uppercase text-right">{f.label}</th>
            ))}
            <th className="p-4 text-[10px] font-black text-slate-400 uppercase text-right">المكلف</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {tasks.map(task => (
            <tr 
              key={task.id} 
              onClick={() => onTaskClick(task)}
              className="hover:bg-slate-50/80 transition-all cursor-pointer group"
            >
              <td className="p-4 text-center">
                 <div className={`w-3 h-3 rounded-full ${task.status === TaskStatus.DONE ? 'bg-emerald-500' : 'bg-indigo-500'}`}></div>
              </td>
              <td className="p-4">
                 <div className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{task.title}</div>
                 <div className="text-[9px] text-slate-400 font-bold uppercase">{task.id}</div>
              </td>
              <td className="p-4">
                 <span className={`px-3 py-1 rounded-lg text-[9px] font-black ${
                    task.status === TaskStatus.DONE ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'
                 }`}>
                    {task.status}
                 </span>
              </td>
              <td className="p-4">
                 <span className={`text-[9px] font-black px-2 py-0.5 rounded ${
                    task.priority === 'URGENT' ? 'text-rose-600 bg-rose-50' : 'text-slate-500 bg-slate-50'
                 }`}>
                    {task.priority}
                 </span>
              </td>
              {customFields.map(f => (
                <td key={f.id} className="p-4 text-xs font-bold text-slate-600">
                   {task.productionData.customFields[f.id] || '-'}
                </td>
              ))}
              <td className="p-4">
                 <div className="flex -space-x-2 rtl:space-x-reverse">
                    {task.assignees.map((a, i) => (
                      <div key={i} className="w-6 h-6 rounded-full bg-indigo-600 border border-white text-[8px] flex items-center justify-center text-white font-black">
                        {a[0]}
                      </div>
                    ))}
                 </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableView;
