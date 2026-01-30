
export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  BLOCKED = 'BLOCKED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  QUALITY_CHECK = 'QUALITY_CHECK',
  DONE = 'DONE'
}

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

export const WORKFLOW_ORDER = [
  Department.PLANNING,
  Department.ENGINEERING,
  Department.PROCUREMENT,
  Department.PRODUCTION,
  Department.QUALITY
];

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
  isFavorite?: boolean;
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
}

export interface Automation {
  id: string;
  name: string;
  trigger: 'STATUS_CHANGED' | 'TASK_CREATED' | 'DUE_DATE_NEAR';
  condition?: string;
  action: 'NOTIFY' | 'SET_ASSIGNEE' | 'MOVE_LIST';
  params?: any;
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
  createdAt: string;
  productionData: any;
  comments: TaskComment[];
  subtasks: Subtask[];
  estimatedHours?: number;
}

export interface Space {
  id: string;
  name: string;
  department: Department;
  icon: string;
  color: string;
  folders: Folder[];
  lists: List[];
  customStatuses?: string[];
}

export interface Folder { id: string; name: string; spaceId: string; lists: List[]; }
export interface List { id: string; name: string; spaceId: string; folderId?: string; }

export interface Workspace {
  id: string;
  name: string;
  spaces: Space[];
  machines: Machine[];
  customFieldDefinitions: CustomFieldDefinition[];
  automations: Automation[];
  goals: Goal[];
  docs: Doc[];
  activities: Activity[];
}

export type ViewType = 'LIST' | 'BOARD' | 'DASHBOARD' | 'ADMIN' | 'TABLE' | 'CALENDAR' | 'WORKLOAD' | 'GOALS' | 'MINDMAP' | 'PORTFOLIO' | 'DOCS';

export interface User {
  id: string;
  name: string;
  role: UserRole | string;
  password?: string;
  avatar: string;
  capacity?: number;
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
