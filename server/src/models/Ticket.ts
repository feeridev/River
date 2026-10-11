
import type { ObjectId } from "mongodb";

export type TicketCategory =
  | "HARDWARE"
  | "SOFTWARE"
  | "NETWORK"
  | "ACCOUNT"
  | "ACCESS"
  | "OTHER";

export type TicketPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export type TicketStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED";

export interface Ticket {
  _id?: ObjectId;

  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;

  createdBy: ObjectId;
  assignedTo?: ObjectId | null;

  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date | null;
}
