import mongoose from "mongoose";
import dotenv from "dotenv";

// Charge les variables d'environnement
dotenv.config();

const mongoUri = process.env.MONGO_URI;

export const connectDB = async () => {
  try {
    if (!mongoUri) {
      throw new Error("MONGO_URI environment variable is not defined");
    }
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1); // quitte le serveur si la DB n'est pas dispo
  }
};
export default connectDB;
