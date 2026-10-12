import { ObjectId } from "mongodb";

import type { TicketMessage } from "../models/TicketMessage";
import {
  createTicketMessage,
  findMessagesByTicket,
} from "../repositories/ticketMessageRepository";
import { findTicketById } from "../repositories/ticketRepository";

export class TicketMessageError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "TicketMessageError";
  }
}

async function verifyTicketAccess(ticketId: string, userId: string) {
  if (!ObjectId.isValid(userId)) {
    throw new TicketMessageError("Invalid user ID", 401);
  }

  if (!ObjectId.isValid(ticketId)) {
    throw new TicketMessageError("Ticket not found", 404);
  }

  const ticket = await findTicketById(ticketId);

  if (!ticket || ticket.createdBy.toString() !== userId) {
    throw new TicketMessageError("Ticket not found", 404);
  }

  return ticket;
}

export async function sendTicketMessage(
  ticketId: string,
  userId: string,
  body: string,
) {
  await verifyTicketAccess(ticketId, userId);

  const message: TicketMessage = {
    ticketId: new ObjectId(ticketId),
    senderId: new ObjectId(userId),
    body: body.trim(),
    createdAt: new Date(),
  };

  const result = await createTicketMessage(message);

  return {
    id: result.insertedId.toString(),
    ticketId,
    senderId: userId,
    body: message.body,
    createdAt: message.createdAt,
  };
}

export async function getTicketMessages(
  ticketId: string,
  userId: string,
) {
  await verifyTicketAccess(ticketId, userId);

  const messages = await findMessagesByTicket(ticketId);

  return messages.map((message) => ({
    id: message._id!.toString(),
    ticketId: message.ticketId.toString(),
    senderId: message.senderId.toString(),
    body: message.body,
    createdAt: message.createdAt,
  }));
}
