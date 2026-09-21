import { promises as fs } from "fs";
import path from "path";

// Server can't read the client's localStorage, so the client pushes a small
// summary of its training session dates here whenever sessions change. The
// weekly-check cron reads it back to decide whether to send a reminder email.
const DATA_DIR = path.join(process.cwd(), "data");
const SUMMARY_PATH = path.join(DATA_DIR, "weekly-summary.json");

export interface WeeklySummary {
  trainingDates: string[];
  updatedAt: string;
}

export async function readWeeklySummary(): Promise<WeeklySummary> {
  try {
    const raw = await fs.readFile(SUMMARY_PATH, "utf-8");
    return JSON.parse(raw) as WeeklySummary;
  } catch {
    return { trainingDates: [], updatedAt: new Date(0).toISOString() };
  }
}

export async function writeWeeklySummary(trainingDates: string[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const summary: WeeklySummary = {
    trainingDates,
    updatedAt: new Date().toISOString(),
  };
  await fs.writeFile(SUMMARY_PATH, JSON.stringify(summary, null, 2), "utf-8");
}
