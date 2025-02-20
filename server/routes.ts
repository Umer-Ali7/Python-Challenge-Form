import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertSubmissionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express) {
  app.post("/api/submissions", async (req, res) => {
    try {
      const submission = insertSubmissionSchema.parse(req.body);
      const result = await storage.createSubmission(submission);
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Failed to submit form" });
      }
    }
  });

  app.get("/api/submissions", async (_req, res) => {
    try {
      const submissions = await storage.getSubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch submissions" });
    }
  });

  return createServer(app);
}
