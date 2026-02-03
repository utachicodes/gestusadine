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
    <div className="app-shell min-h-screen bg-deep-slate text-white selection:bg-cyan-glow/30 selection:text-white">
      <GeometricBackground />

      <Navbar />

      <main className="relative z-10">
        <PageTransition key={location.pathname}>{children}</PageTransition>
      </main>

      <Footer />
    </div>
  );
};

export default AppShell;


