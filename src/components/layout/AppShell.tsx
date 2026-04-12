import React from "react";
import { useLocation, Outlet } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "./PageTransition";

interface AppShellProps {
  children?: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="app-shell min-h-screen bg-sacred-dark text-white selection:bg-white/10 selection:text-white transition-colors duration-500">
      <Navbar />

      <main className="relative z-10 w-full overflow-x-hidden pt-0">
        <PageTransition key={location.pathname}>
          {children || <Outlet />}
        </PageTransition>
      </main>

      <Footer />
    </div>
  );
};

export default AppShell;
