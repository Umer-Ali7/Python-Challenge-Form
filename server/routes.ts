import type { Express, Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertSubmissionSchema } from "@shared/schema";
import { z } from "zod";
import { setupAuth, hashPassword } from "./auth";

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

export async function registerRoutes(app: Express) {
  // Set up authentication
  setupAuth(app);

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

  // Protected route - only accessible after login
  app.get("/api/submissions", requireAuth, async (_req, res) => {
    try {
      const submissions = await storage.getSubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch submissions" });
    }
  });

  // Create initial admin user if it doesn't exist
  const hashedPassword = await hashPassword("UmerAdmin01");
  const existingAdmin = await storage.getUserByUsername("admin");
  if (!existingAdmin) {
    await storage.createUser({
      username: "admin",
      password: hashedPassword,
    });
  }

  return createServer(app);
}