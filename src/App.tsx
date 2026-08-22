import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/auth/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { PublicRoute } from "@/components/layout/PublicRoute";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { PostHogProvider } from "@/components/layout/PostHogProvider";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AccessGuard } from "./components/auth/AccessGuard";
import { OnboardingTutorial } from "./components/onboarding/OnboardingTutorial";
import { InstallPrompt } from "./components/pwa/InstallPrompt";
import { lazy, Suspense } from "react";
import AppShell from "./components/layout/AppShell";

// ── Core (eagerly loaded — hit on every cold visit) ──────────────────────────
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Index from "./pages/core/Index";
import NotFound from "./pages/core/NotFound";

// ── Everything else: lazy-loaded per route ───────────────────────────────────
const Dashboard       = lazy(() => import("./pages/user/Dashboard"));
const Profile         = lazy(() => import("./pages/user/Profile"));
const Settings        = lazy(() => import("./pages/user/Settings"));
const Language        = lazy(() => import("./pages/core/Language"));
const Help            = lazy(() => import("./pages/core/Help"));
const About           = lazy(() => import("./pages/core/About"));
const Contact         = lazy(() => import("./pages/core/Contact"));
const FAQ             = lazy(() => import("./pages/core/FAQ"));
const Privacy         = lazy(() => import("./pages/core/Privacy"));
const Terms           = lazy(() => import("./pages/core/Terms"));
const DataCompliance  = lazy(() => import("./pages/core/DataCompliance"));

const ChatInterface   = lazy(() => import("./components/chat/ChatInterface").then(m => ({ default: m.ChatInterface })));
const Quran           = lazy(() => import("./pages/quran/Quran"));
const SurahView       = lazy(() => import("./pages/quran/SurahView"));
const PrayerTimes     = lazy(() => import("./pages/tools/PrayerTimes"));
const HijriCalendar   = lazy(() => import("./pages/tools/HijriCalendar"));
const ZakatCalculator = lazy(() => import("./pages/tools/ZakatCalculator"));
const QiblaFinder    = lazy(() => import("./pages/tools/QiblaFinder"));
const EventsPage      = lazy(() => import("./pages/knowledge/EventsPage"));
const Library         = lazy(() => import("./pages/knowledge/Library"));
const Classes         = lazy(() => import("./pages/knowledge/Classes"));
const Journal         = lazy(() => import("./pages/wellness/Journal"));
const PeriodTracker   = lazy(() => import("./pages/wellness/PeriodTracker"));
const Duas            = lazy(() => import("./pages/islamic/Duas"));
const Azkar           = lazy(() => import("./pages/islamic/Azkar"));

// ── Admin (lazy — regular users never load these) ────────────────────────────
const AdminDashboard  = lazy(() => import("./pages/admin/Dashboard").then(m => ({ default: m.AdminDashboard })));
const AdminConfig     = lazy(() => import("./pages/admin/AdminConfig"));
const ManageEvents    = lazy(() => import("./pages/admin/ManageEvents"));
const ManageVideos    = lazy(() => import("./pages/admin/ManageVideos"));
const ManageDaily     = lazy(() => import("./pages/admin/ManageDaily"));
const ManageLibrary   = lazy(() => import("./pages/admin/ManageLibrary"));
const ManageQuizzes   = lazy(() => import("./pages/admin/ManageQuizzes"));
const ManageRag       = lazy(() => import("./pages/admin/ManageRag"));
const ThemeDesigner   = lazy(() => import("./pages/admin/ThemeDesigner"));

