import React from "react";
import { useLocation, Outlet } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "./PageTransition";
import LenisProvider from "@/components/effects/LenisProvider";

interface AppShellProps {
  children?: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const location = useLocation();

  return (
    <LenisProvider>
      <div className="app-shell min-h-screen bg-background text-foreground transition-colors duration-500">
        <Navbar />

        <main className="relative z-10 w-full overflow-x-hidden pt-0">
          <PageTransition key={location.pathname}>
            {children || <Outlet />}
          </PageTransition>
        </main>

        <Footer />
      </div>
    </LenisProvider>
  );
};

export default AppShell;
