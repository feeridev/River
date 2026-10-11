
import type { ObjectId } from "mongodb";

export type UserRole = "EMPLOYEE" | "AGENT" | "ADMIN";

export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
