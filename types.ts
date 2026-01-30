
export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  BLOCKED = 'BLOCKED', // حالة جديدة: معطل بسبب مشكلة فنية
  UNDER_REVIEW = 'UNDER_REVIEW',
  QUALITY_CHECK = 'QUALITY_CHECK',
  REVIEW = 'REVIEW',
  DONE = 'DONE'
}

export enum Department {
  PLANNING = 'PLANNING',
  ENGINEERING = 'ENGINEERING',
  PROCUREMENT = 'PROCUREMENT',
  PRODUCTION = 'PRODUCTION',
  QUALITY = 'QUALITY'
}

export const WORKFLOW_ORDER = [
  Department.PLANNING,
  Department.ENGINEERING,
  Department.PROCUREMENT,
  Department.PRODUCTION,
  Department.QUALITY
];

export interface ChecklistItem {
  id: string;
  label: string;
  isCompleted: boolean;
  requiredRole?: UserRole;
}

export interface ProductionIssue {
  id: string;
  reportedBy: string;
  department: Department;
  description: string;
  type: 'MACHINE_FAILURE' | 'DESIGN_ERROR' | 'MATERIAL_MISSING' | 'OTHER';
  createdAt: string;
  resolvedAt?: string;
}

export interface StageAsset {
  id: string;
  name: string;
  url: string;
  type: 'IMAGE' | 'PDF' | 'DWG' | 'DOC';
  uploadedBy: string;
  department: Department;
  createdAt: string;
}

export interface ProductionData {
  dueDate?: string;
  materials: { id: string; name: string; quantity: number; isAvailable: boolean }[];
  assignedMachineId?: string;
  assets: StageAsset[];
  stageNotes: Record<Department, string>;
  // قوائم فحص لكل مرحلة
  checklists: Record<Department, ChecklistItem[]>;
  // سجل المشاكل الفنية
  issues: ProductionIssue[];
  // عدد مرات العودة للخلف (Rework)
  reworkCount: number;
  // التكاليف (Used in ReportsView)
  estimatedCost?: number;
  actualCost?: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  currentDepartment: Department;
  priority: 'URGENT' | 'HIGH' | 'NORMAL' | 'LOW';
  assignees: string[];
  listId: string;
  createdAt: string;
  productionData: ProductionData;
  activities: any[];
  // التعليقات (Used in BoardView)
  comments: any[];
}

export enum UserRole {
  ADMIN = 'ADMIN',
  GENERAL_MANAGER = 'GENERAL_MANAGER',
  DEPARTMENT_HEAD = 'DEPARTMENT_HEAD',
  TECHNICIAN = 'TECHNICIAN'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  password?: string;
  department?: Department;
  avatar?: string;
}

export interface Machine {
  id: string;
  name: string;
  type: string;
  status: 'RUNNING' | 'IDLE' | 'MAINTENANCE';
}

export interface List {
  id: string;
  name: string;
  spaceId: string;
}

export interface Folder {
  id: string;
  name: string;
  spaceId: string;
  lists: List[];
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

export interface Automation {
  id: string;
  name: string;
  trigger: string;
  action: string;
  enabled: boolean;
}

export interface Workspace {
  id: string;
  name: string;
  spaces: Space[];
  machines: Machine[];
  // الحقول المخصصة (Used in mockData)
  customFieldDefinitions: any[];
  // الأتمتة (Used in AdminDashboard)
  automations: Automation[];
}

export type ViewType = 'LIST' | 'BOARD' | 'DASHBOARD' | 'ADMIN';

export interface AppNotification {
  id: string;
  taskId?: string;
  title: string;
  message: string;
  type: 'STATUS' | 'ISSUE' | 'SYSTEM' | 'URGENT';
  isRead: boolean;
  createdAt: string;
}
