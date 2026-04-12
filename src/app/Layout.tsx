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
const Avatar = ({ initials, size = 'sm' }: { initials: string; size?: 'sm' | 'md' | 'lg' }) => {
  const cls = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
  }[size];
  return (
    <div className={`${cls} rounded-full bg-accent-primary text-white flex items-center justify-center font-bold shrink-0`}>
      {initials}
    </div>
  );
};

// ── Logout confirmation dialog ─────────────────────────────────────────
const LogoutConfirmDialog = ({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) => (
  <div
    className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
    onClick={onCancel}
  >
    <div
      className="bg-bg-primary w-full md:max-w-sm rounded-t-3xl md:rounded-2xl shadow-xl overflow-hidden animate-in fade-in duration-200"
      onClick={e => e.stopPropagation()}
    >
      {/* Drag handle — mobile only */}
      <div className="md:hidden flex justify-center pt-3 pb-1">
        <div className="w-10 h-1 rounded-full bg-bg-secondary" />
      </div>

      <div className="px-6 pt-5 pb-7 md:py-8 text-center">
        <div className="w-12 h-12 bg-status-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-5 h-5 text-status-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-text-primary mb-1">Sign out?</h3>
        <p className="text-sm text-text-secondary mb-6">
          You'll need to sign back in to access your account.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl bg-bg-secondary text-text-primary font-semibold text-sm hover:bg-bg-secondary/70 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-status-error text-white font-semibold text-sm hover:bg-status-error/90 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  </div>
);

// ── Mobile profile sheet ───────────────────────────────────────────────
interface ProfileSheetProps {
  displayName: string;
  email: string;
  initials: string;
  onSignOut: () => void;
  onClose: () => void;
}

const ProfileSheet = ({ displayName, email, initials, onSignOut, onClose }: ProfileSheetProps) => (
  <div
    className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
    onClick={onClose}
  >
    <div
      className="bg-bg-primary w-full rounded-t-3xl shadow-xl overflow-hidden animate-in fade-in duration-200"
      onClick={e => e.stopPropagation()}
    >
      {/* Drag handle */}
      <div className="flex justify-center pt-3 pb-1">
        <div className="w-10 h-1 rounded-full bg-bg-secondary" />
      </div>

      {/* User info */}
      <div className="px-6 py-5 flex items-center gap-4 border-b border-bg-secondary">
        <Avatar initials={initials} size="lg" />
        <div className="min-w-0">
          <p className="font-bold text-text-primary truncate">{displayName}</p>
          <p className="text-sm text-text-secondary truncate">{email}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4">
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-status-error bg-status-error/8 hover:bg-status-error/12 active:bg-status-error/20 transition-colors font-semibold text-sm"
        >
          <LogoutIcon />
          Sign out
        </button>
      </div>

      {/* Safe-area spacer */}
      <div style={{ height: 'max(1rem, env(safe-area-inset-bottom))' }} />
    </div>
  </div>
);

// ── Sidebar content ─────────────────────────────────────────────────────
interface SidebarContentProps {
  collapsed: boolean;
  initials: string;
  displayName: string;
  email: string;
  onLogoutClick: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ collapsed, initials, displayName, email, onLogoutClick }) => (
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

    {/* User + logout */}
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
            <p className="text-xs text-text-sidebar truncate">{email}</p>
          </div>
        </div>
      )}
      <button
        onClick={onLogoutClick}
        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-text-sidebar hover:text-status-error hover:bg-bg-sidebar-hover transition-colors ${collapsed ? 'justify-center' : ''}`}
        title="Sign out"
      >
        <LogoutIcon />
        {!collapsed && <span>Sign out</span>}
      </button>
    </div>
  </div>
);

// ── Layout ─────────────────────────────────────────────────────────────
export const Layout: React.FC = () => {
  const { user, logout }          = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [showProfileSheet, setShowProfileSheet]     = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm]   = useState(false);
  const location                  = useLocation();

  const displayName = user?.name || user?.email?.split('@')[0] || 'User';
  const initials    = displayName[0]?.toUpperCase() ?? 'N';
  const pageTitle   = routeTitle[location.pathname] ?? 'Neubite';

  const handleLogoutConfirmed = () => {
    setShowLogoutConfirm(false);
    setShowProfileSheet(false);
    logout();
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-bg-secondary">

      {/* Desktop sidebar */}
      <aside className={`hidden md:flex flex-col bg-bg-sidebar shrink-0 relative transition-all duration-300 ${collapsed ? 'w-[4.5rem]' : 'w-60'}`}>
        <SidebarContent
          collapsed={collapsed}
          initials={initials}
          displayName={displayName}
          email={user?.email ?? ''}
          onLogoutClick={() => setShowLogoutConfirm(true)}
        />
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

        {/* ── Top header ── */}
        <header className="bg-bg-primary border-b border-bg-secondary shrink-0">
          {/* Safe-area spacer — sits behind the status bar / Dynamic Island */}
          <div className="md:hidden" style={{ height: 'max(env(safe-area-inset-top), 50px)' }} />
          <div className="flex items-center h-14 px-4 md:px-6">
          {/* Mobile: logo mark + page title */}
          <div className="flex-1 flex items-center gap-2.5 md:hidden">
            <div className="w-7 h-7 rounded-md bg-accent-primary text-white font-extrabold text-xs flex items-center justify-center shrink-0">N</div>
            <span className="font-bold text-text-primary text-base">{pageTitle}</span>
          </div>
          {/* Desktop: page title only */}
          <span className="hidden md:block text-base font-bold text-text-primary">{pageTitle}</span>
          {/* Mobile: user avatar */}
          <div className="md:hidden">
            <Avatar initials={initials} size="sm" />
          </div>
          </div>
        </header>

        {/* ── Page content ── */}
        <main
          className="flex-1 overflow-y-auto px-3 pt-3 sm:px-4 sm:pt-4 md:p-6 lg:p-8"
          style={{ paddingBottom: 'calc(6rem + env(safe-area-inset-bottom))' }}
        >
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* ── Mobile bottom tab bar ── */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-bg-primary border-t border-bg-secondary"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex h-16">
          {navLinks.map(({ name, to, icon: Icon }) => (
            <NavLink
              key={name}
              to={to}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${
                  isActive ? 'text-accent-primary' : 'text-text-secondary'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon active={isActive} />
                  <span className="text-[10px] font-semibold tracking-wide">{name}</span>
                </>
              )}
            </NavLink>
          ))}

          {/* Profile tab */}
          <button
            onClick={() => setShowProfileSheet(true)}
            className="flex-1 flex flex-col items-center justify-center gap-1 text-text-secondary transition-colors"
          >
            <Avatar initials={initials} size="sm" />
            <span className="text-[10px] font-semibold tracking-wide">Profile</span>
          </button>
        </div>
      </nav>

      {/* ── Mobile profile sheet ── */}
      {showProfileSheet && (
        <ProfileSheet
          displayName={displayName}
          email={user?.email ?? ''}
          initials={initials}
          onSignOut={() => { setShowProfileSheet(false); setShowLogoutConfirm(true); }}
          onClose={() => setShowProfileSheet(false)}
        />
      )}

      {/* ── Logout confirmation (mobile + desktop) ── */}
      {showLogoutConfirm && (
        <LogoutConfirmDialog
          onConfirm={handleLogoutConfirmed}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}
    </div>
  );
};