// Minimal fallback — no spinner flash on fast connections
const PageShell = () => (
  <div className="flex-1 flex items-center justify-center min-h-[40vh]">
    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

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
                <CookieConsent />
                <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                  <PostHogProvider>
                    <OnboardingTutorial />
                    <InstallPrompt />
                    <Suspense fallback={<PageShell />}>
                      <Routes>
                        {/* ── Public ── */}
                        <Route path="/" element={<PublicRoute><AppShell><Index /></AppShell></PublicRoute>} />
                        <Route path="/about"   element={<AppShell><About /></AppShell>} />
                        <Route path="/contact" element={<AppShell><Contact /></AppShell>} />
                        <Route path="/faq"     element={<AppShell><FAQ /></AppShell>} />
                        <Route path="/privacy"          element={<AppShell><Privacy /></AppShell>} />
                        <Route path="/terms"            element={<AppShell><Terms /></AppShell>} />
                        <Route path="/data-compliance"  element={<AppShell><DataCompliance /></AppShell>} />
                        <Route path="/login"   element={<Login />} />
                        <Route path="/signup"  element={<Signup />} />

                        {/* ── Authenticated ── */}
                        <Route path="/dashboard"    element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} />
                        <Route path="/profile"      element={<ProtectedRoute><DashboardLayout><Profile /></DashboardLayout></ProtectedRoute>} />
                        <Route path="/settings"     element={<ProtectedRoute><DashboardLayout><Settings /></DashboardLayout></ProtectedRoute>} />
                        <Route path="/language"     element={<ProtectedRoute><DashboardLayout><Language /></DashboardLayout></ProtectedRoute>} />
                        <Route path="/help"         element={<ProtectedRoute><DashboardLayout><Help /></DashboardLayout></ProtectedRoute>} />
                        <Route path="/chat"         element={<ProtectedRoute><DashboardLayout><ChatInterface /></DashboardLayout></ProtectedRoute>} />
                        <Route path="/quran"        element={<ProtectedRoute><DashboardLayout><Quran /></DashboardLayout></ProtectedRoute>} />
                        <Route path="/quran/:number" element={<ProtectedRoute><DashboardLayout><SurahView /></DashboardLayout></ProtectedRoute>} />
                        <Route path="/prayer-times" element={<ProtectedRoute><DashboardLayout><PrayerTimes /></DashboardLayout></ProtectedRoute>} />
                        <Route path="/calendar"     element={<ProtectedRoute><DashboardLayout><HijriCalendar /></DashboardLayout></ProtectedRoute>} />
                        <Route path="/zakat"        element={<ProtectedRoute><DashboardLayout><ZakatCalculator /></DashboardLayout></ProtectedRoute>} />
                        <Route path="/qibla"        element={<ProtectedRoute><DashboardLayout><QiblaFinder /></DashboardLayout></ProtectedRoute>} />
                        <Route path="/events"       element={<ProtectedRoute><DashboardLayout><EventsPage /></DashboardLayout></ProtectedRoute>} />
                        <Route path="/library"      element={<ProtectedRoute><DashboardLayout><Library /></DashboardLayout></ProtectedRoute>} />
                        <Route path="/journal"      element={<ProtectedRoute><DashboardLayout><Journal /></DashboardLayout></ProtectedRoute>} />
                        <Route path="/period-tracker" element={<ProtectedRoute><DashboardLayout><PeriodTracker /></DashboardLayout></ProtectedRoute>} />
                        <Route path="/duas"        element={<ProtectedRoute><DashboardLayout><Duas /></DashboardLayout></ProtectedRoute>} />
                        <Route path="/azkar"       element={<ProtectedRoute><DashboardLayout><Azkar /></DashboardLayout></ProtectedRoute>} />
                        <Route path="/classes"      element={<ProtectedRoute><AccessGuard requiredTier="student"><DashboardLayout><Classes /></DashboardLayout></AccessGuard></ProtectedRoute>} />

                        {/* ── Admin ── */}
                        <Route path="/admin"              element={<ProtectedRoute adminOnly><DashboardLayout><AdminDashboard /></DashboardLayout></ProtectedRoute>} />
                        <Route path="/admin/config"       element={<ProtectedRoute adminOnly><DashboardLayout><AdminConfig /></DashboardLayout></ProtectedRoute>} />
                        <Route path="/admin/events"       element={<ProtectedRoute adminOnly><DashboardLayout><ManageEvents /></DashboardLayout></ProtectedRoute>} />
                        <Route path="/admin/videos"       element={<ProtectedRoute adminOnly><DashboardLayout><ManageVideos /></DashboardLayout></ProtectedRoute>} />
                        <Route path="/admin/daily"        element={<ProtectedRoute adminOnly><DashboardLayout><ManageDaily /></DashboardLayout></ProtectedRoute>} />
                        <Route path="/admin/library"      element={<ProtectedRoute adminOnly><DashboardLayout><ManageLibrary /></DashboardLayout></ProtectedRoute>} />
                        <Route path="/admin/quizzes"      element={<ProtectedRoute adminOnly><DashboardLayout><ManageQuizzes /></DashboardLayout></ProtectedRoute>} />
                        <Route path="/admin/rag"          element={<ProtectedRoute adminOnly><DashboardLayout><ManageRag /></DashboardLayout></ProtectedRoute>} />
                        <Route path="/admin/theme"        element={<ProtectedRoute adminOnly><DashboardLayout><ThemeDesigner /></DashboardLayout></ProtectedRoute>} />

                        {/* ── Redirects ── */}
                        <Route path="/media" element={<Navigate to="/library" replace />} />
                        <Route path="*"      element={<AppShell><NotFound /></AppShell>} />
                      </Routes>
                    </Suspense>
                  </PostHogProvider>
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
