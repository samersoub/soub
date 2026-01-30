
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ListView from './components/ListView';
import BoardView from './components/BoardView';
import TableView from './components/TableView';
import CalendarView from './components/CalendarView';
import DashboardView from './components/DashboardView';
import WorkloadView from './components/WorkloadView';
import GoalsView from './components/GoalsView';
import MindMapView from './components/MindMapView';
import PortfolioView from './components/PortfolioView';
import WorkspaceDocs from './components/WorkspaceDocs';
import PulseView from './components/PulseView';
import TaskWorkflowModal from './components/TaskWorkflowModal';
import CommandCenter from './components/CommandCenter';
import AdminDashboard from './components/AdminDashboard';
import NotificationCenter from './components/NotificationCenter';
import ReportsView from './components/ReportsView';
import Login from './components/Login';
import { storage } from './services/storage';
import { ViewType, Task, Workspace, User, UserRole, Department, TaskStatus, AppNotification, Activity, Doc } from './types';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [workspace, setWorkspace] = useState<Workspace>(storage.loadWorkspace());
  const [tasks, setTasks] = useState<Task[]>(storage.loadTasks());
  const [users, setUsers] = useState<User[]>(storage.loadUsers());
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [view, setView] = useState<ViewType | 'REPORTS'>('DASHBOARD');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isPulseOpen, setIsPulseOpen] = useState(true);

  useEffect(() => {
    storage.saveWorkspace(workspace);
    storage.saveTasks(tasks);
    storage.saveUsers(users);
  }, [workspace, tasks, users]);

  const addActivity = (action: string, task?: Task) => {
    const newActivity: Activity = {
       id: `act-${Date.now()}`,
       userId: currentUser!.id,
       userName: currentUser!.name,
       action,
       taskId: task?.id,
       taskTitle: task?.title,
       timestamp: new Date().toISOString()
    };
    setWorkspace(prev => ({...prev, activities: [newActivity, ...(prev.activities || [])].slice(0, 50)}));
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    addActivity(`حدث المهمة: ${updatedTask.title}`, updatedTask);
    if(selectedTask?.id === updatedTask.id) setSelectedTask(updatedTask);
  };

  const handleAddTask = () => {
    let listIdToUse = activeListId;
    if (!listIdToUse) {
       const firstList = workspace.spaces[0]?.lists[0] || workspace.spaces[0]?.folders[0]?.lists[0];
       if (firstList) listIdToUse = firstList.id;
    }

    if (!listIdToUse) {
       alert("يرجى بناء الهيكلية (Spaces/Lists) أولاً.");
       setView('ADMIN');
       return;
    }

    const newTask: Task = {
      id: `job-${Date.now()}`,
      title: 'أمر إنتاج جديد',
      description: '',
      status: TaskStatus.TODO,
      currentDepartment: Department.PLANNING,
      priority: 'NORMAL',
      assignees: [currentUser!.name],
      watchers: [currentUser!.id],
      listId: listIdToUse,
      createdAt: new Date().toISOString(),
      subtasks: [],
      estimatedHours: 8,
      productionData: { 
        materials: [],
        customFields: {},
        timeEntries: [],
        isTimerRunning: false,
        issues: []
      },
      comments: []
    };
    setTasks([newTask, ...tasks]);
    addActivity(`أنشأ مهمة جديدة`, newTask);
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

      <Sidebar workspace={workspace} activeListId={activeListId} userRole={currentUser!.role as UserRole} onSelectList={(id, customView) => { setActiveListId(id); setView(customView || 'LIST'); }} />

      {isPulseOpen && <PulseView activities={workspace.activities || []} />}

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 bg-white border-b border-slate-100 flex items-center px-10 justify-between z-20 overflow-x-auto">
          <div className="flex items-center gap-6 min-w-max">
            <nav className="flex gap-1 p-1 bg-slate-50 rounded-xl">
              {[
                { id: 'DASHBOARD', label: 'المراقبة', icon: '📊' },
                { id: 'LIST', label: 'قائمة', icon: '☰' },
                { id: 'BOARD', label: 'بورد', icon: '📋' },
                { id: 'TABLE', label: 'جدول', icon: '▦' },
                { id: 'CALENDAR', label: 'تقويم', icon: '📅' },
                { id: 'MINDMAP', label: 'خريطة', icon: '🧠' },
                { id: 'PORTFOLIO', label: 'محافظ', icon: '💼' },
                { id: 'DOCS', label: 'مستندات', icon: '📄' },
                { id: 'GOALS', label: 'أهداف', icon: '🎯' },
                { id: 'REPORTS', label: 'تقارير', icon: '📈' },
                { id: 'ADMIN', label: 'إدارة', icon: '⚙️', adminOnly: true }
              ].filter(v => !v.adminOnly || currentUser!.role === UserRole.ADMIN).map((v) => (
                <button 
                  key={v.id} 
                  onClick={() => setView(v.id as any)} 
                  className={`text-[10px] font-black px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${view === v.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <span className="text-sm">{v.icon}</span> {v.label}
                </button>
              ))}
            </nav>
            <button onClick={handleAddTask} className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black shadow-lg shadow-indigo-100">+ مهمة</button>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => setIsPulseOpen(!isPulseOpen)} className={`text-xl transition-all ${isPulseOpen ? 'text-indigo-600 scale-110' : 'text-slate-400 opacity-50'}`} title="تبديل عرض النبض">⚡</button>
            <button onClick={() => setIsSearchOpen(true)} className="text-slate-400 hover:text-indigo-600 transition-all text-xl">🔍</button>
            <button onClick={() => setIsNotifOpen(true)} className="text-slate-400 hover:text-indigo-600 transition-all text-xl">🔔</button>
            <div className="flex items-center gap-3 bg-slate-50 p-1.5 pr-4 rounded-full border border-slate-100">
               <div className="text-left ml-2">
                  <div className="text-[10px] font-black text-slate-800">{currentUser!.name}</div>
                  <div className="text-[8px] font-black text-indigo-500 uppercase">{currentUser!.role}</div>
               </div>
               <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black shadow-lg text-sm">{currentUser!.avatar}</div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden flex flex-col bg-white">
          {view === 'DASHBOARD' && <DashboardView spaces={workspace.spaces} tasks={tasks} machines={workspace.machines} />}
          {view === 'LIST' && <ListView tasks={tasks.filter(t => !activeListId || t.listId === activeListId)} listName={activeListId ? 'سير العمل' : 'كافة المهام'} user={currentUser!} onUpdateTask={setSelectedTask} />}
          {view === 'BOARD' && <BoardView tasks={tasks.filter(t => !activeListId || t.listId === activeListId)} onTaskClick={setSelectedTask} />}
          {view === 'TABLE' && <TableView tasks={tasks.filter(t => !activeListId || t.listId === activeListId)} customFields={workspace.customFieldDefinitions} onTaskClick={setSelectedTask} />}
          {view === 'CALENDAR' && <CalendarView tasks={tasks.filter(t => !activeListId || t.listId === activeListId)} onTaskClick={setSelectedTask} />}
          {view === 'MINDMAP' && <MindMapView tasks={tasks.filter(t => !activeListId || t.listId === activeListId)} listName={activeListId ? 'هيكلية المشروع' : 'كافة المشاريع'} />}
          {view === 'PORTFOLIO' && <PortfolioView workspace={workspace} tasks={tasks} />}
          {view === 'DOCS' && <WorkspaceDocs docs={workspace.docs || []} user={currentUser!} onUpdateDocs={(newDocs) => setWorkspace({...workspace, docs: newDocs})} />}
          {view === 'GOALS' && <GoalsView goals={workspace.goals || []} />}
          {view === 'REPORTS' && <ReportsView tasks={tasks} spaces={workspace.spaces} />}
          {view === 'ADMIN' && <AdminDashboard workspace={workspace} users={users} onUpdateWorkspace={setWorkspace} onUpdateUsers={setUsers} onReset={storage.clear} />}
        </main>
      </div>
    </div>
  );
};

export default App;
