import { promises as fs } from "fs";
import path from "path";

// Server can't read the client's localStorage, so the client pushes a small
// per-user summary of training session dates here whenever sessions change.
// The weekly-check cron reads it back to decide, per user, whether to email
// a reminder to that user's own address.
const DATA_DIR = path.join(process.cwd(), "data");
const SUMMARY_PATH = path.join(DATA_DIR, "weekly-summary.json");

export interface UserWeeklyData {
  email: string;
  trainingDates: string[];
  updatedAt: string;
}

export interface WeeklySummary {
  users: Record<string, UserWeeklyData>;
}

export async function readWeeklySummary(): Promise<WeeklySummary> {
  try {
    const raw = await fs.readFile(SUMMARY_PATH, "utf-8");
    return JSON.parse(raw) as WeeklySummary;
  } catch {
    return { users: {} };
  }
}

export async function writeUserWeeklyData(
  userId: string,
  email: string,
  trainingDates: string[]
): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const summary = await readWeeklySummary();
  summary.users[userId] = {
    email,
    trainingDates,
    updatedAt: new Date().toISOString(),
  };
  await fs.writeFile(SUMMARY_PATH, JSON.stringify(summary, null, 2), "utf-8");
}
