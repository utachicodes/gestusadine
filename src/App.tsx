import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/auth/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { PublicRoute } from "@/components/layout/PublicRoute";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Index from "./pages/core/Index";
import NotFound from "./pages/core/NotFound";
import Dashboard from "./pages/user/Dashboard";
import Profile from "./pages/user/Profile";
import Fatwa from "./pages/islamic/Fatwa";
import Fiqh from "./pages/islamic/Fiqh";
import Language from "./pages/core/Language";
import Circle from "./pages/community/Circle";
import { CircleKnowledge } from "./pages/admin/CircleKnowledge";
import AdminConfig from "./pages/admin/AdminConfig";
import DocumentUpload from "./pages/user/DocumentUpload";
import Login from "./pages/auth/Login";
import AppShell from "./components/layout/AppShell";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { AdminDashboard } from "@/pages/admin/Dashboard";
import MediaPage from "./pages/knowledge/MediaPage";
import EventsPage from "./pages/knowledge/EventsPage";
import ManageEvents from "./pages/admin/ManageEvents";
import ManageVideos from "./pages/admin/ManageVideos";
import ManageDaily from "./pages/admin/ManageDaily";
import Library from "./pages/knowledge/Library";
import ManageLibrary from "./pages/admin/ManageLibrary";
import RAGTest from "./pages/admin/RAGTest";

import About from "./pages/core/About";
import Contact from "./pages/core/Contact";
import FAQ from "./pages/core/FAQ";
import Privacy from "./pages/core/Privacy";
import Terms from "./pages/core/Terms";
import Classes from "./pages/knowledge/Classes";
import HadithPage from "./pages/islamic/Hadith";
import TawhidPage from "./pages/islamic/Tawhid";

import { ThemeProvider } from "@/contexts/ThemeContext";

import { useState } from "react";


const queryClient = new QueryClient();

const App = () => {




  return (
    <ErrorBoundary>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <LanguageProvider>
                <BrowserRouter>
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <PublicRoute>
                          <AppShell>
                            <Index />
                          </AppShell>
                        </PublicRoute>
                      }
                    />
                    <Route path="/about" element={<AppShell><About /></AppShell>} />
                    <Route path="/contact" element={<AppShell><Contact /></AppShell>} />
                    <Route path="/faq" element={<AppShell><FAQ /></AppShell>} />
                    <Route path="/privacy" element={<AppShell><Privacy /></AppShell>} />
                    <Route path="/terms" element={<AppShell><Terms /></AppShell>} />
                    <Route
                      path="/login"
                      element={
                        <AppShell>
                          <Login />
                        </AppShell>
                      }
                    />
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <DashboardLayout>
                            <Dashboard />
                          </DashboardLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <DashboardLayout>
                            <Profile />
                          </DashboardLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/fatwa"
                      element={
                        <AppShell>
                          <Fatwa />
                        </AppShell>
                      }
                    />
                    <Route
                      path="/fiqh"
                      element={
                        <AppShell>
                          <Fiqh />
                        </AppShell>
                      }
                    />
                    <Route
                      path="/language"
                      element={
                        <ProtectedRoute>
                          <DashboardLayout>
                            <Language />
                          </DashboardLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/circle"
                      element={
                        <ProtectedRoute adminOnly>
                          <DashboardLayout>
                            <CircleKnowledge />
                          </DashboardLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/chat"
                      element={
                        <ProtectedRoute>
                          <DashboardLayout>
                            <ChatInterface />
                          </DashboardLayout>
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute adminOnly>
                          <DashboardLayout>
                            <AdminDashboard />
                          </DashboardLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/config"
                      element={
                        <ProtectedRoute adminOnly>
                          <DashboardLayout>
                            <AdminConfig />
                          </DashboardLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/events"
                      element={
                        <ProtectedRoute adminOnly>
                          <DashboardLayout>
                            <ManageEvents />
                          </DashboardLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/videos"
                      element={
                        <ProtectedRoute adminOnly>
                          <DashboardLayout>
                            <ManageVideos />
                          </DashboardLayout>
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/admin/daily"
                      element={
                        <ProtectedRoute adminOnly>
                          <DashboardLayout>
                            <ManageDaily />
                          </DashboardLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/documents"
                      element={
                        <ProtectedRoute adminOnly>
                          <DashboardLayout>
                            <DocumentUpload />
                          </DashboardLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/media"
                      element={
                        <ProtectedRoute>
                          <DashboardLayout>
                            <MediaPage />
                          </DashboardLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/events"
                      element={
                        <ProtectedRoute>
                          <DashboardLayout>
                            <EventsPage />
                          </DashboardLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/library"
                      element={
                        <ProtectedRoute>
                          <DashboardLayout>
                            <Library />
                          </DashboardLayout>
                        </ProtectedRoute>
                      }
                    />


                    <Route
                      path="/admin/library"
                      element={
                        <ProtectedRoute adminOnly>
                          <DashboardLayout>
                            <ManageLibrary />
                          </DashboardLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/rag-test"
                      element={
                        <ProtectedRoute adminOnly>
                          <DashboardLayout>
                            <RAGTest />
                          </DashboardLayout>
                        </ProtectedRoute>
                      }
                    />

                    {/* Islamic Education Routes */}
                    <Route
                      path="/classes"
                      element={
                        <ProtectedRoute>
                          <DashboardLayout>
                            <Classes />
                          </DashboardLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/hadith"
                      element={
                        <AppShell>
                          <HadithPage />
                        </AppShell>
                      }
                    />
                    <Route
                      path="/tawhid"
                      element={
                        <AppShell>
                          <TawhidPage />
                        </AppShell>
                      }
                    />

                    {/* Catch-all */}
                    <Route
                      path="*"
                      element={
                        <AppShell>
                          <NotFound />
                        </AppShell>
                      }
                    />
                  </Routes>
                </BrowserRouter>
              </LanguageProvider>
            </TooltipProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
