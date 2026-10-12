import type { ObjectId } from "mongodb";

export interface TicketMessage {
  _id?: ObjectId;
  ticketId: ObjectId;
  senderId: ObjectId;
  body: string;
  createdAt: Date;
}
