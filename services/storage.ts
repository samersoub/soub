
import { Workspace, Task, User, UserRole } from '../types';
import { INITIAL_WORKSPACE, INITIAL_TASKS } from './mockData';

const WORKSPACE_KEY = 'jamco_workspace_v3';
const TASKS_KEY = 'jamco_tasks_v3';
const USERS_KEY = 'jamco_users_v3';

export const storage = {
  saveWorkspace: (workspace: Workspace) => {
    localStorage.setItem(WORKSPACE_KEY, JSON.stringify(workspace));
  },
  loadWorkspace: (): Workspace => {
    const saved = localStorage.getItem(WORKSPACE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_WORKSPACE;
  },
  saveTasks: (tasks: Task[]) => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  },
  loadTasks: (): Task[] => {
    const saved = localStorage.getItem(TASKS_KEY);
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  },
  saveUsers: (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },
  loadUsers: (): User[] => {
    const saved = localStorage.getItem(USERS_KEY);
    if (saved) return JSON.parse(saved);
    
    // المستخدم الأساسي الوحيد لبدء النظام
    return [
        { 
          id: 'admin-jamco', 
          name: 'jamco', 
          role: UserRole.ADMIN, 
          password: 'jamco', 
          avatar: '🛡️' 
        }
    ];
  },
  clear: () => {
    localStorage.removeItem(WORKSPACE_KEY);
    localStorage.removeItem(TASKS_KEY);
    localStorage.removeItem(USERS_KEY);
    window.location.reload();
  }
};
