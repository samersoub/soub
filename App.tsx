
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ListView from './components/ListView';
import BoardView from './components/BoardView';
import TableView from './components/TableView';
import CalendarView from './components/CalendarView';
import DashboardView from './components/DashboardView';
import TaskWorkflowModal from './components/TaskWorkflowModal';
import CommandCenter from './components/CommandCenter';
import AdminDashboard from './components/AdminDashboard';
import NotificationCenter from './components/NotificationCenter';
import PulseView from './components/PulseView';
import GanttView from './components/GanttView';
import WorkloadView from './components/WorkloadView';
import GoalsView from './components/GoalsView';
import MindMapView from './components/MindMapView';
import PortfolioView from './components/PortfolioView';
import WorkspaceDocs from './components/WorkspaceDocs';
import { storage } from './services/storage';
import { ViewType, Task, Workspace, User, UserRole, Department, TaskStatus, AppNotification, Activity } from './types';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [workspace, setWorkspace] = useState<Workspace>(storage.loadWorkspace());
  const [tasks, setTasks] = useState<Task[]>(storage.loadTasks());
  const [users, setUsers] = useState<User[]>(storage.loadUsers());
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [view, setView] = useState<ViewType>('LIST');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isPulseOpen, setIsPulseOpen] = useState(false);
  const [showGettingStarted, setShowGettingStarted] = useState(true);

  useEffect(() => {
    storage.saveWorkspace(workspace);
    storage.saveTasks(tasks);
    storage.saveUsers(users);
  }, [workspace, tasks, users]);

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    if(selectedTask?.id === updatedTask.id) setSelectedTask(updatedTask);
  };

  const handleAddTask = (status?: string) => {
    let listIdToUse = activeListId;
    if (!listIdToUse) {
       const firstList = workspace.spaces[0]?.lists[0] || workspace.spaces[0]?.folders[0]?.lists[0];
       if (firstList) listIdToUse = firstList.id;
    }

    if (!listIdToUse) {
       setView('ADMIN');
       return;
    }

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: 'New Task',
      description: '',
      status: status || TaskStatus.TODO,
      currentDepartment: Department.PLANNING,
      priority: 'NORMAL',
      assignees: [],
      watchers: [currentUser!.id],
      listId: listIdToUse,
      createdAt: new Date().toISOString(),
      subtasks: [],
      productionData: { issues: [], customFields: {} },
      comments: []
    };
    setTasks([newTask, ...tasks]);
    setSelectedTask(newTask);
  };

  if (!isLoggedIn) return <Login users={users} onLogin={(u) => { setIsLoggedIn(true); setCurrentUser(u); }} />;

  const filteredTasks = tasks.filter(t => !activeListId || t.listId === activeListId);

  return (
    <div className="flex h-screen bg-white font-['Cairo'] text-slate-900 overflow-hidden" dir="rtl">
      {/* 1. Global Navigation Bar */}
      <aside className="w-[70px] bg-[#000000] flex flex-col items-center py-6 gap-8 z-50">
         <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-xl mb-4 shadow-lg shadow-indigo-500/20">C</div>
         <button className={`text-white/60 hover:text-white transition-colors text-xl p-2 rounded-xl ${view === 'LIST' ? 'bg-white/10 text-white' : ''}`} onClick={() => setView('LIST')}>🏠</button>
         <button className={`text-white/60 hover:text-white transition-colors text-xl p-2 rounded-xl ${view === 'CALENDAR' ? 'bg-white/10 text-white' : ''}`} onClick={() => setView('CALENDAR')}>📅</button>
         <button className={`text-white/60 hover:text-white transition-colors text-xl p-2 rounded-xl ${isPulseOpen ? 'bg-white/10 text-white' : ''}`} onClick={() => setIsPulseOpen(!isPulseOpen)}>✨</button>
         <button className={`text-white/60 hover:text-white transition-colors text-xl p-2 rounded-xl ${view === 'WORKLOAD' ? 'bg-white/10 text-white' : ''}`} onClick={() => setView('WORKLOAD')}>👥</button>
         <div className="mt-auto flex flex-col gap-6">
            <button className="text-white/60 hover:text-white text-xl">👤</button>
            <button className={`text-white/60 hover:text-white transition-colors text-xl p-2 rounded-xl ${view === 'ADMIN' ? 'bg-white/10 text-white' : ''}`} onClick={() => setView('ADMIN')}>⚙️</button>
         </div>
      </aside>

      {/* 2. Workspace Hierarchy Sidebar */}
      <Sidebar workspace={workspace} activeListId={activeListId} userRole={currentUser!.role as UserRole} onSelectList={(id, customView) => { setActiveListId(id); setView(customView || 'LIST'); }} />

      {/* Pulse Sidebar */}
      {isPulseOpen && <PulseView activities={workspace.activities} />}

      {/* 3. Main Stage */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-12 bg-white border-b border-slate-100 flex items-center px-6 justify-between z-20">
           <div className="flex items-center gap-4">
              <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{workspace.name}</span>
              <div className="w-px h-4 bg-slate-100 mx-2"></div>
              <button onClick={() => setIsSearchOpen(true)} className="flex items-center gap-2 bg-slate-50 px-4 py-1.5 rounded-lg text-slate-400 text-[10px] font-bold hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200">
                🔍 Search <span className="opacity-40 ml-2">Ctrl K</span>
              </button>
           </div>
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                 <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 relative">
                    🔔 {notifications.some(n=>!n.isRead) && <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>}
                 </button>
                 <button className="text-[10px] font-black text-indigo-600 px-3 py-1 bg-indigo-50 rounded-lg hover:bg-indigo-100">Ask AI</button>
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-[10px] shadow-lg shadow-indigo-100">
                 {currentUser?.name.substring(0, 2).toUpperCase()}
              </div>
           </div>
        </header>

        <div className="h-10 bg-white border-b border-slate-100 px-6 flex items-center gap-6 overflow-x-auto custom-scrollbar">
           <div className="flex items-center gap-1 text-[11px] font-black text-slate-400 uppercase tracking-tighter">
              <span>📋 {workspace.spaces.find(s => s.lists.some(l => l.id === activeListId) || s.folders.some(f => f.lists.some(l => l.id === activeListId)))?.name || 'Project'}</span>
           </div>
           <div className="flex gap-4 items-center">
              {[
                { id: 'LIST', label: 'List', icon: '☰' },
                { id: 'BOARD', label: 'Board', icon: '📋' },
                { id: 'TABLE', label: 'Table', icon: '▦' },
                { id: 'GANTT', label: 'Gantt', icon: '📊' },
                { id: 'CALENDAR', label: 'Calendar', icon: '📅' },
                { id: 'DOCS', label: 'Docs', icon: '📄' },
                { id: 'DASHBOARD', label: 'Dashboard', icon: '📊' }
              ].map(t => (
                <button 
                  key={t.id} 
                  onClick={() => setView(t.id as any)}
                  className={`flex items-center gap-1.5 px-2 py-1 text-[11px] font-black border-b-2 transition-all ${view === t.id ? 'border-indigo-600 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                  <span className="text-xs">{t.icon}</span> {t.label}
                </button>
              ))}
           </div>
        </div>

        <main className="flex-1 overflow-hidden bg-white relative">
          {view === 'LIST' && <ListView tasks={filteredTasks} onUpdateTask={setSelectedTask} onAddTask={handleAddTask} />}
          {view === 'BOARD' && <BoardView tasks={filteredTasks} onTaskClick={setSelectedTask} />}
          {view === 'TABLE' && <TableView tasks={filteredTasks} customFields={workspace.customFieldDefinitions} onTaskClick={setSelectedTask} />}
          {view === 'CALENDAR' && <CalendarView tasks={filteredTasks} onTaskClick={setSelectedTask} />}
          {view === 'DASHBOARD' && <DashboardView spaces={workspace.spaces} tasks={tasks} machines={workspace.machines} />}
          {view === 'ADMIN' && <AdminDashboard workspace={workspace} users={users} onUpdateWorkspace={setWorkspace} onUpdateUsers={setUsers} onReset={() => storage.clear()} />}
          {view === 'WORKLOAD' && <WorkloadView tasks={tasks} users={users} />}
          {view === 'GOALS' && <GoalsView goals={workspace.goals} />}
          {view === 'DOCS' && <WorkspaceDocs docs={workspace.docs} user={currentUser!} onUpdateDocs={(d) => setWorkspace({...workspace, docs: d})} />}
          {view === 'GANTT' && <GanttView tasks={filteredTasks} onTaskClick={setSelectedTask} />}

          {/* Getting Started Widget (Matches Screenshot) */}
          {showGettingStarted && (
             <div className="absolute bottom-10 left-10 w-72 bg-white rounded-[32px] shadow-2xl border border-slate-100 p-6 z-40 animate-in slide-in-from-bottom-10">
                <div className="flex justify-between items-start mb-4">
                   <h4 className="text-xs font-black text-slate-800">Get started with ClickUp</h4>
                   <button onClick={() => setShowGettingStarted(false)} className="text-slate-300">✕</button>
                </div>
                <div className="space-y-3">
                   {[
                     'Learn the basics',
                     'Bring your work over',
                     'Integrate apps',
                     'Ask AI for help',
                     'Create your first project'
                   ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-[11px] font-bold text-slate-500 hover:text-indigo-600 cursor-pointer">
                         <div className="w-4 h-4 rounded-full border-2 border-slate-200"></div>
                         {item}
                      </div>
                   ))}
                </div>
                <div className="mt-6 flex justify-between items-center">
                   <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white font-black text-xs">0/5</div>
                   <span className="text-[10px] font-black text-slate-300 uppercase">Designed by ssoub</span>
                </div>
             </div>
          )}
        </main>
        
        <footer className="h-6 bg-slate-50 border-t border-slate-100 flex items-center justify-center px-6">
           <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">JAMCO Enterprise PM Suite v3.0 • Designed by ssoub</p>
        </footer>
      </div>

      {isNotifOpen && (
        <NotificationCenter 
          notifications={notifications} 
          onMarkRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? {...n, isRead: true} : n))}
          onSelectTask={(id) => { setSelectedTask(tasks.find(t => t.id === id) || null); setIsNotifOpen(false); }}
          onClose={() => setIsNotifOpen(false)}
        />
      )}

      {selectedTask && (
        <TaskWorkflowModal task={selectedTask} user={currentUser!} workspace={workspace} onClose={() => setSelectedTask(null)} onUpdate={handleUpdateTask} />
      )}
      <CommandCenter isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} tasks={tasks} spaces={workspace.spaces} onSelectTask={setSelectedTask} />
    </div>
  );
};

import Login from './components/Login';
export default App;
