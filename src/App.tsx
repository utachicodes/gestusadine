import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/auth/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CartProvider } from "@/contexts/CartContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { PublicRoute } from "@/components/layout/PublicRoute";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Index from "./pages/core/Index";
import Help from "./pages/core/Help";
import NotFound from "./pages/core/NotFound";
import Dashboard from "./pages/user/Dashboard";
import Profile from "./pages/user/Profile";
import Language from "./pages/core/Language";
import AdminConfig from "./pages/admin/AdminConfig";
import { AccessGuard } from "./components/auth/AccessGuard";
import Login from "./pages/auth/Login";
import AppShell from "./components/layout/AppShell";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { AdminDashboard } from "@/pages/admin/Dashboard";
import EventsPage from "./pages/knowledge/EventsPage";
import ManageEvents from "./pages/admin/ManageEvents";
import ManageVideos from "./pages/admin/ManageVideos";
import ManageDaily from "./pages/admin/ManageDaily";
import Library from "./pages/knowledge/Library";
import ManageLibrary from "./pages/admin/ManageLibrary";
import ManageQuizzes from "./pages/admin/ManageQuizzes";
import ManagePodcasts from "./pages/admin/ManagePodcasts";

import About from "./pages/core/About";
import Contact from "./pages/core/Contact";
import FAQ from "./pages/core/FAQ";
import Privacy from "./pages/core/Privacy";
import Terms from "./pages/core/Terms";
import Classes from "./pages/knowledge/Classes";
import HadithPage from "./pages/islamic/Hadith";
import TawhidPage from "./pages/islamic/Tawhid";
import PodcastsPage from "./pages/knowledge/PodcastsPage";
import CommunityPage from "./pages/community/CommunityPage";
import CircleDetail from "./pages/community/CircleDetail";
import IslamicShop from "./pages/islamic/IslamicShop";
import Settings from "./pages/user/Settings";
import Pricing from "./pages/core/Pricing";
import Quran from "./pages/quran/Quran";
import SurahView from "./pages/quran/SurahView";
import PrayerTimes from "./pages/tools/PrayerTimes";
import HijriCalendar from "./pages/tools/HijriCalendar";
import ZakatCalculator from "./pages/tools/ZakatCalculator";

import { ThemeProvider } from "@/contexts/ThemeContext";

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
                <CartProvider>
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
                        <Route path="/pricing" element={<AppShell><Pricing /></AppShell>} />
                        <Route path="/login" element={<Login />} />
                        <Route
                          path="/shop"
                          element={
                            <AppShell>
                              <IslamicShop />
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
                          path="/settings"
                          element={
                            <ProtectedRoute>
                              <DashboardLayout>
                                <Settings />
                              </DashboardLayout>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/help"
                          element={
                            <ProtectedRoute>
                              <DashboardLayout>
                                <Help />
                              </DashboardLayout>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/quran"
                          element={
                            <ProtectedRoute>
                              <DashboardLayout>
                                <Quran />
                              </DashboardLayout>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/quran/:number"
                          element={
                            <ProtectedRoute>
                              <DashboardLayout>
                                <SurahView />
                              </DashboardLayout>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/calendar"
                          element={
                            <ProtectedRoute>
                              <DashboardLayout>
                                <HijriCalendar />
                              </DashboardLayout>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/zakat"
                          element={
                            <ProtectedRoute>
                              <DashboardLayout>
                                <ZakatCalculator />
                              </DashboardLayout>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/prayer-times"
                          element={
                            <ProtectedRoute>
                              <DashboardLayout>
                                <PrayerTimes />
                              </DashboardLayout>
                            </ProtectedRoute>
                          }
                        />
                        {/* Council is open to all signed-in users — Seekers get a
                            metered "taste" (monthly cap enforced in ChatInterface),
                            paid tiers get more. */}
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
                        {/* Media merged into Library — keep old links working. */}
                        <Route path="/media" element={<Navigate to="/library" replace />} />
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
                          path="/admin/quizzes"
                          element={
                            <ProtectedRoute adminOnly>
                              <DashboardLayout>
                                <ManageQuizzes />
                              </DashboardLayout>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/admin/podcasts"
                          element={
                            <ProtectedRoute adminOnly>
                              <DashboardLayout>
                                <ManagePodcasts />
                              </DashboardLayout>
                            </ProtectedRoute>
                          }
                        />

                        {/* Islamic Education Routes */}
                        {/* Courses & classes are a Student-tier feature. */}
                        <Route
                          path="/classes"
                          element={
                            <ProtectedRoute>
                              <AccessGuard requiredTier="student">
                                <DashboardLayout>
                                  <Classes />
                                </DashboardLayout>
                              </AccessGuard>
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
                        <Route
                          path="/podcasts"
                          element={
                            <AppShell>
                              <PodcastsPage />
                            </AppShell>
                          }
                        />
                        <Route
                          path="/community"
                          element={
                            <AppShell>
                              <CommunityPage />
                            </AppShell>
                          }
                        />
                        <Route
                          path="/community/:circleId"
                          element={
                            <AppShell>
                              <CircleDetail />
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
                </CartProvider>
              </LanguageProvider>
            </TooltipProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
