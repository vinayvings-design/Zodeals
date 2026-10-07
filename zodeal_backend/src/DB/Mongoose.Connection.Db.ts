import mongoose from "mongoose";

const ATLAS_URL = process.env.MONGO_URL || "";

const LOCAL_URL =
  process.env.MONGO_LOCAL_URL || "mongodb://localhost:27017/zo_deals";

export const connectDB = async () => {
  try {
    await mongoose.connect(ATLAS_URL, {
      serverSelectionTimeoutMS: 15000,
      autoCreate: false,
    });
    console.log("✅ Connected to MongoDB");
    try {
      await mongoose.connection.collection("agents").dropIndex("code_1");
    } catch {}
  } catch (atlasError) {
    console.warn("⚠️ Primary DB failed, trying Local MongoDB...", atlasError);
    try {
      await mongoose.connect(LOCAL_URL, {
        serverSelectionTimeoutMS: 10000,
        autoCreate: false,
      });
      console.log("✅ Connected to Local MongoDB");
    } catch (localError) {
      console.error("❌ All DB connections failed", localError);
    }
  }
};
