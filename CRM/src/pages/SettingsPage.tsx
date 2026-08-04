import { User, Mail, Shield, Clock } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import { useAuth } from '../context/AuthContext';
import { ROLE_LABELS } from '../utils/permissions';

export default function SettingsPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Settings' }]} />

      <div className="mt-6">
        <h1 className="text-xl font-bold text-orca-royal-dark">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Your account and profile information</p>
      </div>

      <div className="mt-6 max-w-lg rounded-xl border border-slate-200/80 bg-white p-6 shadow-card">
        <h2 className="mb-4 text-sm font-semibold text-slate-800">Account Details</h2>
        <dl className="space-y-4">
          <div className="flex items-center gap-3">
            <User size={16} className="text-orca-royal" />
            <div>
              <dt className="text-xs text-slate-500">Name</dt>
              <dd className="text-sm font-medium text-slate-800">{user.name}</dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail size={16} className="text-orca-royal" />
            <div>
              <dt className="text-xs text-slate-500">Email</dt>
              <dd className="text-sm font-medium text-slate-800">{user.email}</dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Shield size={16} className="text-orca-royal" />
            <div>
              <dt className="text-xs text-slate-500">Role</dt>
              <dd className="text-sm font-medium text-slate-800">{ROLE_LABELS[user.role]}</dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock size={16} className="text-orca-royal" />
            <div>
              <dt className="text-xs text-slate-500">Last Login</dt>
              <dd className="text-sm font-medium text-slate-800">{user.lastLogin}</dd>
            </div>
          </div>
        </dl>
      </div>
    </div>
  );
}
