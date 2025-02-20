import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  rollNumber: text("roll_number").notNull(),
  slot: text("slot").notNull(),
  githubUrl: text("github_url").notNull(),
  feedback: text("feedback"),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  password: text("password").notNull(),
});

export const insertSubmissionSchema = createInsertSchema(submissions)
  .omit({ id: true })
  .extend({
    githubUrl: z.string().url("Please enter a valid GitHub URL").startsWith("https://github.com/", "Must be a GitHub repository URL"),
    rollNumber: z.string().regex(/^\d+$/, "Roll number should only contain numbers"),
    slot: z.enum([
      "MON_2PM_5PM",
      "TUE_9AM_12PM", "TUE_2PM_5PM", "TUE_7PM_10PM",
      "THU_9AM_12PM", "THU_2PM_5PM", "THU_7PM_10PM",
      "FRI_9AM_12PM", "FRI_2PM_5PM", "FRI_7PM_10PM",
      "SAT_9AM_12PM", "SAT_2PM_5PM", "SAT_7PM_10PM",
      "SUN_9AM_12PM", "SUN_2PM_5PM", "SUN_7PM_10PM"
    ], {
      errorMap: () => ({ message: "Please select a valid slot" })
    })
  });

export const insertUserSchema = createInsertSchema(users).omit({ id: true });

export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Submission = typeof submissions.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;