
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ListView from './components/ListView';
import BoardView from './components/BoardView';
import DashboardView from './components/DashboardView';
import TaskWorkflowModal from './components/TaskWorkflowModal';
import CommandCenter from './components/CommandCenter';
import AdminDashboard from './components/AdminDashboard';
import NotificationCenter from './components/NotificationCenter';
import Login from './components/Login';
import { storage } from './services/storage';
import { ViewType, Task, Workspace, User, UserRole, Department, TaskStatus, AppNotification } from './types';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [workspace, setWorkspace] = useState<Workspace>(storage.loadWorkspace());
  const [tasks, setTasks] = useState<Task[]>(storage.loadTasks());
  const [users, setUsers] = useState<User[]>(storage.loadUsers());
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [view, setView] = useState<ViewType>('DASHBOARD');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  useEffect(() => {
    storage.saveWorkspace(workspace);
    storage.saveTasks(tasks);
    storage.saveUsers(users);
  }, [workspace, tasks, users]);

  const addNotification = (title: string, message: string, type: any, taskId?: string) => {
    const newNotif: AppNotification = {
      id: Math.random().toString(),
      taskId, title, message, type,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    const previousTask = tasks.find(t => t.id === updatedTask.id);
    
    if (previousTask) {
      if (previousTask.currentDepartment !== updatedTask.currentDepartment) {
        addNotification('مهمة جديدة للقسم', `وصل مشروع "${updatedTask.title}" لمرحلة ${updatedTask.currentDepartment}`, 'STATUS', updatedTask.id);
      }
      if (previousTask.status !== TaskStatus.BLOCKED && updatedTask.status === TaskStatus.BLOCKED) {
        addNotification('⚠️ تنبيه: تعطل مشروع', `تم إيقاف العمل في "${updatedTask.title}" بسبب مشكلة فنية`, 'URGENT', updatedTask.id);
      }
    }
    
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    if(selectedTask?.id === updatedTask.id) setSelectedTask(updatedTask);
  };

  const handleAddTask = () => {
    let listIdToUse = activeListId;
    if (!listIdToUse) {
       const allLists = workspace.spaces.flatMap(s => [...s.lists, ...s.folders.flatMap(f => f.lists)]);
       if (allLists.length > 0) {
         listIdToUse = allLists[0].id;
         setActiveListId(listIdToUse);
       } else {
         alert("يرجى بناء هيكلية المصنع أولاً.");
         setView('ADMIN');
         return;
       }
    }

    const defaultChecklists: any = {
      PLANNING: [{ id: 'c1', label: 'مراجعة المخطط الأولي مع العميل', isCompleted: false }],
      ENGINEERING: [
        { id: 'c2', label: 'تجهيز ملفات DXF/DWG للماكينات', isCompleted: false },
        { id: 'c3', label: 'التأكد من سماكة المعدن المطلوبة', isCompleted: false }
      ],
      PROCUREMENT: [{ id: 'c4', label: 'توفير الصاج والاكسسوارات من المستودع', isCompleted: false }],
      PRODUCTION: [
        { id: 'c5', label: 'إتمام عملية القص الليزر', isCompleted: false },
        { id: 'c6', label: 'إتمام عملية الثني CNC', isCompleted: false }
      ],
      QUALITY: [
        { id: 'c7', label: 'فحص جودة الطلاء/التشطيب', isCompleted: false },
        { id: 'c8', label: 'مطابقة الأبعاد النهائية', isCompleted: false }
      ]
    };

    const newTask: Task = {
      id: `job-${Date.now()}`,
      title: 'أمر إنتاج جديد',
      description: '',
      status: TaskStatus.TODO,
      currentDepartment: Department.PLANNING,
      priority: 'NORMAL',
      assignees: [currentUser!.name],
      listId: listIdToUse,
      createdAt: new Date().toISOString(),
      productionData: { 
        materials: [],
        assets: [], 
        stageNotes: { PLANNING: '', ENGINEERING: '', PROCUREMENT: '', PRODUCTION: '', QUALITY: '' },
        checklists: defaultChecklists,
        issues: [],
        reworkCount: 0
      },
      activities: [{ id: Date.now(), userName: currentUser!.name, action: "فتح أمر تشغيل جديد في قسم التخطيط", timestamp: new Date().toISOString() }],
      comments: [] // Initialize comments array
    };
    setTasks([newTask, ...tasks]);
    setSelectedTask(newTask);
  };

  if (!isLoggedIn) return <Login users={users} onLogin={(u) => { setIsLoggedIn(true); setCurrentUser(u); }} />;

  return (
    <div className="flex h-screen bg-white font-['Cairo'] text-slate-900 overflow-hidden" dir="rtl">
      <CommandCenter isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} tasks={tasks} spaces={workspace.spaces} onSelectTask={setSelectedTask} />
      
      {isNotifOpen && (
        <NotificationCenter 
          notifications={notifications} 
          onMarkRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? {...n, isRead: true} : n))}
          onSelectTask={(tid) => { const t = tasks.find(task => task.id === tid); if(t) setSelectedTask(t); setIsNotifOpen(false); }}
          onClose={() => setIsNotifOpen(false)}
        />
      )}

      {selectedTask && (
        <TaskWorkflowModal 
          task={selectedTask} 
          user={currentUser!} 
          workspace={workspace}
          onClose={() => setSelectedTask(null)} 
          onUpdate={handleUpdateTask} 
        />
      )}

      <Sidebar workspace={workspace} activeListId={activeListId} userRole={currentUser!.role} onSelectList={(id, customView) => { setActiveListId(id); setView(customView || 'LIST'); }} />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-24 bg-white border-b border-slate-100 flex items-center px-10 justify-between z-20">
          <div className="flex items-center gap-6">
            <nav className="flex gap-2 p-1.5 bg-slate-50 rounded-2xl">
              {[
                { id: 'DASHBOARD', label: 'المراقبة', icon: '📊' },
                { id: 'LIST', label: 'سير الإنتاج', icon: '⏳' },
                { id: 'ADMIN', label: 'الإدارة', icon: '🛡️', adminOnly: true }
              ].filter(v => !v.adminOnly || currentUser!.role === UserRole.ADMIN).map((v) => (
                <button key={v.id} onClick={() => setView(v.id as ViewType)} className={`text-[11px] font-black px-6 py-3 rounded-xl transition-all flex items-center gap-2 ${view === v.id ? 'bg-white text-indigo-700 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}>
                  <span className="text-base">{v.icon}</span> {v.label}
                </button>
              ))}
            </nav>
            <button onClick={handleAddTask} className="px-8 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">+ أمر تشغيل</button>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="relative">
               <span className="text-2xl">🔔</span>
               {notifications.filter(n=>!n.isRead).length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">{notifications.filter(n=>!n.isRead).length}</span>}
            </button>
            <div className="flex items-center gap-4 bg-slate-50 p-2 pr-6 rounded-[24px] border border-slate-100">
               <div className="text-left ml-4">
                  <div className="text-xs font-black text-slate-900">{currentUser!.name}</div>
                  <div className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">{currentUser!.department || 'الإدارة'}</div>
               </div>
               <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-lg text-xl">{currentUser!.avatar}</div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden flex flex-col bg-[#FAFAFC]">
          {view === 'DASHBOARD' && <DashboardView spaces={workspace.spaces} tasks={tasks} machines={workspace.machines} />}
          {view === 'LIST' && <ListView tasks={tasks.filter(t => !activeListId || t.listId === activeListId)} listName={activeListId ? 'المسار الزمني' : 'كافة المشاريع'} user={currentUser!} onUpdateTask={handleUpdateTask} />}
          {view === 'ADMIN' && <AdminDashboard workspace={workspace} users={users} onUpdateWorkspace={setWorkspace} onUpdateUsers={setUsers} onReset={storage.clear} />}
        </main>
      </div>
    </div>
  );
};

export default App;
