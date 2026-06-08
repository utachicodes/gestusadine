import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Generate a new Islamic quiz question every day at midnight UTC
crons.daily(
  "generate daily quiz",
  { hourUTC: 0, minuteUTC: 0 },
  internal.quizScheduler.generateDailyQuiz,
);

export default crons;
