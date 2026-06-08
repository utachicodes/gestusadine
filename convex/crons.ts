import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Generate a new Islamic quiz question every day at midnight UTC
crons.daily(
  "generate daily quiz",
  { hourUTC: 0, minuteUTC: 0 },
  internal.quizScheduler.generateDailyQuiz,
);

// Generate daily spiritual content (ayah, hadith, dua, fact, action) at midnight UTC
crons.daily(
  "generate daily content",
  { hourUTC: 0, minuteUTC: 5 },
  internal.dailyScheduler.generateDailyContent,
);

// Schedule per-user prayer time push notifications for the day (runs at 00:10 UTC
// so daily content is already generated when reminders go out)
crons.daily(
  "schedule prayer notifications",
  { hourUTC: 0, minuteUTC: 10 },
  internal.notifications.scheduleDailyPrayerNotifications,
);

// Schedule Quran + daily content reminder pushes (time-of-day is per-user preference)
crons.daily(
  "schedule reminder notifications",
  { hourUTC: 0, minuteUTC: 15 },
  internal.notifications.scheduleReminders,
);

export default crons;
