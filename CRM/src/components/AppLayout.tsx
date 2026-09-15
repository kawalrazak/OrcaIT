import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const MOBILE_QUERY = '(max-width: 768px)';

function isMobileViewport() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(MOBILE_QUERY).matches;
}

export default function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(isMobileViewport);

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);

    function syncToViewport(event?: MediaQueryListEvent) {
      const mobile = event ? event.matches : media.matches;
      // Mobile: keep closed by default. Desktop: open when leaving mobile.
      setSidebarCollapsed(mobile);
    }

    // Ensure first paint on mobile is closed even if SSR/hydration differed.
    syncToViewport();
    media.addEventListener('change', syncToViewport);
    return () => media.removeEventListener('change', syncToViewport);
  }, []);

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
