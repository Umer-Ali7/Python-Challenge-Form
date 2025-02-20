import { type Submission, type InsertSubmission, type User, type InsertUser } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  getSubmissions(): Promise<Submission[]>;
  createUser(user: InsertUser): Promise<User>;
  getUser(id: number): Promise<User | null>;
  getUserByUsername(username: string): Promise<User | null>;
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private submissions: Map<number, Submission>;
  private users: Map<number, User>;
  private currentSubmissionId: number;
  private currentUserId: number;
  public sessionStore: session.Store;

  constructor() {
    this.submissions = new Map();
    this.users = new Map();
    this.currentSubmissionId = 1;
    this.currentUserId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
  }

  async createSubmission(insertSubmission: InsertSubmission): Promise<Submission> {
    const id = this.currentSubmissionId++;
    const submission: Submission = { 
      ...insertSubmission, 
      id,
      feedback: insertSubmission.feedback || null 
    };
    this.submissions.set(id, submission);
    return submission;
  }

  async getSubmissions(): Promise<Submission[]> {
    return Array.from(this.submissions.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getUser(id: number): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return Array.from(this.users.values()).find(user => user.username === username) || null;
  }
}

export const storage = new MemStorage();