import { action } from "./_generated/server";

const POSTHOG_API = "https://us.posthog.com";

export const fetchPostHogStats = action({
  args: {},
  handler: async () => {
    const apiKey = process.env.POSTHOG_PERSONAL_API_KEY;
    const projectId = process.env.POSTHOG_PROJECT_ID;

    if (!apiKey || !projectId) {
      return null;
    }

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000).toISOString();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000).toISOString();

    async function fetchTrend(event: string, dateFrom: string, label: string) {
      const params = new URLSearchParams({
        event,
        date_from: dateFrom,
        date_to: now.toISOString(),
        interval: "day",
      });

      const res = await fetch(
        `${POSTHOG_API}/api/projects/${projectId}/insights/trend/?${params}`,
        {
          headers: { Authorization: `Bearer ${apiKey}` },
        },
      );

      if (!res.ok) {
        console.warn(`PostHog trend fetch failed for ${label}: ${res.status}`);
        return 0;
      }

      const data = await res.json();
      const result = data.result?.[0];
      if (!result?.data) return 0;

      return result.data.reduce((a: number, b: number) => a + b, 0);
    }

    async function fetchActiveUsers(dateFrom: string) {
      const params = new URLSearchParams({
        event: "$pageview",
        date_from: dateFrom,
        date_to: now.toISOString(),
        interval: "day",
        display: "ActionsLineGraph",
      });

      const res = await fetch(
        `${POSTHOG_API}/api/projects/${projectId}/insights/trend/?${params}`,
        {
          headers: { Authorization: `Bearer ${apiKey}` },
        },
      );

      if (!res.ok) return 0;

      const data = await res.json();
      return data.result?.length ?? 0;
    }

    const [pageViews7d, pageViews30d, errors7d, errors30d, activeUsers7d, activeUsers30d] =
      await Promise.all([
        fetchTrend("$pageview", sevenDaysAgo, "pageviews-7d"),
        fetchTrend("$pageview", thirtyDaysAgo, "pageviews-30d"),
        fetchTrend("$exception", sevenDaysAgo, "errors-7d"),
        fetchTrend("$exception", thirtyDaysAgo, "errors-30d"),
        fetchActiveUsers(sevenDaysAgo),
        fetchActiveUsers(thirtyDaysAgo),
      ]);

    return {
      activeUsers7d,
      activeUsers30d,
      pageViews7d,
      pageViews30d,
      errors7d,
      errors30d,
    };
  },
});
