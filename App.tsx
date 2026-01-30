
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
import PlannerView from './components/PlannerView';
import AppGrid from './components/AppGrid';
import ChatView from './components/ChatView';
import WhiteboardView from './components/WhiteboardView';
import FormsView from './components/FormsView';
import TimesheetsView from './components/TimesheetsView';
import ClipsView from './components/ClipsView';
import ReportsView from './components/ReportsView';
import InventoryView from './components/InventoryView';
import FloorMapView from './components/FloorMapView';
import { storage } from './services/storage';
import { ViewType, Task, Workspace, User, UserRole, Department, TaskStatus, AppNotification, Activity, Automation, Machine } from './types';
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [workspace, setWorkspace] = useState<Workspace>(storage.loadWorkspace());
  const [tasks, setTasks] = useState<Task[]>(storage.loadTasks());
  const [users, setUsers] = useState<User[]>(storage.loadUsers());
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [view, setView] = useState<ViewType>('PLANNER');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isPulseOpen, setIsPulseOpen] = useState(false);
  const [isAppGridOpen, setIsAppGridOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [aiResponse, setAIResponse] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    setIsSyncing(true);
    storage.saveWorkspace(workspace);
    storage.saveTasks(tasks);
    storage.saveUsers(users);
    setTimeout(() => setIsSyncing(false), 800);
  }, [workspace, tasks, users]);

  useEffect(() => {
    if (!isLoggedIn) return;
    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
         const randomActivity: Activity = {
            id: `act-live-${Date.now()}`,
            userId: 'other',
            userName: 'أحمد (المشرف)',
            action: 'قام بتحديث جدول الإنتاج اللحظي',
            timestamp: new Date().toISOString()
         };
         setWorkspace(prev => ({...prev, activities: [randomActivity, ...(prev.activities || [])].slice(0, 50)}));
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    if(selectedTask?.id === updatedTask.id) setSelectedTask(updatedTask);
  };

  const handleAddTask = (newTaskOrStatus: Task | string) => {
    let finalTask: Task;
    if (typeof newTaskOrStatus === 'string') {
      finalTask = {
        id: `task-${Date.now()}`,
        title: 'مهمة جديدة',
        description: '',
        status: newTaskOrStatus || TaskStatus.TODO,
        currentDepartment: Department.PLANNING,
        priority: 'NORMAL',
        assignees: [],
        watchers: [currentUser!.id],
        listId: activeListId || 'default',
        createdAt: new Date().toISOString(),
        subtasks: [],
        productionData: { issues: [], customFields: {} },
        comments: [],
        billOfMaterials: [],
        actualHours: 0
      };
    } else {
      finalTask = newTaskOrStatus;
    }
    setTasks([finalTask, ...tasks]);
  };

  const handleGlobalAskAI = async () => {
    const prompt = window.prompt("كيف يمكن لـ JAMCO Brain مساعدتك اليوم؟");
    if (!prompt) return;
    setIsAIChatOpen(true);
    setAIResponse("جاري التفكير...");
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `أنت JAMCO Brain، المساعد الذكي للشركة الأردنية المتقدمة لتشكيل المعادن. أجب على استفسار المستخدم بمهنية واختصار: ${prompt}`
      });
      setAIResponse(response.text || "عذراً، لم أتمكن من الحصول على رد.");
    } catch (e) {
      setAIResponse("حدث خطأ في الاتصال بالذكاء الاصطناعي.");
    }
  };

  if (!isLoggedIn) return <Login users={users} onLogin={(u) => { setIsLoggedIn(true); setCurrentUser(u); }} />;

  const filteredTasks = tasks.filter(t => !activeListId || t.listId === activeListId);

  return (
    <div className="flex h-screen bg-white font-['Cairo'] text-slate-900 overflow-hidden" dir="rtl">
      <aside className="w-[70px] bg-[#09090b] flex flex-col items-center py-6 gap-8 z-[60]">
         <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-xl mb-4 shadow-lg shadow-indigo-500/20 cursor-pointer">C</div>
         <button className={`text-white/40 hover:text-white transition-all p-3 rounded-2xl flex flex-col items-center gap-1 ${view === 'PLANNER' ? 'bg-white/10 text-white' : ''}`} onClick={() => setView('PLANNER')}>
            <span className="text-lg">🏠</span>
            <span className="text-[7px] font-black uppercase tracking-tighter">Home</span>
         </button>
         <button className={`text-white/40 hover:text-white transition-all p-3 rounded-2xl flex flex-col items-center gap-1 ${view === 'FLOOR_MAP' ? 'bg-white/10 text-white' : ''}`} onClick={() => setView('FLOOR_MAP')}>
            <span className="text-lg">🏭</span>
            <span className="text-[7px] font-black uppercase tracking-tighter">Floor</span>
         </button>
         <button onClick={handleGlobalAskAI} className="text-indigo-400 hover:text-indigo-300 transition-all p-3 rounded-2xl flex flex-col items-center gap-1 group relative">
            <span className="text-lg group-hover:rotate-12 transition-transform">✨</span>
            <span className="text-[7px] font-black uppercase tracking-tighter">Brain</span>
         </button>
         <button className={`mt-auto text-white/40 hover:text-white transition-all p-3 rounded-2xl flex flex-col items-center gap-1 ${isAppGridOpen ? 'bg-white/10 text-white' : ''}`} onClick={() => setIsAppGridOpen(!isAppGridOpen)}>
            <span className="text-lg">🧩</span>
            <span className="text-[7px] font-black uppercase tracking-tighter">Apps</span>
         </button>
         <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white text-[10px] font-bold cursor-pointer hover:bg-slate-700">
           {currentUser?.name[0].toUpperCase()}
         </div>
      </aside>

      {isAppGridOpen && <AppGrid onSelect={(v) => { setView(v); setIsAppGridOpen(false); }} />}
      <Sidebar workspace={workspace} activeListId={activeListId} userRole={currentUser!.role as UserRole} onSelectList={(id, customView) => { setActiveListId(id); setView(customView || 'LIST'); }} />
      {isPulseOpen && <PulseView activities={workspace.activities} />}

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-12 bg-white border-b border-slate-100 flex items-center px-6 justify-between z-20">
           <div className="flex items-center gap-4" dir="ltr">
              <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{workspace.name}</span>
              <div className="flex items-center gap-2">
                 {isSyncing ? <span className="text-[9px] font-black text-slate-300 animate-pulse">● SYNCING</span> : <span className="text-[9px] font-black text-emerald-400">● SECURE & SYNCED</span>}
              </div>
           </div>
           <div className="flex items-center gap-6">
              <button onClick={() => setIsSearchOpen(true)} className="flex items-center gap-2 bg-slate-50 px-4 py-1.5 rounded-lg text-slate-400 text-[10px] font-bold hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200">🔍 البحث الشامل</button>
           </div>
        </header>

        <main className="flex-1 overflow-hidden bg-white relative">
          {view === 'PLANNER' && <PlannerView />}
          {view === 'LIST' && <ListView tasks={filteredTasks} onUpdateTask={setSelectedTask} onAddTask={(status) => handleAddTask(status || TaskStatus.TODO)} />}
          {view === 'FLOOR_MAP' && <FloorMapView machines={workspace.machines} tasks={tasks} onSelectMachine={(m) => alert(`Selected Machine: ${m.name}`)} />}
          {view === 'BOARD' && <BoardView tasks={filteredTasks} onTaskClick={setSelectedTask} />}
          {view === 'DASHBOARD' && <DashboardView spaces={workspace.spaces} tasks={tasks} machines={workspace.machines} />}
          {view === 'ADMIN' && <AdminDashboard workspace={workspace} users={users} onUpdateWorkspace={setWorkspace} onUpdateUsers={setUsers} onReset={() => storage.clear()} />}
          {view === 'PORTFOLIO' && <ReportsView tasks={tasks} spaces={workspace.spaces} inventory={workspace.inventory} />}
          {view === 'INVENTORY' && <InventoryView workspace={workspace} onUpdateWorkspace={setWorkspace} />}
          
          {isAIChatOpen && (
            <div className="absolute top-4 left-4 right-4 max-h-[300px] bg-slate-900 text-white rounded-[32px] p-8 shadow-2xl z-50 border border-white/10 flex flex-col animate-in slide-in-from-top-4">
               <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2"><span className="text-lg">✨</span><span className="font-black text-sm uppercase tracking-widest text-indigo-400">JAMCO Brain Intelligence</span></div>
                  <button onClick={() => setIsAIChatOpen(false)} className="text-white/40 hover:text-white">✕</button>
               </div>
               <div className="flex-1 overflow-y-auto custom-scrollbar pr-4"><p className="text-sm font-bold leading-relaxed whitespace-pre-wrap">{aiResponse}</p></div>
            </div>
          )}
        </main>
        
        <footer className="h-6 bg-slate-50 border-t border-slate-100 flex items-center justify-center px-6">
           <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.5em]">JORDAN ADVANCED METAL FORMING • PM SUITE 5.0 REVOLUTION</p>
        </footer>
      </div>

      {selectedTask && (
        <TaskWorkflowModal task={selectedTask} user={currentUser!} workspace={workspace} onClose={() => setSelectedTask(null)} onUpdate={handleUpdateTask} />
      )}
      <CommandCenter isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} tasks={tasks} spaces={workspace.spaces} onSelectTask={setSelectedTask} />
    </div>
  );
};

import Login from './components/Login';
export default App;
