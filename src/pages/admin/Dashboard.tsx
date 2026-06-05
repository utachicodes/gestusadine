import React, { useEffect, useState } from "react";
import { Users, MessageSquare, FileText, Settings, Activity, Calendar, Video, BookOpen, Headphones, Database, DollarSign, TrendingUp, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTr } from "@/lib/i18n";
import { api } from "../../../convex/_generated/api";
import { useQuery, useAction } from "convex/react";

export const AdminDashboard = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const tr = useTr();
  const stats = useQuery(api.stats.dashboard);
  const fetchPostHogStats = useAction(api.posthog.fetchPostHogStats);
  const [phStats, setPhStats] = useState<{
    activeUsers7d: number;
    activeUsers30d: number;
    pageViews7d: number;
    pageViews30d: number;
    errors7d: number;
    errors30d: number;
  } | null>(null);
  const [phLoading, setPhLoading] = useState(true);

  useEffect(() => {
    fetchPostHogStats().then((result) => {
      setPhStats(result as any);
      setPhLoading(false);
    }).catch(() => setPhLoading(false));
  }, [fetchPostHogStats]);

  if (!isAdmin) {
    navigate("/");
    return null;
  }

  const statCards = [
    { title: { en: "Total Users", fr: "Utilisateurs" }, value: stats?.totalUsers ?? 0, icon: Users, color: "text-islamic-primary-green", bgColor: "bg-islamic-primary-green/10" },
    { title: { en: "Active Users", fr: "Utilisateurs actifs" }, value: stats?.activeUsers ?? 0, icon: Activity, color: "text-islamic-primary-teal", bgColor: "bg-islamic-primary-teal/10" },
    { title: { en: "Total Queries", fr: "Questions totales" }, value: stats?.totalQueries ?? 0, icon: MessageSquare, color: "text-islamic-primary-gold", bgColor: "bg-islamic-primary-gold/10" },
    { title: { en: "Today's Queries", fr: "Questions du jour" }, value: stats?.todayQueries ?? 0, icon: Activity, color: "text-islamic-primary-green", bgColor: "bg-islamic-primary-green/10" },
    { title: { en: "Documents", fr: "Documents" }, value: stats?.totalDocuments ?? 0, icon: FileText, color: "text-islamic-primary-teal", bgColor: "bg-islamic-primary-teal/10" },
  ];

  const actions = [
    { label: { en: "Configure AI Models", fr: "Configurer les modèles IA" }, icon: Settings, onClick: () => navigate("/admin/config") },
    { label: { en: "Manage Events", fr: "Gérer les événements" }, icon: Calendar, onClick: () => navigate("/admin/events") },
    { label: { en: "Manage Videos", fr: "Gérer les vidéos" }, icon: Video, onClick: () => navigate("/admin/videos") },
    { label: { en: "Manage Library", fr: "Gérer la bibliothèque" }, icon: BookOpen, onClick: () => navigate("/admin/library") },
    { label: { en: "Daily Content", fr: "Contenu quotidien" }, icon: FileText, onClick: () => navigate("/admin/daily") },
    { label: { en: "Manage Quizzes", fr: "Gérer les quiz" }, icon: FileText, onClick: () => navigate("/admin/quizzes") },
    { label: { en: "Manage Podcasts", fr: "Gérer les podcasts" }, icon: Headphones, onClick: () => navigate("/admin/podcasts") },
    { label: { en: "Islamic References (RAG)", fr: "Références islamiques (RAG)" }, icon: Database, onClick: () => navigate("/admin/rag") },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-islamic-dark">{tr({ en: "Admin Dashboard", fr: "Tableau de bord admin" })}</h1>
          <p className="text-islamic-dark/70 mt-2">{tr({ en: "Manage your GëstuSaDine platform", fr: "Gérez votre plateforme GëstuSaDine" })}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index} className="bg-card/80 backdrop-blur-sm border border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-islamic-dark/70">{tr(stat.title)}</p>
                    <p className="text-2xl font-bold text-islamic-dark mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card/80 backdrop-blur-sm border border-emerald-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-islamic-dark/70">{tr({ en: "Total Revenue", fr: "Revenu total" })}</p>
                  <p className="text-2xl font-bold text-islamic-dark mt-1">{stats?.totalRevenue?.toLocaleString() ?? 0} FCFA</p>
                </div>
                <div className="p-3 rounded-lg bg-emerald-100">
                  <DollarSign className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/80 backdrop-blur-sm border border-emerald-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-islamic-dark/70">{tr({ en: "Revenue (30 days)", fr: "Revenu (30 jours)" })}</p>
                  <p className="text-2xl font-bold text-islamic-dark mt-1">{stats?.revenueThisMonth?.toLocaleString() ?? 0} FCFA</p>
                </div>
                <div className="p-3 rounded-lg bg-emerald-100">
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/80 backdrop-blur-sm border border-emerald-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-islamic-dark/70">{tr({ en: "Paid Subscribers", fr: "Abonnés payants" })}</p>
                  <p className="text-2xl font-bold text-islamic-dark mt-1">{stats?.paidSubscribers ?? 0}</p>
                </div>
                <div className="p-3 rounded-lg bg-emerald-100">
                  <Users className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/80 backdrop-blur-sm border border-emerald-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-islamic-dark/70">{tr({ en: "Conversion Rate", fr: "Taux de conversion" })}</p>
                  <p className="text-2xl font-bold text-islamic-dark mt-1">
                    {stats?.totalUsers
                      ? `${((stats.paidSubscribers / stats.totalUsers) * 100).toFixed(1)}%`
                      : "0%"}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-emerald-100">
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-islamic-primary-teal" />
            <h2 className="text-lg font-semibold text-islamic-dark">{tr({ en: "PostHog Analytics", fr: "Analytiques PostHog" })}</h2>
          </div>
          {phLoading ? (
            <p className="text-sm text-muted-foreground">{tr({ en: "Loading analytics...", fr: "Chargement des analytiques..." })}</p>
          ) : phStats ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-card/80 backdrop-blur-sm border border-blue-200">
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-islamic-dark/70 mb-1">{tr({ en: "Active Users", fr: "Utilisateurs actifs" })}</p>
                  <div className="flex items-baseline gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">{tr({ en: "7 days", fr: "7 jours" })}</p>
                      <p className="text-2xl font-bold text-islamic-dark">{phStats.activeUsers7d}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{tr({ en: "30 days", fr: "30 jours" })}</p>
                      <p className="text-2xl font-bold text-islamic-dark">{phStats.activeUsers30d}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card/80 backdrop-blur-sm border border-blue-200">
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-islamic-dark/70 mb-1">{tr({ en: "Page Views", fr: "Pages vues" })}</p>
                  <div className="flex items-baseline gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">{tr({ en: "7 days", fr: "7 jours" })}</p>
                      <p className="text-2xl font-bold text-islamic-dark">{phStats.pageViews7d.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{tr({ en: "30 days", fr: "30 jours" })}</p>
                      <p className="text-2xl font-bold text-islamic-dark">{phStats.pageViews30d.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card/80 backdrop-blur-sm border border-blue-200">
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-islamic-dark/70 mb-1">{tr({ en: "Errors Captured", fr: "Erreurs capturées" })}</p>
                  <div className="flex items-baseline gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">{tr({ en: "7 days", fr: "7 jours" })}</p>
                      <p className="text-2xl font-bold text-islamic-dark">{phStats.errors7d}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{tr({ en: "30 days", fr: "30 jours" })}</p>
                      <p className="text-2xl font-bold text-islamic-dark">{phStats.errors30d}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{tr({ en: "PostHog not configured. Set POSTHOG_PERSONAL_API_KEY and POSTHOG_PROJECT_ID env vars.", fr: "PostHog non configuré. Définissez les variables d'env POSTHOG_PERSONAL_API_KEY et POSTHOG_PROJECT_ID." })}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border border-islamic-gold/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />{tr({ en: "Quick Actions", fr: "Actions rapides" })}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {actions.map((action) => (
                <Button key={action.label.en} variant="islamicOutline" className="w-full justify-start" onClick={action.onClick}>
                  <action.icon className="mr-2 h-4 w-4" />{tr(action.label)}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-islamic-gold/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />{tr({ en: "User Management", fr: "Gestion des utilisateurs" })}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-islamic-dark/70">{tr({ en: "Active Sessions", fr: "Sessions actives" })}</span>
                <span className="text-sm font-medium">{stats?.activeUsers ?? 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-islamic-dark/70">{tr({ en: "New Users Today", fr: "Nouveaux utilisateurs" })}</span>
                <span className="text-sm font-medium">{stats?.newUsersToday ?? 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-islamic-dark/70">{tr({ en: "Admin Users", fr: "Administrateurs" })}</span>
                <span className="text-sm font-medium">{stats?.adminUsers ?? 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border border-islamic-gold/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />{tr({ en: "Recent Activity", fr: "Activité récente" })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!stats?.recentActivity?.length ? (
              <div className="text-sm text-islamic-dark/60">{tr({ en: "No recent activity", fr: "Aucune activité récente" })}</div>
            ) : (
              <div className="space-y-4">
                {stats.recentActivity.map((activity: any) => (
                  <div key={activity._id} className="flex items-center justify-between py-2 border-b border-islamic-gold/20 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-islamic-dark">{activity.activityType}</p>
                      <p className="text-sm text-islamic-dark/70">{new Date(activity.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
