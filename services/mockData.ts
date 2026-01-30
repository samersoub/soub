
import { Workspace, Task, Machine, Goal, AppForm, InventoryItem } from '../types';

const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'inv-1', name: 'Steel Sheet 2mm (1x2m)', quantity: 450, unit: 'Sheet', minThreshold: 50, unitCost: 35.5 },
  { id: 'inv-2', name: 'Aluminum Sheet 3mm', quantity: 120, unit: 'Sheet', minThreshold: 20, unitCost: 55.0 },
  { id: 'inv-3', name: 'Welding Gas (Argon)', quantity: 15, unit: 'Cylinder', minThreshold: 5, unitCost: 120.0 },
  { id: 'inv-4', name: 'Powder Coat - Grey Ral 7035', quantity: 200, unit: 'KG', minThreshold: 40, unitCost: 12.5 }
];

const MOCK_MACHINES: Machine[] = [
  { id: 'm1', name: 'Laser Fiber 4KW', type: 'Cutting', status: 'RUNNING', x: 150, y: 150 },
  { id: 'm2', name: 'CNC Bender - Amada', type: 'Bending', status: 'IDLE', x: 450, y: 150 },
  { id: 'm3', name: 'Welding Station A', type: 'Welding', status: 'RUNNING', x: 150, y: 450 },
  { id: 'm4', name: 'Powder Coating Line', type: 'Finishing', status: 'MAINTENANCE', x: 450, y: 450 }
];

const MOCK_GOALS: Goal[] = [
  { id: 'g1', name: 'رفع كفاءة الإنتاج الأسبوعي', targetValue: 500, currentValue: 340, unit: 'وحدة', dueDate: '2024-12-31', color: '#6366f1', ownerId: 'admin-jamco' },
  { id: 'g2', name: 'تقليل نسبة الهالك (Scrap)', targetValue: 5, currentValue: 2.1, unit: '%', dueDate: '2024-10-15', color: '#f43f5e', ownerId: 'admin-jamco' }
];

const MOCK_FORMS: AppForm[] = [
  {
    id: 'form-1',
    title: 'طلب صيانة طارئ',
    description: 'استخدم هذا النموذج للتبليغ عن أعطال في خطوط الإنتاج.',
    targetListId: 'l-maintenance',
    fields: [
      { id: 'f1', label: 'اسم الماكينة', type: 'text', required: true },
      { id: 'f2', label: 'وصف العطل بالتفصيل', type: 'textarea', required: true },
      { id: 'f3', label: 'مستوى الخطورة', type: 'dropdown', required: true, options: ['بسيطة', 'متوسطة', 'حرجة'] }
    ]
  }
];

export const INITIAL_WORKSPACE: Workspace = {
  id: 'jamco-ws',
  name: 'الشركة الأردنية المتقدمة لتشكيل المعادن',
  spaces: [],
  customFieldDefinitions: [
    { id: 'f-metal', label: 'نوع المعدن', type: 'text' },
    { id: 'f-thick', label: 'السماكة (mm)', type: 'number' }
  ],
  automations: [],
  machines: MOCK_MACHINES,
  inventory: MOCK_INVENTORY,
  goals: MOCK_GOALS,
  docs: [],
  activities: [],
  forms: MOCK_FORMS
};

export const INITIAL_TASKS: Task[] = [];
