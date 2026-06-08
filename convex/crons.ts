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

export default crons;
