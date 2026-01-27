import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, FileText, Settings, Activity, Calendar, Video, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getDocuments, getDocumentCount, where, orderBy, limit, Timestamp } from '@/lib/firebase-helpers';
import { formatDistanceToNow } from 'date-fns';

const RecentActivity = () => {
  const [activities, setActivities] = useState<Array<{ user: string; action: string; time: string }>>([]);
  const [loading, setLoading] = useState(true);

  interface UserActivity {
    id: string;
    userId: string;
    email?: string;
    activityType: string;
    created_at: Timestamp;
  }

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // Fetch recent user activity
        const recentActivity = await getDocuments('user_activity', [
          orderBy('created_at', 'desc'),
          limit(5)
        ]) as UserActivity[];

        const formattedActivities: Array<{ user: string; action: string; time: string }> = [];

        // Add user activities
        for (const activity of recentActivity) {
          // Fetch user profile
          const userDoc = await getDocuments('users', [where('__name__', '==', activity.userId)]) as { email?: string }[];
          const userEmail = userDoc[0]?.email || 'Unknown';

          const actionMap: Record<string, string> = {
            'chat_query': 'Asked a question',
            'video_watch': 'Watched a video',
            'event_register': 'Registered for an event',
            'purchase': 'Made a purchase',
          };

          formattedActivities.push({
            user: userEmail,
            action: actionMap[activity.activityType] || 'Performed an action',
            time: activity.created_at ? formatDistanceToNow(activity.created_at.toDate(), { addSuffix: true }) : 'Recently',
          });
        }

        setActivities(formattedActivities.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch recent activity:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return <div className="text-sm text-islamic-dark/60">Loading...</div>;
  }

  if (activities.length === 0) {
    return <div className="text-sm text-islamic-dark/60">No recent activity</div>;
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-center justify-between py-2 border-b border-islamic-gold/20 last:border-0">
          <div>
            <p className="text-sm font-medium text-islamic-dark">{activity.user}</p>
            <p className="text-sm text-islamic-dark/70">{activity.action}</p>
          </div>
          <span className="text-xs text-islamic-dark/60">{activity.time}</span>
        </div>
      ))}
    </div>
  );
};

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalQueries: number;
  todayQueries: number;
  totalDocuments: number;
  newUsersToday?: number;
  adminUsers?: number;
}

export const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalQueries: 0,
    todayQueries: 0,
    totalDocuments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }

    // Fetch dashboard stats from Firebase
    const fetchStats = async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayTimestamp = Timestamp.fromDate(today);

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const sevenDaysTimestamp = Timestamp.fromDate(sevenDaysAgo);

        // Fetch total users
        const totalUsers = await getDocumentCount('users');

        // Fetch active users (users with activity in last 7 days)
        const activeUsersData = await getDocuments('user_activity', [
          where('created_at', '>=', sevenDaysTimestamp)
        ]) as unknown as { userId: string }[];
        const activeUsers = new Set(activeUsersData?.map(a => a.userId) || []).size;

        // Fetch total documents from library_books
        const totalDocuments = await getDocumentCount('library_books');

        // Fetch new users today
        const newUsersToday = await getDocumentCount('users', [
          where('created_at', '>=', todayTimestamp)
        ]);

        // Fetch admin users
        const adminUsers = await getDocumentCount('users', [
          where('role', '==', 'admin')
        ]);

        // Fetch total queries
        const totalQueries = await getDocumentCount('user_activity', [
          where('activityType', '==', 'chat_query')
        ]);

        // Fetch today's queries
        const todayQueries = await getDocumentCount('user_activity', [
          where('activityType', '==', 'chat_query'),
          where('created_at', '>=', todayTimestamp)
        ]);

        setStats({
          totalUsers: totalUsers || 0,
          activeUsers: activeUsers || 0,
          totalQueries: totalQueries || 0,
          todayQueries: todayQueries || 0,
          totalDocuments: totalDocuments || 0,
          newUsersToday: newUsersToday || 0,
          adminUsers: adminUsers || 0,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        // Fallback to 0 if error
        setStats({
          totalUsers: 0,
          activeUsers: 0,
          totalQueries: 0,
          todayQueries: 0,
          totalDocuments: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAdmin, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-islamic-primary-green"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-islamic-primary-green',
      bgColor: 'bg-islamic-primary-green/10',
    },
    {
      title: 'Active Users',
      value: stats.activeUsers,
      icon: Activity,
      color: 'text-islamic-primary-teal',
      bgColor: 'bg-islamic-primary-teal/10',
    },
    {
      title: 'Total Queries',
      value: stats.totalQueries,
      icon: MessageSquare,
      color: 'text-islamic-primary-gold',
      bgColor: 'bg-islamic-primary-gold/10',
    },
    {
      title: 'Today\'s Queries',
      value: stats.todayQueries,
      icon: Activity,
      color: 'text-islamic-primary-green',
      bgColor: 'bg-islamic-primary-green/10',
    },
    {
      title: 'Documents',
      value: stats.totalDocuments,
      icon: FileText,
      color: 'text-islamic-primary-teal',
      bgColor: 'bg-islamic-primary-teal/10',
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-islamic-dark">Admin Dashboard</h1>
          <p className="text-islamic-dark/70 mt-2">Manage your GëstuSaDine platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index} className="bg-card/80 backdrop-blur-sm border border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-islamic-dark/70">{stat.title}</p>
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border border-islamic-gold/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="islamicOutline"
                className="w-full justify-start"
                onClick={() => navigate('/admin/config')}
              >
                <Settings className="mr-2 h-4 w-4" />
                Configure AI Models
              </Button>
              <Button
                variant="islamicOutline"
                className="w-full justify-start"
                onClick={() => navigate('/documents')}
              >
                <FileText className="mr-2 h-4 w-4" />
                Manage Documents
              </Button>
              <Button
                variant="islamicOutline"
                className="w-full justify-start"
                onClick={() => navigate('/admin/events')}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Manage Events
              </Button>
              <Button
                variant="islamicOutline"
                className="w-full justify-start"
                onClick={() => navigate('/admin/videos')}
              >
                <Video className="mr-2 h-4 w-4" />
                Manage Videos
              </Button>

              <Button
                variant="islamicOutline"
                className="w-full justify-start"
                onClick={() => navigate('/admin/library')}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Manage Library
              </Button>
              <Button
                variant="islamicOutline"
                className="w-full justify-start"
                onClick={() => navigate('/admin/rag-test')}
              >
                <Activity className="mr-2 h-4 w-4" />
                Test RAG System
              </Button>
              <Button
                variant="islamicOutline"
                className="w-full justify-start"
                onClick={() => window.open('/api/council/health', '_blank')}
              >
                <Activity className="mr-2 h-4 w-4" />
                Check System Health
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-islamic-gold/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-islamic-dark/70">Active Sessions</span>
                <span className="text-sm font-medium">{stats.activeUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-islamic-dark/70">New Users Today</span>
                <span className="text-sm font-medium">{stats.newUsersToday || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-islamic-dark/70">Admin Users</span>
                <span className="text-sm font-medium">{stats.adminUsers || 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-white/80 backdrop-blur-sm border border-islamic-gold/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
