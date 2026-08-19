import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  BookOpenText,
  Clock,
  BookMarked,
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  tourId?: string;
}

const NAV_ITEMS: NavItem[] = [
  { icon: LayoutDashboard, label: 'Home', path: '/dashboard', tourId: 'nav-dashboard' },
  { icon: MessageSquare, label: 'Council', path: '/chat', tourId: 'nav-council' },
  { icon: BookOpenText, label: 'Quran', path: '/quran', tourId: 'nav-quran' },
  { icon: Clock, label: 'Prayer', path: '/prayer-times', tourId: 'nav-prayer' },
  { icon: BookMarked, label: 'Journal', path: '/journal', tourId: 'nav-journal' },
];

export const MobileBottomNav: React.FC = () => {
  const isMobile = useIsMobile();
  const location = useLocation();

  if (!isMobile) return null;

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-background/90 backdrop-blur-xl border-t border-border pb-safe"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-14">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              data-tour={item.tourId}
              aria-current={active ? 'page' : undefined}
              className={`flex flex-col items-center justify-center gap-0.5 w-14 h-14 rounded-xl transition-colors ${
                active
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
