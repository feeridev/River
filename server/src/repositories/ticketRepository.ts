
import { Collection, ObjectId } from "mongodb";
import { client } from "../config/database";
import type { Ticket } from "../models/Ticket";

const tickets: Collection<Ticket> = client
  .db("river")
  .collection<Ticket>("tickets");

export async function createTicket(ticket: Ticket) {
  return tickets.insertOne(ticket);
}

export async function findTicketById(id: string) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  return tickets.findOne({ _id: new ObjectId(id) });
}

export async function findTicketsByCreator(userId: string) {
  if (!ObjectId.isValid(userId)) {
    return [];
  }

  return tickets
    .find({ createdBy: new ObjectId(userId) })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function ensureTicketIndexes() {
  await tickets.createIndex({ createdBy: 1, createdAt: -1 });
  await tickets.createIndex({ assignedTo: 1, status: 1 });
  await tickets.createIndex({ status: 1, priority: 1 });
}

export async function updateTicketById(
  id: string,
  userId: string,
  updates: Partial<
    Pick<Ticket, "title" | "description" | "category" | "priority">
  >,
) {
  return tickets.updateOne(
    {
      _id: new ObjectId(id),
      createdBy: new ObjectId(userId),
      status: "OPEN",
    },
    {
      $set: {
        ...updates,
        updatedAt: new Date(),
      },
    },
  );
}
