import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AccountsProvider } from './context/AccountsContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { LeadsProvider } from './context/LeadsContext';
import AppLayout from './components/AppLayout';
import PermissionRoute from './components/PermissionRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AddLeadPage from './pages/AddLeadPage';
import ManageLeadsPage from './pages/ManageLeadsPage';
import OnsiteAppointmentsPage from './pages/OnsiteAppointmentsPage';
import OnlineAppointmentsPage from './pages/OnlineAppointmentsPage';
import ManageClientsPage from './pages/ManageClientsPage';
import MyTasksPage from './pages/MyTasksPage';
import SettingsPage from './pages/SettingsPage';
import ActivityLogPage from './pages/ActivityLogPage';
import { hasPermission } from './utils/permissions';
import type { ReactNode } from 'react';

function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
      Checking sign-in…
    </div>
  );
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { authReady, isAuthenticated } = useAuth();
  if (!authReady) return <AuthLoading />;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function ManageUsersRoute({ children }: { children: ReactNode }) {
  const { authReady, isAuthenticated, user } = useAuth();
  if (!authReady) return <AuthLoading />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!hasPermission(user?.permissions, 'manageUsers', user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

function PublicRoute({ children }: { children: ReactNode }) {
  const { authReady, isAuthenticated } = useAuth();
  if (!authReady) return <AuthLoading />;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
      <AccountsProvider>
        <AuthProvider>
          <LeadsProvider>
            <Routes>
              <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
              <Route path="/signup" element={<Navigate to="/login" replace />} />
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<PermissionRoute path="/dashboard"><DashboardPage /></PermissionRoute>} />
                <Route path="/my-tasks" element={<PermissionRoute path="/my-tasks"><MyTasksPage /></PermissionRoute>} />
                <Route path="/add-lead" element={<PermissionRoute path="/add-lead"><AddLeadPage /></PermissionRoute>} />
                <Route path="/manage-leads" element={<PermissionRoute path="/manage-leads"><ManageLeadsPage /></PermissionRoute>} />
                <Route path="/online-appointments" element={<PermissionRoute path="/online-appointments"><OnlineAppointmentsPage /></PermissionRoute>} />
                <Route path="/onsite-appointments" element={<PermissionRoute path="/onsite-appointments"><OnsiteAppointmentsPage /></PermissionRoute>} />
                <Route path="/manage-clients" element={<ManageUsersRoute><ManageClientsPage /></ManageUsersRoute>} />
                <Route path="/activity-log" element={<PermissionRoute path="/activity-log"><ActivityLogPage /></PermissionRoute>} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </LeadsProvider>
        </AuthProvider>
      </AccountsProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
