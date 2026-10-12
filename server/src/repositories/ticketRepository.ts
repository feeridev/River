
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
}export async function assignTicketToAgent(
  ticketId: string,
  agentId: string,
) {
  if (!ObjectId.isValid(ticketId) || !ObjectId.isValid(agentId)) {
    return null;
  }

  return tickets.updateOne(
    { _id: new ObjectId(ticketId) },
    {
      $set: {
        assignedTo: new ObjectId(agentId),
        updatedAt: new Date(),
      },
    },
  );
}

export async function findTicketsAccessibleToUser(
  userId: string,
  role: "EMPLOYEE" | "AGENT" | "ADMIN",
) {
  if (!ObjectId.isValid(userId)) {
    return [];
  }

  const userObjectId = new ObjectId(userId);

  const filter =
    role === "ADMIN"
      ? {}
      : role === "AGENT"
        ? {
            $or: [
              { createdBy: userObjectId },
              { assignedTo: userObjectId },
            ],
          }
        : { createdBy: userObjectId };

  return tickets
    .find(filter)
    .sort({ createdAt: -1 })
    .toArray();
}

export async function findTicketAccessibleToUser(
  ticketId: string,
  userId: string,
  role: "EMPLOYEE" | "AGENT" | "ADMIN",
) {
  if (!ObjectId.isValid(ticketId) || !ObjectId.isValid(userId)) {
    return null;
  }

  const userObjectId = new ObjectId(userId);

  const filter =
    role === "ADMIN"
      ? { _id: new ObjectId(ticketId) }
      : role === "AGENT"
        ? {
            _id: new ObjectId(ticketId),
            $or: [
              { createdBy: userObjectId },
              { assignedTo: userObjectId },
            ],
          }
        : {
            _id: new ObjectId(ticketId),
            createdBy: userObjectId,
          };

  return tickets.findOne(filter);
}