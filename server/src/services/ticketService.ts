
import { ObjectId } from "mongodb";

import type {
  Ticket,
  TicketCategory,
  TicketPriority,
} from "../models/Ticket";

import {
  createTicket,
  findTicketsByCreator,
  findTicketById,
  updateTicketById,
} from "../repositories/ticketRepository";

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

export async function getTicketsForUser(userId: string) {
  if (!ObjectId.isValid(userId)) {
    throw new TicketError("Invalid user ID", 401);
  }

  const tickets = await findTicketsByCreator(userId);

  return tickets.map((ticket) => ({
    id: ticket._id!.toString(),
    title: ticket.title,
    description: ticket.description,
    category: ticket.category,
    priority: ticket.priority,
    status: ticket.status,
    createdBy: ticket.createdBy.toString(),
    assignedTo: ticket.assignedTo?.toString() ?? null,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
    resolvedAt: ticket.resolvedAt ?? null,
  }));
}
export async function getTicketForUser(
  ticketId: string,
  userId: string,
) {
  if (!ObjectId.isValid(userId)) {
    throw new TicketError("Invalid user ID", 401);
  }

  if (!ObjectId.isValid(ticketId)) {
    throw new TicketError("Ticket not found", 404);
  }

  const ticket = await findTicketById(ticketId);

  // Do not reveal tickets belonging to other employees.
  if (!ticket || ticket.createdBy.toString() !== userId) {
    throw new TicketError("Ticket not found", 404);
  }

  return {
    id: ticket._id!.toString(),
    title: ticket.title,
    description: ticket.description,
    category: ticket.category,
    priority: ticket.priority,
    status: ticket.status,
    createdBy: ticket.createdBy.toString(),
    assignedTo: ticket.assignedTo?.toString() ?? null,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
    resolvedAt: ticket.resolvedAt ?? null,
  };
}

type UpdateTicketInput = Partial<{
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
}>;

export async function updateTicketForUser(
  ticketId: string,
  userId: string,
  input: UpdateTicketInput,
) {
  if (!ObjectId.isValid(userId)) {
    throw new TicketError("Invalid user ID", 401);
  }

  if (!ObjectId.isValid(ticketId)) {
    throw new TicketError("Ticket not found", 404);
  }

  const ticket = await findTicketById(ticketId);

  if (!ticket || ticket.createdBy.toString() !== userId) {
    throw new TicketError("Ticket not found", 404);
  }

  if (ticket.status !== "OPEN") {
    throw new TicketError("Only open tickets can be edited", 409);
  }

  const updates: UpdateTicketInput = {};

  if (input.title !== undefined) {
    updates.title = input.title.trim();
  }

  if (input.description !== undefined) {
    updates.description = input.description.trim();
  }

  if (input.category !== undefined) {
    updates.category = input.category;
  }

  if (input.priority !== undefined) {
    updates.priority = input.priority;
  }

  const result = await updateTicketById(
    ticketId,
    userId,
    updates,
  );

  if (result.matchedCount === 0) {
    throw new TicketError(
      "Ticket could not be updated; it may no longer be open",
      409,
    );
  }

  return getTicketForUser(ticketId, userId);
}
