import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  createMeeting,
  getMeetings,
  getMeetingById,
  updateMeetingParticipants,
  deleteMeeting,
} from "../controllers/meetingController.js";

const router = express.Router();

// Créer une nouvelle réunion
router.post("/", protect, createMeeting);

// Récupérer toutes les réunions de l'utilisateur
router.get("/", protect, getMeetings);

// Récupérer une réunion spécifique
router.get("/:id", protect, getMeetingById);

// Mettre à jour les participants/temps de parole
router.put("/:id", protect, updateMeetingParticipants);

// Supprimer une réunion
router.delete("/:id", protect, deleteMeeting);

export default router;
