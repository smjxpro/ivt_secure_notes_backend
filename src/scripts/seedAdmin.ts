import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../models/User";

dotenv.config();

export const seedAdmin = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI environment variable is required");
  }

  const adminName = process.env.ADMIN_NAME;
  if (!adminName) {
    throw new Error("ADMIN_NAME environment variable is required");
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    throw new Error("ADMIN_EMAIL environment variable is required");
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error("ADMIN_PASSWORD environment variable is required");
  }

  await mongoose.connect(mongoUri);

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const existingUser = await User.findOne({ email: adminEmail });

    if (existingUser) {
      existingUser.name = adminName;
      existingUser.password = hashedPassword;
      existingUser.role = "admin";
      await existingUser.save();
      console.log(`Admin user '${adminEmail}' updated successfully.`);
    } else {
      await User.create({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        interests: ["Administration"],
      });
      console.log(`Admin user '${adminEmail}' created successfully.`);
    }
  } finally {
    await mongoose.disconnect();
  }
};

if (require.main === module) {
  seedAdmin()
    .then(() => {
      console.log("Admin seed completed.");
      process.exit(0);
    })
    .catch((error: unknown) => {
      console.error("Admin seed failed:", error);
      process.exit(1);
    });
}

