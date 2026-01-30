
import { Workspace, Task, Machine } from '../types';

const MOCK_MACHINES: Machine[] = [
  { id: 'm1', name: 'Laser Fiber 4KW', type: 'Cutting', status: 'RUNNING' },
  { id: 'm2', name: 'CNC Bender - Amada', type: 'Bending', status: 'IDLE' },
  { id: 'm3', name: 'Welding Station A', type: 'Welding', status: 'RUNNING' },
  { id: 'm4', name: 'Powder Coating Line', type: 'Finishing', status: 'MAINTENANCE' }
];

export const INITIAL_WORKSPACE: Workspace = {
  id: 'jamco-ws',
  name: 'الشركة الأردنية المتقدمة لتشكيل المعادن',
  spaces: [],
  customFieldDefinitions: [
    { id: 'f-metal', label: 'نوع المعدن', type: 'text' },
    { id: 'f-thick', label: 'السماكة (mm)', type: 'number' },
    { id: 'f-weight', label: 'الوزن (kg)', type: 'unit' }
  ],
  automations: [],
  machines: MOCK_MACHINES
};

export const INITIAL_TASKS: Task[] = [];
