import React from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { DashboardTopbar } from './DashboardTopbar';
import { MobileBottomNav } from './MobileBottomNav';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('sidebar-collapsed') === 'true';
  });
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const toggleCollapsed = React.useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sidebar-collapsed', String(next));
      return next;
    });
  }, []);

  // Close the mobile drawer whenever the route changes.
  React.useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="relative isolate flex h-[100dvh] bg-background overflow-hidden">
      {/* ---------------------------------------------------------------------
          Layered ambient background. Sits at z-0 (above the base cream) while
          the app chrome is lifted to z-10, so the shading actually shows
          through the transparent gaps between cards.
          --------------------------------------------------------------------- */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Soft diagonal wash  gentle warm→mint shading for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5" />
        {/* Faint geometric Islamic texture */}
        <div className="absolute inset-0 bg-islamic-pattern opacity-60" />
        {/* Emerald glow  top right */}
        <div className="absolute -top-[15%] -right-[10%] w-[55%] h-[55%] rounded-full bg-primary/10 blur-[150px]" />
        {/* Teal glow  bottom left */}
        <div className="absolute -bottom-[18%] -left-[8%] w-[50%] h-[55%] rounded-full bg-accent/10 blur-[160px]" />
        {/* Center highlight  lifts the working area */}
        <div className="absolute top-[28%] left-1/2 -translate-x-1/2 w-[60%] h-[45%] rounded-full bg-background/80 blur-[120px]" />
        {/* Top sheen */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background/50 to-transparent" />
      </div>

      {/* Desktop sidebar */}
      <div className="relative z-10 hidden md:flex flex-shrink-0">
        <Sidebar collapsed={collapsed} onToggleCollapsed={toggleCollapsed} />
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm animate-in fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-64 shadow-2xl animate-in slide-in-from-left duration-300">
            <Sidebar collapsed={false} onToggleCollapsed={() => setMobileOpen(false)} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main column */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardTopbar onOpenMobileSidebar={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto overscroll-contain custom-scrollbar pb-safe md:pb-safe pb-20">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <MobileBottomNav />
    </div>
  );
};
