import React from 'react';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      {/* Global Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-islamic-blue/5 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute top-[40%] right-[-10%] w-[50%] h-[50%] bg-islamic-gold/5 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-[-10%] left-[20%] w-[30%] h-[30%] bg-islamic-green/5 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '4s' }} />
        <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay" style={{ backgroundImage: 'url("/noise.png")' }}></div>
      </div>

      <Sidebar />
      <main className="flex-1 overflow-y-auto flex flex-col relative z-10 custom-scrollbar">
        {children}
      </main>
    </div>
  );
};

