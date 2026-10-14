import { ObjectId } from "mongodb";
import type { UserRole } from "../models/User";
import {
  countActiveAdmins,
  findUserById,
  listUsers,
  updateUserActiveStatus,
  updateUserRole,
} from "../repositories/userRepository";

export class UserManagementError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "UserManagementError";
  }
}

export async function getUsersForAdmin() {
  const users = await listUsers();

  return users.map((user) => ({
    id: user._id?.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }));
}

export async function changeManagedUserRole(
  targetId: string,
  role: "EMPLOYEE" | "AGENT",
) {
  if (!ObjectId.isValid(targetId)) {
    throw new UserManagementError("Invalid user ID", 400);
  }

  const target = await findUserById(targetId);

  if (!target) {
    throw new UserManagementError("User not found", 404);
  }

  if (target.role === "ADMIN") {
    throw new UserManagementError(
      "Administrator roles cannot be changed through this endpoint",
      409,
    );
  }

  if (target.role === role) {
    return target;
  }

  const updated = await updateUserRole(targetId, role);

  if (!updated) {
    throw new UserManagementError(
      "The user's role could not be updated",
      409,
    );
  }

  return findUserById(targetId);
}

export async function changeManagedUserActiveStatus(
  targetId: string,
  isActive: boolean,
  actorId: string,
) {
  if (!ObjectId.isValid(targetId)) {
    throw new UserManagementError("Invalid user ID", 400);
  }

  const target = await findUserById(targetId);

  if (!target) {
    throw new UserManagementError("User not found", 404);
  }

  if (targetId === actorId && !isActive) {
    throw new UserManagementError(
      "You cannot deactivate your own administrator account",
      409,
    );
  }

  if (target.role === "ADMIN" && !isActive) {
    const activeAdminCount = await countActiveAdmins();

    if (target.isActive && activeAdminCount <= 1) {
      throw new UserManagementError(
        "The last active administrator cannot be deactivated",
        409,
      );
    }
  }

  if (target.isActive === isActive) {
    return target;
  }

  const updated = await updateUserActiveStatus(targetId, isActive);

  if (!updated) {
    throw new UserManagementError(
      "The user's account status could not be updated",
      409,
    );
  }

  return findUserById(targetId);
}
