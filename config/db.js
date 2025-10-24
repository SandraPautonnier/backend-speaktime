import mongoose from "mongoose";
import dotenv from 'dotenv';

// Charge les variables d'environnement
dotenv.config();

const mongoUri = process.env.MONGO_URI;

export const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1); // quitte le serveur si la DB n’est pas dispo
  }
};
export default connectDB;
