
import { ObjectId } from "mongodb";
import type {
  Ticket,
  TicketCategory,
  TicketPriority,
} from "../models/Ticket";
import { createTicket } from "../repositories/ticketRepository";

export class TicketError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "TicketError";
  }
}

interface CreateTicketInput {
  title: string;
  description: string;
  category: TicketCategory;
  priority?: TicketPriority;
}

export async function createNewTicket(
  input: CreateTicketInput,
  userId: string,
) {
  if (!ObjectId.isValid(userId)) {
    throw new TicketError("Invalid user ID", 401);
  }

  const title = input.title.trim();
  const description = input.description.trim();

  if (title.length < 5 || title.length > 120) {
    throw new TicketError(
      "Title must be between 5 and 120 characters",
      400,
    );
  }

  if (description.length < 10 || description.length > 5000) {
    throw new TicketError(
      "Description must be between 10 and 5000 characters",
      400,
    );
  }

  const now = new Date();

  const ticket: Ticket = {
    title,
    description,
    category: input.category,
    priority: input.priority ?? "MEDIUM",
    status: "OPEN",
    createdBy: new ObjectId(userId),
    assignedTo: null,
    createdAt: now,
    updatedAt: now,
    resolvedAt: null,
  };

  const result = await createTicket(ticket);

  return {
    id: result.insertedId.toString(),
    title: ticket.title,
    description: ticket.description,
    category: ticket.category,
    priority: ticket.priority,
    status: ticket.status,
    createdBy: ticket.createdBy.toString(),
    assignedTo: null,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
  };
}
