// app.js import dependances
import express from 'express';
import cors from 'cors';
import connectDB from "./config/db.js";
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
/*import meetingRoutes from './routes/meetingRoutes.js';
import groupRoutes from './routes/groupRoutes.js';*/

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Connexion à la base MongoDB
connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("API SpeakTime opérationnelle 🚀");
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
/*app.use("/api/meetings", meetingRoutes);
app.use("/api/groups", groupRoutes);*/

export default app;
