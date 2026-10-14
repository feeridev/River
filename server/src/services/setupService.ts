import { MongoServerError } from "mongodb";
import type { User } from "../models/User";
import {
  createUser,
  findUserByEmail,
  hasAnyAdmin,
} from "../repositories/userRepository";
import {
  claimInitialAdminSetup,
  completeInitialAdminSetup,
  getSetupState,
  releaseInitialAdminSetup,
} from "../repositories/setupRepository";
import { hashPassword } from "../utils/password";

export class SetupError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "SetupError";
  }
}

export async function getInitialSetupStatus() {
  const hasAdmin = await hasAnyAdmin();

  if (hasAdmin) {
    await completeInitialAdminSetup();
    return { setupRequired: false };
  }

  const state = await getSetupState();

  return {
    setupRequired: state?.status === "PENDING",
  };
}

export async function createInitialAdmin(input: {
  name: string;
  email: string;
  password: string;
}) {
  if (await hasAnyAdmin()) {
    await completeInitialAdminSetup();
    throw new SetupError(
      "Initial administrator setup has already been completed",
      409,
    );
  }

  const claimed = await claimInitialAdminSetup();

  if (!claimed) {
    throw new SetupError(
      "Setup is unavailable or already in progress",
      409,
    );
  }

  try {
    // Recheck after claiming setup to avoid racing with another admin creation.
    if (await hasAnyAdmin()) {
      await completeInitialAdminSetup();
      throw new SetupError(
        "An administrator already exists",
        409,
      );
    }

    const email = input.email.trim().toLowerCase();
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      throw new SetupError(
        "This email is already registered. Use a different email.",
        409,
      );
    }

    const now = new Date();

    const user: User = {
      name: input.name.trim(),
      email,
      passwordHash: await hashPassword(input.password),
      role: "ADMIN",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    const result = await createUser(user);

    await completeInitialAdminSetup();

    return {
      id: result.insertedId.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  } catch (error) {
    // Never reopen setup if an administrator was successfully created.
    if (!(await hasAnyAdmin())) {
      await releaseInitialAdminSetup();
    }

    if (error instanceof SetupError) {
      throw error;
    }

    if (
      error instanceof MongoServerError &&
      error.code === 11000
    ) {
      throw new SetupError("This email is already registered", 409);
    }

    throw error;
  }
}
