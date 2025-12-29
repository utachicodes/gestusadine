import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/auth/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { PublicRoute } from "@/components/layout/PublicRoute";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Fatwa from "./pages/Fatwa";
import Fiqh from "./pages/Fiqh";
import Language from "./pages/Language";
import Circle from "./pages/Circle";
import { CircleKnowledge } from "./pages/admin/CircleKnowledge";
import AdminConfig from "./pages/AdminConfig";
import DocumentUpload from "./pages/DocumentUpload";
import Login from "./pages/auth/Login";
import AppShell from "./components/layout/AppShell";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { AdminDashboard } from "@/pages/admin/Dashboard";
import MediaPage from "./pages/MediaPage";
import EventsPage from "./pages/EventsPage";
import ShopPage from "./pages/ShopPage";
import ManageEvents from "./pages/admin/ManageEvents";
import ManageVideos from "./pages/admin/ManageVideos";
import ManageProducts from "./pages/admin/ManageProducts";
import ManageDaily from "./pages/admin/ManageDaily";
import Library from "./pages/Library";
import ManageLibrary from "./pages/admin/ManageLibrary";
import RAGTest from "./pages/admin/RAGTest";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <LanguageProvider>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <PublicRoute>
                      <AppShell><Index /></AppShell>
                    </PublicRoute>
                  } 
                />
                <Route path="/login" element={<AppShell><Login /></AppShell>} />
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
                <Route path="/fatwa" element={<AppShell><Fatwa /></AppShell>} />
                <Route path="/fiqh" element={<AppShell><Fiqh /></AppShell>} />
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
                  path="/admin/products"
                  element={
                    <ProtectedRoute adminOnly>
                      <DashboardLayout>
                        <ManageProducts />
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
                  path="/shop"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <ShopPage />
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
                {/* Catch-all */}
                <Route path="*" element={<AppShell><NotFound /></AppShell>} />
                </Routes>
            </BrowserRouter>
          </AuthProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
