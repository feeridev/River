
import { MongoServerError } from "mongodb";
import type { User } from "../models/User";
import { createUser, findUserByEmail } from "../repositories/userRepository";
import { hashPassword } from "../utils/password";

export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}) {
  const email = input.email.trim().toLowerCase();

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new AuthError("Email is already registered", 409);
  }

  const now = new Date();

  const user: User = {
    name: input.name.trim(),
    email,
    passwordHash: await hashPassword(input.password),
    role: "EMPLOYEE",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };

  try {
    const result = await createUser(user);

    return {
      id: result.insertedId.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  } catch (error) {
    // Handle concurrent registrations for the same email.
    if (
      error instanceof MongoServerError &&
      error.code === 11000
    ) {
      throw new AuthError("Email is already registered", 409);
    }

    throw error;
  }
}
