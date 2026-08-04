import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronDown, User, Clock, Shield, Wrench, Headphones, Settings, LogOut } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import { ROLE_LABELS } from '../utils/permissions';
import type { UserRole } from '../types';

const ROLE_BADGE: Record<UserRole, { className: string; Icon: typeof Shield }> = {
  administrator: { className: 'bg-amber-100 text-amber-700', Icon: Shield },
  service_coordinator: { className: 'bg-blue-100 text-blue-700', Icon: Headphones },
  support_associate: { className: 'bg-slate-100 text-slate-700', Icon: User },
  technician: { className: 'bg-emerald-100 text-emerald-700', Icon: Wrench },
};

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleLogout() {
    setDropdownOpen(false);
    logout();
    navigate('/login');
  }

  return (
    <header className="sticky top-0 z-30 flex h-12 items-center justify-between border-b border-slate-200/80 bg-white/80 px-5 backdrop-blur-md">
      <Logo variant="header" />

      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-1.5 text-xs text-slate-500 md:flex">
          <Clock size={13} className="text-slate-400" />
          <span>
            Last Login: <span className="font-medium text-slate-700">{user?.lastLogin}</span>
          </span>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-full bg-orca-royal py-1 pl-1 pr-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-orca-royal-dark"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
              <User size={13} />
            </span>
            {user?.name}
            <ChevronDown size={12} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card-lg">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
                {user?.role && (() => {
                  const badge = ROLE_BADGE[user.role];
                  const RoleIcon = badge.Icon;
                  return (
                    <span className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${badge.className}`}>
                      <RoleIcon size={10} />
                      {ROLE_LABELS[user.role]}
                    </span>
                  );
                })()}
              </div>

              <div className="border-b border-slate-100 px-4 py-2 text-xs text-slate-500 md:hidden">
                Last Login: {user?.lastLogin}
              </div>

              <div className="py-1">
                <Link
                  to="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  <Settings size={16} className="text-slate-400" />
                  Settings
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
