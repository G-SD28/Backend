import mongoose from "mongoose";

try {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI)
    throw new Error("MONGO_URI fehlt, bitte .env Datei überprüfen.");

  await mongoose.connect(MONGO_URI);
  console.log(`✅️ Verbunden mit MongoDB`);
  console.log(`📂 Datenbank: ${mongoose.connection.name}`);
} catch (error) {
  console.error("❌ MongoDB Verbindungsfehler:", error);
  process.exit(1);
}
