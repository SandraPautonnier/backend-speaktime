// app.js import dependances
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js";

const app = express();

// Configuration CORS - Accepter localhost ET production
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://speaktime.vercel.app",
  process.env.FRONTEND_URL, // Variable d'environnement additionnelle
].filter(Boolean); // Enlever les undefined

const corsOptions = {
  origin: (origin, callback) => {
    // Permettre les requêtes sans origin (Mobile, Postman, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS non autorisé"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 3600,
};

// Middlewares - IMPORTANT: Placer CORS AVANT les routes
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connexion à la base MongoDB
connectDB();

// Routes de test
app.get("/", (req, res) => {
  res.status(200).json({ message: "API SpeakTime opérationnelle ✅" });
});

app.get("/api/auth/test", (req, res) => {
  res.status(200).json({
    message: "Backend fonctionne ✅",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "unknown",
  });
});

// Routes protégées
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/meetings", meetingRoutes);

// Gestion des 404
app.use((req, res) => {
  res.status(404).json({
    message: "Route non trouvée",
    path: req.path,
    method: req.method,
  });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error("Erreur:", err);
  res.status(err.status || 500).json({
    message: "Erreur serveur",
  });
});

export default app;
