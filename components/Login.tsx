
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface Props {
  users: User[];
  onLogin: (user: User) => void;
}

const Login: React.FC<Props> = ({ users, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    const matchedUser = users.find(u => 
      u.name.toLowerCase() === cleanUser && 
      u.password === cleanPass
    );

    if (matchedUser) {
      onLogin(matchedUser);
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة.');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900 flex items-center justify-center p-6 z-[200]">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      
      <div className="relative w-full max-w-md bg-white rounded-[48px] shadow-2xl p-12 overflow-hidden border border-white/10">
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[32px] flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-indigo-200 mb-6 border-4 border-indigo-50">J</div>
          <h1 className="text-2xl font-black text-slate-900 text-center">بوابة JAMCO المركزية</h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">نظام تشغيل وإدارة المصنع</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-4">اسم المستخدم</label>
            <input 
              type="text" 
              className="w-full bg-slate-50 border border-slate-200 rounded-[24px] px-6 py-4 text-sm font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all text-center"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="jamco"
              autoComplete="username"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-4">كلمة المرور</label>
            <input 
              type="password" 
              className="w-full bg-slate-50 border border-slate-200 rounded-[24px] px-6 py-4 text-sm font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all text-center"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          
          {error && (
            <div className="text-[11px] font-black text-rose-500 text-center bg-rose-50 p-4 rounded-2xl border border-rose-100 animate-pulse">
              {error}
            </div>
          )}

          <button 
            type="submit"
            className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-black text-sm shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            تسجيل الدخول للنظام 🚀
          </button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Jordan Advanced Metal Forming</p>
          <p className="text-[8px] font-bold text-slate-200 uppercase tracking-widest mt-1">Enterprise PM Suite v3.0</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
