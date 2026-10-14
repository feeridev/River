import { client } from "../config/database";

type SetupStatus = "PENDING" | "INITIALIZING" | "COMPLETE";

interface SetupState {
  _id: string;
  status: SetupStatus;
  updatedAt: Date;
}

const setupStates = client
  .db("river")
  .collection<SetupState>("setup_state");

const SETUP_ID = "initial-admin";
const LOCK_TIMEOUT_MS = 2 * 60 * 1000;

export async function ensureSetupState(hasAdmin: boolean) {
  const current = await setupStates.findOne({ _id: SETUP_ID });

  if (!current) {
    try {
      await setupStates.insertOne({
        _id: SETUP_ID,
        status: hasAdmin ? "COMPLETE" : "PENDING",
        updatedAt: new Date(),
      });
    } catch (error) {
      // Another server process may have initialized the state first.
      const mongoError = error as { code?: number };

      if (mongoError.code !== 11000) {
        throw error;
      }
    }

    return;
  }

  if (hasAdmin && current.status !== "COMPLETE") {
    await setupStates.updateOne(
      { _id: SETUP_ID },
      {
        $set: {
          status: "COMPLETE",
          updatedAt: new Date(),
        },
      },
    );
  }
}

export async function getSetupState() {
  return setupStates.findOne({ _id: SETUP_ID });
}

export async function claimInitialAdminSetup() {
  const now = new Date();
  const expiredBefore = new Date(now.getTime() - LOCK_TIMEOUT_MS);

  const result = await setupStates.updateOne(
    {
      _id: SETUP_ID,
      $or: [
        { status: "PENDING" },
        {
          status: "INITIALIZING",
          updatedAt: { $lt: expiredBefore },
        },
      ],
    },
    {
      $set: {
        status: "INITIALIZING",
        updatedAt: now,
      },
    },
  );

  return result.modifiedCount === 1;
}

export async function completeInitialAdminSetup() {
  await setupStates.updateOne(
    { _id: SETUP_ID },
    {
      $set: {
        status: "COMPLETE",
        updatedAt: new Date(),
      },
    },
  );
}

export async function releaseInitialAdminSetup() {
  await setupStates.updateOne(
    { _id: SETUP_ID, status: "INITIALIZING" },
    {
      $set: {
        status: "PENDING",
        updatedAt: new Date(),
      },
    },
  );
}
