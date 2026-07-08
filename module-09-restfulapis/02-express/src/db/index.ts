import mongoose from "mongoose";

try {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI)
    throw new Error("MONGO_URI is missing, please check your .env file");

  await mongoose.connect(MONGO_URI);
  console.log(`✅️ Connected to MongoDB`);
  console.log(`📂 Database: ${mongoose.connection.name}`);
} catch (error) {
  console.error("❌ MongoDB connection error:", error);
  process.exit(1);
}
