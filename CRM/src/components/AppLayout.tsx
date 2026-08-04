import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((prev) => !prev)} />
      <div className={`min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'ml-12' : 'ml-48'}`}>
        <Header />
        <main className="mx-auto max-w-[80vw] p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
