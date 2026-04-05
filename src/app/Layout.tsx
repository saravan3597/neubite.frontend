import React from 'react';
import { useAuthStore } from '../shared/stores/useAuthStore';
import { NavLink, Outlet } from 'react-router-dom';

// Simple inline SVGs for the dashboard
const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
  </svg>
);

const PantryIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
  </svg>
);

export const Layout: React.FC = () => {
  const { user, logout } = useAuthStore();

  const navLinks = [
    { name: 'Dashboard', to: '/dashboard', icon: <HomeIcon /> },
    { name: 'Pantry', to: '/pantry', icon: <PantryIcon /> },
  ];

  return (
    <div className="min-h-screen bg-surface-50 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col items-stretch transition-all duration-300">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              N
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-surface-900 to-surface-800 tracking-tight">
              Neubite
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.to}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-50 text-brand-600 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <div className="opacity-80 group-hover:opacity-100 transition-opacity">
                {link.icon}
              </div>
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-slate-50 transition-colors duration-200 cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-sm ring-2 ring-white">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {user?.username || 'User'}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {user?.email || 'user@example.com'}
              </p>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="mt-2 w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <div className="opacity-80">
              <LogoutIcon />
            </div>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-surface-50">
        {/* Top Header Placeholder (optional) */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 transition-all">
          <div className="flex-1"></div>
          <div className="flex items-center gap-4">
             {/* Add notifications/search icons here if needed */}
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};
