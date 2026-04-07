import React, { useState } from 'react';
import { useAuthStore } from '../shared/stores/useAuthStore';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

// ── Icons ──────────────────────────────────────────────────────────────
const DashboardIcon = ({ active }: { active?: boolean }) => (
  <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 2}
      d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10-3a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z" />
  </svg>
);

const PantryIcon = ({ active }: { active?: boolean }) => (
  <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 2}
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const MenuIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CollapseIcon = ({ collapsed }: { collapsed: boolean }) => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
      d={collapsed ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'} />
  </svg>
);

// ── Route meta ─────────────────────────────────────────────────────────
const navLinks = [
  { name: 'Dashboard', to: '/dashboard', icon: DashboardIcon },
  { name: 'Pantry',    to: '/pantry',    icon: PantryIcon },
];

const routeTitle: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/pantry':    'Pantry',
};

// ── Avatar ─────────────────────────────────────────────────────────────
const Avatar = ({ initials, size = 'sm' }: { initials: string; size?: 'sm' | 'md' }) => {
  const cls = size === 'md' ? 'w-9 h-9 text-sm' : 'w-7 h-7 text-xs';
  return (
    <div className={`${cls} rounded-full bg-accent-primary text-white flex items-center justify-center font-bold shrink-0`}>
      {initials}
    </div>
  );
};

// ── Layout ─────────────────────────────────────────────────────────────
export const Layout: React.FC = () => {
  const { user, logout }              = useAuthStore();
  const [collapsed, setCollapsed]     = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const location                      = useLocation();

  const displayName = user?.name || user?.email?.split('@')[0] || 'User';
  const initials    = displayName[0]?.toUpperCase() ?? 'N';
  const pageTitle   = routeTitle[location.pathname] ?? 'Neubite';

  // ── Sidebar inner content ───────────────────────────────────────────
  const SidebarContent = ({ onNavClick }: { onNavClick?: () => void }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center h-14 border-b border-bg-sidebar-hover shrink-0 ${collapsed ? 'justify-center px-0' : 'gap-3 px-5'}`}>
        <div className="w-8 h-8 rounded-lg bg-accent-primary text-white font-extrabold text-sm flex items-center justify-center shrink-0">
          N
        </div>
        {!collapsed && (
          <span className="text-base font-bold text-text-sidebar-active tracking-tight">Neubite</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        {navLinks.map(({ name, to, icon: Icon }) => (
          <NavLink
            key={name}
            to={to}
            onClick={onNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-100 ${
                isActive
                  ? 'bg-accent-primary text-white'
                  : 'text-text-sidebar hover:bg-bg-sidebar-hover hover:text-text-sidebar-active'
              } ${collapsed ? 'justify-center' : ''}`
            }
            title={collapsed ? name : undefined}
          >
            {({ isActive }) => (
              <>
                <span className="shrink-0"><Icon active={isActive} /></span>
                {!collapsed && <span>{name}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + logout — only in sidebar, not duplicated in header */}
      <div className="px-3 pb-4 pt-3 border-t border-bg-sidebar-hover space-y-1 shrink-0">
        {collapsed ? (
          <div className="flex justify-center py-1">
            <Avatar initials={initials} size="md" />
          </div>
        ) : (
          <div className="flex items-center gap-3 px-3 py-2.5">
            <Avatar initials={initials} size="md" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-sidebar-active truncate">{displayName}</p>
              <p className="text-xs text-text-sidebar truncate">{user?.email ?? ''}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => { logout(); onNavClick?.(); }}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-text-sidebar hover:text-status-error hover:bg-bg-sidebar-hover transition-colors ${collapsed ? 'justify-center' : ''}`}
          title="Sign out"
        >
          <LogoutIcon />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-full flex overflow-hidden bg-bg-secondary">

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile slide-in sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-bg-sidebar z-40 transform transition-transform duration-300 ease-out md:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-text-sidebar hover:text-text-sidebar-active">
          <CloseIcon />
        </button>
        <SidebarContent onNavClick={() => setMobileOpen(false)} />
      </aside>

      {/* Desktop sidebar */}
      <aside className={`hidden md:flex flex-col bg-bg-sidebar shrink-0 relative transition-all duration-300 ${collapsed ? 'w-[4.5rem]' : 'w-60'}`}>
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-16 w-6 h-6 rounded-full bg-bg-sidebar border-2 border-bg-sidebar-hover text-text-sidebar hover:text-text-sidebar-active flex items-center justify-center z-10 transition-colors"
        >
          <CollapseIcon collapsed={collapsed} />
        </button>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ── Top header ──────────────────────────────────────────── */}
        <header className="h-14 bg-bg-primary border-b border-bg-secondary flex items-center px-4 md:px-6 shrink-0 gap-3">
          {/* Mobile: hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
          >
            <MenuIcon />
          </button>

          {/* Mobile: logo + page title */}
          <div className="flex-1 flex items-center gap-3 md:gap-0">
            <div className="flex items-center gap-2.5 md:hidden">
              <div className="w-7 h-7 rounded-md bg-accent-primary text-white font-extrabold text-xs flex items-center justify-center">N</div>
              <span className="font-bold text-text-primary text-base">{pageTitle}</span>
            </div>
            {/* Desktop: page title only */}
            <span className="hidden md:block text-base font-bold text-text-primary">{pageTitle}</span>
          </div>

          {/* Mobile right side: user avatar (tapped to see initials) */}
          <div className="flex items-center gap-3">
            <div className="md:hidden">
              <Avatar initials={initials} size="sm" />
            </div>
          </div>
        </header>

        {/* ── Page content ────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
