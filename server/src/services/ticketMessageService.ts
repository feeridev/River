
import { ObjectId } from "mongodb";

import type { TicketMessage } from "../models/TicketMessage";
import type { UserRole } from "../models/User";

import {
  createTicketMessage,
  findMessagesByTicket,
} from "../repositories/ticketMessageRepository";

import { findTicketAccessibleToUser } from "../repositories/ticketRepository";
import { findUserById } from "../repositories/userRepository";

export class TicketMessageError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "TicketMessageError";
  }
}

async function verifyTicketAccess(
  ticketId: string,
  userId: string,
  role: UserRole,
) {
  if (!ObjectId.isValid(userId)) {
    throw new TicketMessageError("Invalid user ID", 401);
  }

  if (!ObjectId.isValid(ticketId)) {
    throw new TicketMessageError("Ticket not found", 404);
  }

  const ticket = await findTicketAccessibleToUser(
    ticketId,
    userId,
    role,
  );

  if (!ticket) {
    throw new TicketMessageError("Ticket not found", 404);
  }

  return ticket;
}

export async function sendTicketMessage(
  ticketId: string,
  userId: string,
  role: UserRole,
  body: string,
) {
    const ticket = await verifyTicketAccess(
    ticketId,
    userId,
    role,
  );

  if (ticket.status === "CLOSED") {
    throw new TicketMessageError(
      "This ticket is closed. Reopen it before sending a reply.",
      409,
    );
  }

  const trimmedBody = body.trim();

  if (!trimmedBody) {
    throw new TicketMessageError("Message cannot be empty", 400);
  }

  const message: TicketMessage = {
    ticketId: new ObjectId(ticketId),
    senderId: new ObjectId(userId),
    body: trimmedBody,
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
  role: UserRole,
) {
  await verifyTicketAccess(ticketId, userId, role);

  const messages = await findMessagesByTicket(ticketId);

  return Promise.all(
    messages.map(async (message) => {
      const senderId = message.senderId.toString();
      const sender = await findUserById(senderId);

      return {
        id: message._id!.toString(),
        ticketId: message.ticketId.toString(),
        senderId,
        senderName: sender?.name ?? "Unknown user",
        senderRole: sender?.role ?? "UNKNOWN",
        body: message.body,
        createdAt: message.createdAt,
      };
    }),
  );
}
