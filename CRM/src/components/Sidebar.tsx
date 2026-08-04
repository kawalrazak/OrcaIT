import { Link, useLocation } from 'react-router-dom';
import {
  PlusCircle,
  List,
  CalendarCheck,
  LogOut,
  LayoutDashboard,
  Users,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import { canAccessRoute } from '../utils/permissions';

const allNav = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/add-lead', label: 'Add Leads', icon: PlusCircle },
  { path: '/manage-leads', label: 'Manage Leads', icon: List },
  { path: '/onsite-appointments', label: 'Onsite Appointments', icon: CalendarCheck },
  { path: '/manage-clients', label: 'Manage Users', icon: Users },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const { logout, user } = useAuth();
  const navItems = allNav.filter((item) =>
    canAccessRoute(item.path, user?.role, user?.permissions),
  );

  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen flex-col bg-sidebar transition-all duration-300 ${
        collapsed ? 'w-12' : 'w-48'
      }`}
    >
      <div
        className={`border-b border-white/10 px-2 py-2.5 ${
          collapsed ? 'flex flex-col items-center gap-1.5' : 'flex items-center justify-between gap-1'
        }`}
      >
        {collapsed ? <Logo variant="icon" /> : <Logo variant="sidebar" />}
        <button
          type="button"
          onClick={onToggle}
          className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-orca-royal ${
            collapsed ? '' : ''
          }`}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronsRight size={15} /> : <ChevronsLeft size={15} />}
        </button>
      </div>

      <nav className="flex-1 space-y-0.5 px-1 py-3">
        {navItems.map(({ path, label, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              title={collapsed ? label : undefined}
              className={`group flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium transition-all duration-200 ${
                active
                  ? 'bg-orca-yellow text-orca-royal-dark shadow-md shadow-orca-yellow/30'
                  : 'text-slate-300 hover:bg-sidebar-hover hover:text-white'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <Icon
                size={16}
                className={active ? 'text-orca-royal-dark' : 'text-slate-400 group-hover:text-white'}
              />
              <span className={`truncate ${collapsed ? 'hidden' : ''}`}>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-2">
        <button
          onClick={logout}
          className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium text-slate-300 transition-all hover:bg-red-500/10 hover:text-red-400 ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut size={16} />
          <span className={collapsed ? 'hidden' : ''}>Logout</span>
        </button>
      </div>
    </aside>
  );
}
