import { Collection, ObjectId } from "mongodb";
import { client } from "../config/database";
import type { TicketMessage } from "../models/TicketMessage";

const messages: Collection<TicketMessage> = client
  .db("river")
  .collection<TicketMessage>("ticket_messages");

export async function createTicketMessage(message: TicketMessage) {
  return messages.insertOne(message);
}

export async function findMessagesByTicket(ticketId: string) {
  if (!ObjectId.isValid(ticketId)) {
    return [];
  }

  return messages
    .find({ ticketId: new ObjectId(ticketId) })
    .sort({ createdAt: 1 })
    .toArray();
}

export async function ensureTicketMessageIndexes() {
  await messages.createIndex({ ticketId: 1, createdAt: 1 });
  await messages.createIndex({ senderId: 1, createdAt: -1 });
}
