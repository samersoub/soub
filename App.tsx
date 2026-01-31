
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ListView from './components/ListView';
import BoardView from './components/BoardView';
import DashboardView from './components/DashboardView';
import TaskWorkflowModal from './components/TaskWorkflowModal';
import CommandCenter from './components/CommandCenter';
import AdminDashboard from './components/AdminDashboard';
import NotificationCenter from './components/NotificationCenter';
import InventoryView from './components/InventoryView';
import FloorMapView from './components/FloorMapView';
import ReportsView from './components/ReportsView';
import { storage } from './services/storage';
import { ViewType, Task, Workspace, User, UserRole, Department, TaskStatus, AppNotification, Activity } from './types';
import { GoogleGenAI } from "@google/genai";

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
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [aiResponse, setAIResponse] = useState<string>('');

  useEffect(() => {
    storage.saveWorkspace(workspace);
    storage.saveTasks(tasks);
    storage.saveUsers(users);
  }, [workspace, tasks, users]);

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    if (selectedTask?.id === updatedTask.id) setSelectedTask(updatedTask);
  };

  const handleAddTask = (status?: string) => {
    const listId = activeListId || (workspace.spaces[0]?.lists[0]?.id || 'default');
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: 'New Operation',
      description: '',
      status: status || TaskStatus.TODO,
      currentDepartment: Department.PLANNING,
      priority: 'NORMAL',
      assignees: [],
      watchers: currentUser ? [currentUser.id] : [],
      listId,
      createdAt: new Date().toISOString(),
      subtasks: [],
      productionData: { issues: [], customFields: {} },
      comments: []
    };
    setTasks(prev => [newTask, ...prev]);
    setSelectedTask(newTask);
  };

  const handleAskAI = async () => {
    const prompt = window.prompt("Ask JAMCO Brain:");
    if (!prompt) return;
    setIsAIChatOpen(true);
    setAIResponse("Consulting JAMCO Intelligence core...");
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Context: Factory Management System. Total Active Tasks: ${tasks.length}. User Question: ${prompt}. Response should be precise, technical, and in Arabic.`
      });
      setAIResponse(response.text || "No response generated.");
    } catch (e) {
      setAIResponse("Core system error.");
    }
  };

  if (!isLoggedIn) return <Login users={users} onLogin={(u) => { setIsLoggedIn(true); setCurrentUser(u); }} />;

  const filteredTasks = tasks.filter(t => !activeListId || t.listId === activeListId);

  return (
    <div className="flex h-screen bg-white text-zinc-950 overflow-hidden font-['Cairo']" dir="rtl">
      {/* Precision Apps Sidebar */}
      <aside className="w-16 bg-zinc-950 flex flex-col items-center py-8 gap-12 z-[60] border-l border-white/5">
         <div className="w-8 h-8 bg-indigo-600 rounded-sm flex items-center justify-center text-white font-black text-xs shadow-xl">J</div>
         <div className="flex flex-col gap-8">
            {[
               { id: 'LIST', icon: '📋' },
               { id: 'FLOOR_MAP', icon: '🏭' },
               { id: 'DASHBOARD', icon: '📊' }
            ].map(item => (
               <button 
                  key={item.id}
                  className={`w-10 h-10 transition-all flex items-center justify-center text-lg ${view === item.id ? 'text-white border-r-2 border-indigo-500' : 'text-zinc-600 hover:text-white'}`} 
                  onClick={() => setView(item.id as ViewType)}
               >
                  {item.icon}
               </button>
            ))}
         </div>
         <button onClick={handleAskAI} className="mt-auto w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center text-xl shadow-lg shadow-amber-500/20">✨</button>
      </aside>

      <Sidebar 
        workspace={workspace} 
        activeListId={activeListId} 
        userRole={currentUser!.role as UserRole} 
        onSelectList={(id) => { setActiveListId(id); setView('LIST'); }}
        onAddList={() => {}}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-14 bg-white border-b border-zinc-100 flex items-center px-10 justify-between z-20">
           <div className="flex items-center gap-4">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300">Operational Dashboard</span>
           </div>
           <div className="flex items-center gap-8">
              <button onClick={() => setIsSearchOpen(true)} className="text-zinc-400 text-xs font-bold hover:text-zinc-900 transition-colors">Search Core (⌘K)</button>
              <div className="w-7 h-7 bg-zinc-100 rounded text-[10px] font-black flex items-center justify-center">{currentUser!.name[0]}</div>
           </div>
        </header>

        <main className="flex-1 overflow-hidden relative">
          <div className="h-full">
            {view === 'LIST' && <ListView tasks={filteredTasks} onUpdateTask={setSelectedTask} onAddTask={handleAddTask} />}
            {view === 'DASHBOARD' && <DashboardView spaces={workspace.spaces} tasks={tasks} />}
            {view === 'FLOOR_MAP' && <FloorMapView machines={workspace.machines} tasks={tasks} onSelectMachine={() => {}} />}
            {view === 'INVENTORY' && <InventoryView workspace={workspace} onUpdateWorkspace={setWorkspace} />}
            {view === 'ADMIN' && <AdminDashboard workspace={workspace} users={users} onUpdateWorkspace={setWorkspace} onUpdateUsers={setUsers} onReset={() => storage.clear()} />}
          </div>
          
          {isAIChatOpen && (
            <div className="absolute top-4 left-4 right-4 ai-glass-panel rounded-lg p-10 text-white z-50 animate-soft-fade">
               <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                     <span className="text-amber-500 text-xl">✨</span>
                     <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400">JAMCO Brain Insights</span>
                  </div>
                  <button onClick={() => setIsAIChatOpen(false)} className="text-zinc-500 hover:text-white transition-colors">✕</button>
               </div>
               <p className="text-lg font-medium leading-loose text-zinc-100">{aiResponse}</p>
            </div>
          )}
        </main>
      </div>

      {selectedTask && <TaskWorkflowModal task={selectedTask} user={currentUser!} workspace={workspace} onClose={() => setSelectedTask(null)} onUpdate={handleUpdateTask} />}
      <CommandCenter isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} tasks={tasks} spaces={workspace.spaces} onSelectTask={setSelectedTask} />
    </div>
  );
};

import Login from './components/Login';
export default App;
