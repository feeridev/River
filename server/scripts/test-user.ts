
import "dotenv/config";
import { MongoClient, ObjectId } from "mongodb";
import type { User } from "../src/models/User";

async function testUserRepository() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not defined");
  }

  const client = new MongoClient(uri);
  const users = client.db("river").collection<User>("users");

  const testEmail = `river-test-${new ObjectId().toHexString()}@example.invalid`;

  try {
    await client.connect();

    const testUser: User = {
      name: "River Database Test",
      email: testEmail,
      passwordHash: "TEST_ONLY_NOT_A_REAL_PASSWORD",
      role: "EMPLOYEE",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const insertResult = await users.insertOne(testUser);
    console.log("1. Insert succeeded:", insertResult.acknowledged);

    const foundUser = await users.findOne({ email: testEmail });
    console.log("2. Read succeeded:", foundUser?.name === testUser.name);

    const deleteResult = await users.deleteOne({ _id: insertResult.insertedId });
    console.log("3. Cleanup succeeded:", deleteResult.deletedCount === 1);
  } finally {
    await client.close();
  }
}

testUserRepository().catch((error) => {
  console.error("Database test failed:", error);
  process.exitCode = 1;
});
