import mongoose from 'mongoose';
import { MONGO_URI, DB_NAME } from '#config';

try {
  await mongoose.connect(MONGO_URI, { dbName: DB_NAME });
  console.log(`✅️ Connected to MongoDB`);
  console.log(`📂 Database: ${mongoose.connection.name}`);
} catch (error) {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
}
