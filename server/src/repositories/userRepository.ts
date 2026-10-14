import { client } from "../config/database";
import type { User } from "../models/User";
import { Collection, ObjectId } from "mongodb";

const users: Collection<User> = client
  .db("river")
  .collection<User>("users");

export async function createUser(user: User) {
  return users.insertOne(user);
}

export async function findUserByEmail(email: string) {
  return users.findOne({
    email: email.trim().toLowerCase(),
  });
}

export async function listUsers() {
  return users
    .find(
      {},
      {
        projection: { passwordHash: 0 },
      },
    )
    .toArray();
}

export async function ensureUserIndexes() {
  await users.createIndex(
    { email: 1 },
    { unique: true },
  );    
}
export async function findUserById(id: string) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  return users.findOne(
    { _id: new ObjectId(id) },
    { projection: { passwordHash: 0 } },
  );
}
export async function hasAnyAdmin() {
  return (
    (await users.findOne(
      { role: "ADMIN" },
      { projection: { _id: 1 } },
    )) !== null
  );
}

export async function updateUserRole(
  id: string,
  role: "EMPLOYEE" | "AGENT",
) {
  if (!ObjectId.isValid(id)) {
    return false;
  }

  const result = await users.updateOne(
    {
      _id: new ObjectId(id),
      role: { $in: ["EMPLOYEE", "AGENT"] },
    },
    {
      $set: {
        role,
        updatedAt: new Date(),
      },
    },
  );

  return result.modifiedCount === 1;
}

export async function updateUserActiveStatus(
  id: string,
  isActive: boolean,
) {
  if (!ObjectId.isValid(id)) {
    return false;
  }

  const result = await users.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        isActive,
        updatedAt: new Date(),
      },
    },
  );

  return result.modifiedCount === 1;
}

export async function countActiveAdmins() {
  return users.countDocuments({
    role: "ADMIN",
    isActive: true,
  });
}
