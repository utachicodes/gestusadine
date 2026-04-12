import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GeometricBackground from "./GeometricBackground";
import PageTransition from "./PageTransition";

interface AppShellProps {
  children: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="app-shell min-h-screen bg-saas-bg text-slate-900 selection:bg-brand-200 selection:text-brand-900 transition-colors duration-500">
      <Navbar />

      <main className="relative z-10 w-full overflow-x-hidden">
        <PageTransition key={location.pathname}>{children}</PageTransition>
      </main>

      <Footer />
    </div>
  );
};

export default AppShell;
