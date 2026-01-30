
export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  BLOCKED = 'BLOCKED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  QUALITY_CHECK = 'QUALITY_CHECK',
  DONE = 'DONE'
}

export const WORKFLOW_ORDER = [
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.BLOCKED,
  TaskStatus.UNDER_REVIEW,
  TaskStatus.QUALITY_CHECK,
  TaskStatus.DONE
];

export enum Department {
  PLANNING = 'PLANNING',
  ENGINEERING = 'ENGINEERING',
  PROCUREMENT = 'PROCUREMENT',
  PRODUCTION = 'PRODUCTION',
  QUALITY = 'QUALITY'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  TECHNICIAN = 'TECHNICIAN'
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  minThreshold: number;
  unitCost: number;
}

export interface BOMItem {
  id: string;
  materialId: string;
  materialName: string;
  requiredQuantity: number;
  unit: string;
}

export interface Goal {
  id: string;
  name: string;
  ownerId: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  dueDate: string;
  color: string;
}

export interface TaskComment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'file';
  url: string;
  size?: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  taskId?: string;
  taskTitle?: string;
  timestamp: string;
}

export interface Doc {
  id: string;
  title: string;
  content: string;
  lastEditedBy: string;
  updatedAt: string;
  isRead?: boolean;
}

export interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
  subtasks?: Subtask[]; 
}

export interface CustomFieldDefinition {
  id: string;
  label: string;
  type: 'text' | 'number' | 'dropdown' | 'unit' | 'progress' | 'checkbox';
  options?: string[];
}

export interface Machine {
  id: string;
  name: string;
  type: string;
  status: 'RUNNING' | 'IDLE' | 'MAINTENANCE';
  loadPercentage?: number;
  x: number; // إحداثيات الخريطة
  y: number; // إحداثيات الخريطة
}

export interface Automation {
  id: string;
  name: string;
  trigger: 'STATUS_CHANGED' | 'TASK_CREATED' | 'DUE_DATE_NEAR';
  triggerValue?: string;
  action: 'NOTIFY' | 'SET_ASSIGNEE' | 'MOVE_LIST';
  actionValue?: string;
}

export interface AppFormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'dropdown';
  required?: boolean;
  options?: string[];
}

export interface AppForm {
  id: string;
  title: string;
  description: string;
  targetListId: string;
  fields: AppFormField[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus | string;
  currentDepartment: Department;
  priority: 'URGENT' | 'HIGH' | 'NORMAL' | 'LOW';
  assignees: string[];
  watchers: string[];
  listId: string;
  machineId?: string;
  billOfMaterials?: BOMItem[];
  createdAt: string;
  productionData: any;
  comments: TaskComment[];
  subtasks: Subtask[];
  attachments?: Attachment[];
  estimatedHours?: number;
  actualHours?: number;
}

export interface Workspace {
  id: string;
  name: string;
  spaces: Space[];
  machines: Machine[];
  inventory: InventoryItem[];
  customFieldDefinitions: CustomFieldDefinition[];
  automations: Automation[];
  goals: Goal[];
  docs: Doc[];
  activities: Activity[];
  forms: AppForm[];
}

export interface Space {
  id: string;
  name: string;
  department: Department;
  icon: string;
  color: string;
  folders: Folder[];
  lists: List[];
}

export interface Folder { id: string; name: string; spaceId: string; lists: List[]; }
export interface List { id: string; name: string; spaceId: string; folderId?: string; }

export type ViewType = 'LIST' | 'BOARD' | 'DASHBOARD' | 'ADMIN' | 'TABLE' | 'CALENDAR' | 'WORKLOAD' | 'GOALS' | 'MINDMAP' | 'PORTFOLIO' | 'DOCS' | 'GANTT' | 'PLANNER' | 'INBOX' | 'REPLIES' | 'FORMS' | 'TIMESHEETS' | 'CLIPS' | 'INVENTORY' | 'FLOOR_MAP';

export interface User {
  id: string;
  name: string;
  role: UserRole | string;
  avatar: string;
  capacity?: number;
  password?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  taskId?: string;
}
