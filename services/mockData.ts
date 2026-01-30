
import { Workspace, Task, Machine, Goal } from '../types';

const MOCK_MACHINES: Machine[] = [
  { id: 'm1', name: 'Laser Fiber 4KW', type: 'Cutting', status: 'RUNNING' },
  { id: 'm2', name: 'CNC Bender - Amada', type: 'Bending', status: 'IDLE' },
  { id: 'm3', name: 'Welding Station A', type: 'Welding', status: 'RUNNING' },
  { id: 'm4', name: 'Powder Coating Line', type: 'Finishing', status: 'MAINTENANCE' }
];

const MOCK_GOALS: Goal[] = [
  { id: 'g1', name: 'رفع كفاءة الإنتاج الأسبوعي', targetValue: 500, currentValue: 340, unit: 'وحدة', dueDate: '2024-12-31', color: '#6366f1', ownerId: 'admin-jamco' },
  { id: 'g2', name: 'تقليل نسبة الهالك (Scrap)', targetValue: 5, currentValue: 2.1, unit: '%', dueDate: '2024-10-15', color: '#f43f5e', ownerId: 'admin-jamco' }
];

// Fix: Added missing 'docs' and 'activities' properties to match Workspace type
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
  goals: MOCK_GOALS,
  docs: [],
  activities: []
};

export const INITIAL_TASKS: Task[] = [];
