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

export const insertSubmissionSchema = createInsertSchema(submissions)
  .omit({ id: true })
  .extend({
    githubUrl: z.string().url("Please enter a valid GitHub URL").startsWith("https://github.com/", "Must be a GitHub repository URL"),
    rollNumber: z.string().regex(/^\d+$/, "Roll number should only contain numbers"),
    slot: z.enum(["MON_2PM_5PM", "TUE_9AM_12PM"], {
      errorMap: () => ({ message: "Please select a valid slot" })
    })
  });

export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Submission = typeof submissions.$inferSelect;